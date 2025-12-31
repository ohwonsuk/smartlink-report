import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    // 1. 인증 및 파라미터 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cmnyId, yearMonth } = await request.json();
    if (!cmnyId || !yearMonth) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    // 2. 고객사 및 파일 정보 준비
    const { data: company } = await supabase.from('companies').select('cmny_nm').eq('cmny_id', cmnyId).single();
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

    const sanitizedYearMonth = yearMonth.replace('-', '');
    const fileName = `${company.cmny_nm}_${yearMonth}_report.pdf`;
    const storagePath = `${cmnyId}/${sanitizedYearMonth}/report.pdf`;

    // 3. Firebase 전용 서버(또는 로컬)로 PDF 생성 요청
    // 요청 헤더에서 호스트 주소를 추출하여 baseUrl 설정
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    
    const reportUrl = `${baseUrl}/report/view?cmny_id=${cmnyId}&year_month=${sanitizedYearMonth}&view=pc`;
    
    // 현재 세션 쿠키 추출
    const cookieList = request.cookies.getAll().map(c => ({
      name: c.name,
      value: c.value,
      domain: new URL(baseUrl).hostname,
      path: '/'
    }));

    let pdfBuffer: Buffer;

    if (process.env.NODE_ENV === 'development') {
      // 로컬에서는 기존처럼 puppeteer 직접 실행 권장 (속도 및 디버깅)
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setCookie(...cookieList);
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(reportUrl, { waitUntil: 'networkidle0' });
      pdfBuffer = await page.pdf({ format: 'a4', landscape: true, printBackground: true });
      await browser.close();
    } else {
      // 배포 환경: Firebase Cloud Function 호출
      const FIREBASE_PDF_API = 'https://asia-northeast3-picmoment-dev.cloudfunctions.net/generatePDF';
      
      console.log(`Calling Firebase PDF API for URL: ${reportUrl}`);

      const response = await fetch(FIREBASE_PDF_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: reportUrl, cookies: cookieList })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Firebase Error Response:', errorText);
        throw new Error(`Firebase PDF generation failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);

      // PDF 헤더 검증 (%PDF- 로 시작해야 함)
      const header = pdfBuffer.toString('utf8', 0, 5);
      console.log(`Received PDF from Firebase. Size: ${pdfBuffer.length} bytes, Header: ${header}`);

      if (header !== '%PDF-') {
        const preview = pdfBuffer.toString('utf8', 0, 100);
        console.error('Invalid PDF format received:', preview);
        throw new Error('Received invalid PDF format from generator. The response might be an error page or a corrupted file.');
      }
    }

    // 4. 생성된 PDF를 Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 5. DB 기록 및 Signed URL 반환 (기존 로직 동일)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabaseAdmin.from('report_files').upsert({
      cmny_id: cmnyId,
      year_month: sanitizedYearMonth,
      file_type: 'pdf',
      file_name: fileName,
      storage_path: uploadData.path,
      file_size: pdfBuffer.length,
      generated_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'cmny_id,year_month,file_type' });

    const { data: signedUrl } = await supabase.storage.from('reports').createSignedUrl(uploadData.path, 3600);

    return NextResponse.json({ success: true, url: signedUrl?.signedUrl, fileName });

  } catch (error: any) {
    console.error('PDF error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
