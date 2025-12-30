import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    // 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 프로필 확인 (승인된 사용자만)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_approved, role')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_approved && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 요청 파라미터
    const { cmnyId, yearMonth } = await request.json();

    if (!cmnyId || !yearMonth) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 캐시 확인
    const { data: existingFile } = await supabase
      .from('report_files')
      .select('*')
      .eq('cmny_id', cmnyId)
      .eq('year_month', yearMonth.replace('-', ''))
      .eq('file_type', 'pdf')
      .single();

    // 캐시가 유효하면 URL 반환
    if (existingFile && existingFile.expires_at) {
      const expiresAt = new Date(existingFile.expires_at);
      if (expiresAt > new Date()) {
        const { data: signedUrl } = await supabase.storage
          .from('reports')
          .createSignedUrl(existingFile.storage_path, 60 * 60); // 1시간 유효

        if (signedUrl) {
          return NextResponse.json({
            success: true,
            url: signedUrl.signedUrl,
            cached: true,
            fileId: existingFile.file_id,
          });
        }
      }
    }

    // 고객사 정보 조회
    const { data: company } = await supabase
      .from('companies')
      .select('cmny_nm')
      .eq('cmny_id', cmnyId)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // PDF 생성
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800'],
    });

    const page = await browser.newPage();

    // 리포트 페이지 기본 URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 쿠키 전달 (인증 유지)
    const cookieList = request.cookies.getAll();
    const domain = new URL(baseUrl).hostname;
    
    for (const cookie of cookieList) {
      await page.setCookie({
        name: cookie.name,
        value: cookie.value,
        domain: domain === 'localhost' ? 'localhost' : domain,
        path: '/',
        secure: domain !== 'localhost',
        sameSite: 'Lax',
      });
    }

    // 뷰포트 설정 (가로 방향에 적합하게)
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // 고해상도
    });

    // 리포트 페이지 URL (localhost 또는 실제 도메인)
    const reportUrl = `${baseUrl}/report/view?cmny_id=${cmnyId}&year_month=${yearMonth.replace('-', '')}&view=pc`;

    console.log(`Navigating to report URL: ${reportUrl}`);

    // 페이지 로드
    await page.goto(reportUrl, {
      waitUntil: 'networkidle0',
      timeout: 45000, // 조금 더 넉넉하게
    });

    // 특정 요소가 나타날 때까지 대기 (예: 차트나 테이블)
    try {
      await page.waitForSelector('.bg-white', { timeout: 10000 });
      // 애니메이션 등이 끝날 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      console.warn('Wait for selector failed, continuing anyway...', e);
    }

    // PDF 생성 (landscape, 8장 예상)
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    await browser.close();

    // 파일명 생성
    const fileName = `${company.cmny_nm}_${yearMonth}_report.pdf`;
    // Storage 경로는 ASCII로 통일 (한글 포함 시 오류 가능성 및 일관성)
    const sanitizedYearMonth = yearMonth.replace('-', '');
    const storagePath = `${cmnyId}/${sanitizedYearMonth}/report.pdf`;

    console.log(`Uploading PDF to storage: ${storagePath}`);

    // Supabase Storage에 업로드 (Admin 클라이언트 사용)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error details:', {
        error: uploadError,
        path: storagePath,
        bucket: 'reports'
      });
      return NextResponse.json({ 
        error: 'Upload failed', 
        details: uploadError.message,
        path: storagePath 
      }, { status: 500 });
    }

    // report_files 테이블에 기록 (Admin 클라이언트 사용)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 캐시

    const { data: fileRecord, error: insertError } = await supabaseAdmin
      .from('report_files')
      .upsert(
        {
          cmny_id: cmnyId,
          year_month: sanitizedYearMonth,
          file_type: 'pdf',
          file_name: fileName,
          storage_path: uploadData.path,
          file_size: pdfBuffer.length,
          generated_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: 'cmny_id,year_month,file_type',
        },
      )
      .select()
      .single();

    if (insertError) {
      console.error('Insert error record details:', {
        error: insertError,
        data: {
          cmny_id: cmnyId,
          year_month: sanitizedYearMonth,
          file_name: fileName
        }
      });
    }

    // Signed URL 생성
    const { data: signedUrl } = await supabase.storage
      .from('reports')
      .createSignedUrl(uploadData.path, 60 * 60); // 1시간 유효

    if (!signedUrl) {
      return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: signedUrl.signedUrl,
      cached: false,
      fileId: fileRecord?.file_id,
      fileName,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

