import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tableName = formData.get('tableName') as string;
    const cmnyId = formData.get('cmnyId') as string;
    const yearMonth = formData.get('yearMonth') as string;

    if (!file || !tableName) {
      return NextResponse.json({ error: 'Missing file or tableName' }, { status: 400 });
    }

    const csvText = await file.text();
    
    // CSV 파싱
    const { data, errors: parseErrors } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parseErrors.length > 0) {
      return NextResponse.json({ error: 'CSV Parsing Error', details: parseErrors }, { status: 400 });
    }

    // raw_uploads 기록 시작
    const { data: uploadLog, error: logError } = await supabase
      .from('raw_uploads')
      .insert({
        filename: file.name,
        table_name: tableName,
        status: 'pending',
        cmny_id: cmnyId ? parseInt(cmnyId) : null,
        year_month: yearMonth || null,
        admin_id: user.id,
      })
      .select()
      .single();

    if (logError) {
      console.error('Logging error:', logError);
    }

    // Upsert 처리
    // Supabase .upsert()는 onConflict 옵션을 사용하여 중복 시 업데이트 처리
    // 각 테이블별로 onConflict 컬럼을 지정해야 함
    const conflictColumns: Record<string, string> = {
      monthly_summary: 'cmny_id,year_month',
      utilization_vehicle: 'cmny_id,year_month,vehicle_no',
      monthly_mileage: 'cmny_id,year_month,vehicle_no',
      driving_logs: 'cmny_id,vehicle_no,log_date',
      safety_scores: 'cmny_id,year_month,driver_name',
      maintenance_records: 'cmny_id,vehicle_no,check_in_date,maintenance_type',
      accidents: 'cmny_id,vehicle_no,accident_datetime',
      violations: 'cmny_id,vehicle_no,violation_datetime',
      companies: 'cmny_id',
    };

    const onConflict = conflictColumns[tableName];
    if (!onConflict) {
      return NextResponse.json({ error: 'Unsupported table for upsert' }, { status: 400 });
    }

    // 데이터 클렌징 (null 값 처리 등)
    const cleanedData = data.map((row: any) => {
      const cleaned: any = {};
      
      // 모든 필드에 대해 빈 값 처리 (빈 문자열, "null" 문자열 -> null)
      Object.keys(row).forEach(key => {
        const val = row[key];
        if (
          val === '' || 
          val === undefined || 
          val === null || 
          (typeof val === 'string' && (val.toLowerCase() === 'null' || val.trim() === ''))
        ) {
          cleaned[key] = null;
        } else {
          cleaned[key] = val;
        }
      });

      // cmnyId 강제 적용 (단일 고객사 업로드인 경우)
      if (cmnyId) {
        cleaned.cmny_id = parseInt(cmnyId);
      }
      
      // yearMonth 적용 (CSV에 없거나 수동 입력된 전달받은 값이 있는 경우)
      if (yearMonth && !cleaned.year_month) {
        cleaned.year_month = yearMonth;
      }
      
      // Boolean 처리 (is_paid, is_transferred 등)
      if (tableName === 'violations') {
        if (typeof cleaned.is_paid === 'string') {
          cleaned.is_paid = cleaned.is_paid.toLowerCase() === 'true';
        }
        if (typeof cleaned.is_transferred === 'string') {
          cleaned.is_transferred = cleaned.is_transferred.toLowerCase() === 'true';
        }
      }
      return cleaned;
    });

    // 1000개씩 끊어서 업로드 (Supabase 제한 고려)
    const CHUNK_SIZE = 1000;
    let inserted = 0;
    let updated = 0; // upsert는 명확히 구분되지 않으므로 전체 성공 건수로 표시될 수 있음
    const errors: any[] = [];

    for (let i = 0; i < cleanedData.length; i += CHUNK_SIZE) {
      const chunk = cleanedData.slice(i, i + CHUNK_SIZE);
      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(chunk, { onConflict });

      if (upsertError) {
        errors.push({ 
          chunk: i / CHUNK_SIZE + 1, 
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code
        });
      } else {
        inserted += chunk.length;
      }
    }

    // 결과 업데이트
    const finalStatus = errors.length === 0 ? 'success' : 'fail';
    const resultSummary = {
      total: cleanedData.length,
      processed: inserted,
      errors: errors,
    };

    if (uploadLog) {
      await supabase
        .from('raw_uploads')
        .update({
          status: finalStatus,
          result_summary: resultSummary,
        })
        .eq('id', uploadLog.id);
    }

    return NextResponse.json({
      status: finalStatus,
      summary: resultSummary,
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
