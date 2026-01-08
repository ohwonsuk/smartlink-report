'use client';

import Papa from 'papaparse';
import { Download } from 'lucide-react';

type FailDownloadButtonProps = {
  failedRows: any[];
  filename: string;
};

export default function FailDownloadButton({ failedRows, filename }: FailDownloadButtonProps) {
  if (!failedRows || failedRows.length === 0) return null;

  const handleDownload = () => {
    // failedRows는 { data: rowData, error: string, ... } 형식이므로 data만 추출
    const rowsToExport = failedRows.map((f) => ({
      ...f.data,
      __error: f.error // 오류 내용도 마지막 컬럼에 추가
    }));

    const csv = Papa.unparse(rowsToExport);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM 추가
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // 원본 파일명에 _failed 접미사 추가
    const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
    link.href = url;
    link.setAttribute('download', `${baseName}_failed_rows.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors whitespace-nowrap"
      title="실패한 행 다운로드"
    >
      <Download className="w-3 h-3" />
      실패 데이터 다운로드
    </button>
  );
}
