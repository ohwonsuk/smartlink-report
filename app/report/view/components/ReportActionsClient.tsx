'use client';

import { useRouter } from 'next/navigation';

export default function ReportActionsClient() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/report');
  };

  const handleDownloadPDF = () => {
    alert('Phase 7에서 구현 예정');
  };

  return (
    <div className="mt-8 flex justify-center space-x-4">
      <button
        onClick={handleBack}
        className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        리포트 선택 화면으로
      </button>
      <button
        onClick={handleDownloadPDF}
        className="rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
      >
        PDF 다운로드
      </button>
    </div>
  );
}



