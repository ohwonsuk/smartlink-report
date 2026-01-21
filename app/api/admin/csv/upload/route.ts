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

  let uploadLog: any = null;

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
    const { data: logData, error: logError } = await supabase
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

    uploadLog = logData;

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
      driving_logs: 'cmny_id,vehicle_no,log_date,odometer_start',
      safety_scores: 'cmny_id,year_month,driver_name',
      maintenance_records: 'cmny_id,vehicle_no,check_in_date,maintenance_type',
      accidents: 'cmny_id,reception_no',
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
        const trimmedKey = key.trim();
        let val = row[key];

        // 문자열인 경우 앞뒤 공백 제거
        if (typeof val === 'string') {
          val = val.trim();
        }

        if (
          val === '' || 
          val === undefined || 
          val === null || 
          (typeof val === 'string' && (val.toLowerCase() === 'null' || val.trim() === ''))
        ) {
          cleaned[trimmedKey] = null;
        } else {
          // 날짜 형식 보정 (YYYY.MM.DD 또는 YYYY.M.D -> YYYY-MM-DD)
          if (typeof val === 'string' && /^\d{4}\.\d{1,2}\.\d{1,2}$/.test(val)) {
            const parts = val.split('.');
            const year = parts[0];
            const month = parts[1].padStart(2, '0');
            const day = parts[2].padStart(2, '0');
            val = `${year}-${month}-${day}`;
          }
          cleaned[trimmedKey] = val;
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


    // Vercel 타임아웃(보통 10s~60s)을 고려한 설정
    const CHUNK_SIZE = 200; // 청크 크기를 줄여 개별 재시도 속도 향상
    const START_TIME = Date.now();
    const TIMEOUT_LIMIT = 50000; // 50초 이후에는 중단하고 결과 반환
    
    let successfulCount = 0;
    const failedRows: any[] = [];
    const chunkErrors: any[] = [];
    let isTimedOut = false;

    for (let i = 0; i < cleanedData.length; i += CHUNK_SIZE) {
      // 타임아웃 체크
      if (Date.now() - START_TIME > TIMEOUT_LIMIT) {
        console.warn('Upload process timeout approaching, stopping early...');
        isTimedOut = true;
        break;
      }

      const chunk = cleanedData.slice(i, i + CHUNK_SIZE);
      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(chunk, { onConflict });

      if (upsertError) {
        // 청크 전체 실패 시, 개별 행 단위로 재시도하여 실패 행 식별
        console.warn(`Chunk ${i / CHUNK_SIZE + 1} failed, retrying row by row...`);
        let consecutiveErrors = 0;
        
        for (const row of chunk) {
          // 개별 행 처리 중에도 타임아웃 체크
          if (Date.now() - START_TIME > TIMEOUT_LIMIT) {
            isTimedOut = true;
            break;
          }

          const { error: rowError } = await supabase
            .from(tableName)
            .upsert(row, { onConflict });
          
          if (rowError) {
            failedRows.push({
              data: row,
              error: rowError.message,
              details: rowError.details,
              code: rowError.code
            });
            consecutiveErrors++;
            
            // 만약 20행 연속 실패하거나 총 실패가 너무 많으면 전체 스키마 문제로 판단하고 조기 중단
            if (consecutiveErrors >= 20 || failedRows.length >= 1000) {
              console.error('Too many consecutive errors, likely schema mismatch. Stopping...');
              isTimedOut = false; // 타임아웃은 아니지만 중단됨을 알림
              break; 
            }
          } else {
            successfulCount++;
            consecutiveErrors = 0; // 성공하면 카운트 초기화
          }
        }
        
        chunkErrors.push({
          chunk: i / CHUNK_SIZE + 1,
          message: upsertError.message,
          code: upsertError.code
        });

        if (isTimedOut || failedRows.length >= 1000) break;
      } else {
        successfulCount += chunk.length;
      }
    }

    // 결과 업데이트
    const finalStatus = isTimedOut ? 'timeout' : (failedRows.length === 0 ? 'success' : 'fail');
    const resultSummary = {
      total: cleanedData.length,
      processed: successfulCount,
      failed: failedRows.length,
      is_timeout: isTimedOut,
      failed_rows: failedRows.slice(0, 500),
      chunk_errors: chunkErrors,
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
    
    // 에러 발생 시 로그 업데이트 시도
    try {
      if (uploadLog?.id) {
        await supabase
          .from('raw_uploads')
          .update({
            status: 'fail',
            result_summary: { error: error.message, stack: error.stack }
          })
          .eq('id', uploadLog.id);
      }
    } catch (e) {
      console.error('Failed to update error status:', e);
    }

    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
