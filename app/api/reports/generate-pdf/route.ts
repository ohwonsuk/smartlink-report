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

    // 2.5 캐시 확인
    const { data: existingFile } = await supabase
      .from('report_files')
      .select('*')
      .eq('cmny_id', cmnyId)
      .eq('year_month', sanitizedYearMonth)
      .eq('file_type', 'pdf')
      .single();

    if (existingFile && existingFile.expires_at) {
      const expiresAt = new Date(existingFile.expires_at);
      if (expiresAt > new Date()) {
        const { data: signedUrl } = await supabase.storage
          .from('reports')
          .createSignedUrl(existingFile.storage_path, 3600, {
            download: fileName
          });

        if (signedUrl) {
          return NextResponse.json({
            success: true,
            url: signedUrl.signedUrl,
            cached: true,
            fileId: existingFile.file_id,
            fileName: fileName,
          });
        }
      }
    }

    // 3. Firebase 전용 서버(또는 로컬)로 PDF 생성 요청
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    
    const reportUrl = `${baseUrl}/report/view?cmny_id=${cmnyId}&year_month=${sanitizedYearMonth}&view=pc`;
    
    const cookieList = request.cookies.getAll().map(c => ({
      name: c.name,
      value: c.value,
      domain: new URL(baseUrl).hostname,
      path: '/'
    }));

    let pdfBuffer: Buffer;

    if (process.env.NODE_ENV === 'development') {
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setCookie(...cookieList);
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(reportUrl, { waitUntil: 'networkidle0' });
      pdfBuffer = await page.pdf({ format: 'a4', landscape: true, printBackground: true });
      await browser.close();
    } else {
      const FIREBASE_PDF_API = 'https://asia-northeast3-picmoment-dev.cloudfunctions.net/generatePDF';
      
      const response = await fetch(FIREBASE_PDF_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: reportUrl, cookies: cookieList })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Firebase PDF generation failed: ${response.status} - ${errorText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);

      if (pdfBuffer.toString('utf8', 0, 5) !== '%PDF-') {
        throw new Error('Received invalid PDF format from generator.');
      }
    }

    // 4. 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('reports')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 5. DB 기록
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: fileRecord } = await supabaseAdmin.from('report_files').upsert({
      cmny_id: cmnyId,
      year_month: sanitizedYearMonth,
      file_type: 'pdf',
      file_name: fileName,
      storage_path: uploadData.path,
      file_size: pdfBuffer.length,
      generated_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    }, { onConflict: 'cmny_id,year_month,file_type' }).select().single();

    const { data: signedUrl } = await supabase.storage.from('reports').createSignedUrl(uploadData.path, 3600, {
      download: fileName
    });

    return NextResponse.json({ success: true, url: signedUrl?.signedUrl, fileName, cached: false });

  } catch (error: any) {
    console.error('PDF error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
