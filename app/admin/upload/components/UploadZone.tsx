'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TABLES = [
  { id: 'monthly_summary', name: '월간 요약 (Monthly Summary)' },
  { id: 'utilization_vehicle', name: '차량별 가동률 (Utilization)' },
  { id: 'monthly_mileage', name: '월 누적 주행거리 (Monthly Mileage)' },
  { id: 'driving_logs', name: '운행기록부 (Driving Logs)' },
  { id: 'safety_scores', name: '안전점수 (Safety Scores)' },
  { id: 'maintenance_records', name: '정비현황 (Maintenance)' },
  { id: 'accidents', name: '사고내역 (Accidents)' },
  { id: 'violations', name: '범칙금 (Violations)' },
  { id: 'companies', name: '고객사 정보 (Companies)' },
];

export default function UploadZone({ 
  companies, 
  onUploadSuccess 
}: { 
  companies: { cmny_id: number; cmny_nm: string }[];
  onUploadSuccess?: () => void 
}) {
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState(TABLES[0].id);
  const [selectedCmnyId, setSelectedCmnyId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/csv/template?tableName=${selectedTable}`);
      if (!response.ok) throw new Error('템플릿 다운로드 실패');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template_${selectedTable}_sample.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tableName', selectedTable);
      if (selectedCmnyId) {
        formData.append('cmnyId', selectedCmnyId);
      }

      const response = await fetch('/api/admin/csv/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `성공: ${result.summary.processed}개 항목이 처리되었습니다.`,
        });
        setFile(null);
        router.refresh(); // 서버 컴포넌트 데이터 갱신
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setMessage({
          type: 'error',
          text: `실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`,
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `오류: ${err.message}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">데이터 로드 (CSV Upload)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">대상 테이블 선택</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={uploading}
            >
              {TABLES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">고객사 선택 (선택 사항)</label>
            <select
              value={selectedCmnyId}
              onChange={(e) => setSelectedCmnyId(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={uploading}
            >
              <option value="">-- 복수 고객사 (CSV 내 cmny_id 사용) --</option>
              {companies.map((c) => (
                <option key={c.cmny_id} value={c.cmny_id}>{c.cmny_nm}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleDownloadTemplate}
              className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              disabled={uploading}
            >
              <span>📥</span> 템플릿 다운로드
            </button>
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
          disabled={uploading}
        />
        <label htmlFor="csv-upload" className="cursor-pointer block">
          <div className="text-4xl mb-4">📄</div>
          {file ? (
            <div className="text-blue-600 font-semibold">{file.name}</div>
          ) : (
            <div className="text-gray-500">
              CSV 파일을 클릭하거나 드래그하여 업로드하세요.
            </div>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3">
        {file && (
          <button
            onClick={() => setFile(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
            disabled={uploading}
          >
            취소
          </button>
        )}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
            !file || uploading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {uploading ? '업로드 중...' : '데이터 업로드'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 italic">
        * 업로드 전 반드시 템플릿을 다운로드하여 형식을 확인해주세요. <br />
        * 기존 데이터가 있는 경우 <strong>Upsert</strong>(동일 키 존재 시 업데이트)가 적용됩니다.
      </div>
    </div>
  );
}
