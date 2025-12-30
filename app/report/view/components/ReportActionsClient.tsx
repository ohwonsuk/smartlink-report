'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ReportActionsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);

  const cmnyId = searchParams.get('cmny_id');
  const yearMonth = searchParams.get('year_month');

  const handleBack = () => {
    router.push('/report');
  };

  const handleDownloadPDF = async () => {
    if (!cmnyId || !yearMonth) {
      alert('리포트 정보가 없습니다.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/reports/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cmnyId: parseInt(cmnyId),
          yearMonth: yearMonth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.details ? `${data.error}: ${data.details}` : (data.error || 'PDF 생성 실패');
        throw new Error(errorMessage);
      }

      if (data.success && data.url) {
        // PDF 다운로드
        const link = document.createElement('a');
        link.href = data.url;
        link.download = data.fileName || 'report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (data.cached) {
          alert('캐시된 PDF를 다운로드합니다.');
        } else {
          alert('PDF가 생성되었습니다.');
        }
      }
    } catch (error) {
      console.error('PDF 다운로드 오류:', error);
      alert(error instanceof Error ? error.message : 'PDF 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 flex justify-center space-x-4 no-print">
      <button
        onClick={handleBack}
        className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        리포트 선택 화면으로
      </button>
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isGenerating ? 'PDF 생성 중...' : 'PDF 다운로드'}
      </button>
    </div>
  );
}



