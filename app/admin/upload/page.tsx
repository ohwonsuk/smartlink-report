import { createClient } from '@/lib/supabase/server';
import UploadZone from './components/UploadZone';
import FailDownloadButton from './components/FailDownloadButton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default async function AdminUploadPage() {
  const supabase = await createClient();

  // 업로드 이력 조회
  const { data: uploads } = await supabase
    .from('raw_uploads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  // 고객사 목록 조회
  const { data: companies } = await supabase
    .from('companies')
    .select('cmny_id, cmny_nm')
    .order('cmny_nm', { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CSV 데이터 업로드</h2>
          <p className="text-sm text-gray-600 mt-1">
            리포트 생성을 위한 데이터를 CSV 파일로 일괄 업로드합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* 업로드 영역 */}
        <div className="xl:col-span-4 max-w-5xl">
          <UploadZone 
            companies={companies || []} 
          />
        </div>

        {/* 이력 영역 */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900">최근 업로드 이력</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">업로드 일시</th>
                    <th className="px-6 py-3">파일명</th>
                    <th className="px-6 py-3">대상 테이블</th>
                    <th className="px-6 py-3">상태</th>
                    <th className="px-6 py-3">결과</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {uploads && uploads.length > 0 ? (
                    uploads.map((upload) => {
                      // 서버 환경에서도 한국 시간으로 강제 변환하여 표시
                      const date = new Date(upload.created_at);
                      const seoulDate = new Intl.DateTimeFormat('ko-KR', {
                        timeZone: 'Asia/Seoul',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }).format(date).replace(/\. /g, '-').replace('.', '');
                      
                      return (
                        <tr key={upload.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                            {seoulDate}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]">
                            {upload.filename}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {upload.table_name}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              upload.status === 'success' 
                                ? 'bg-green-100 text-green-800' 
                                : upload.status === 'fail' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {upload.status === 'success' ? '성공' : upload.status === 'fail' ? '실패' : '대기중'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {upload.result_summary ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                  성공: {upload.result_summary.processed} / 실패: {upload.result_summary.failed || (upload.result_summary.errors?.length || 0)}
                                </span>
                                {upload.status === 'fail' && upload.result_summary.failed_rows && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-red-500 truncate max-w-[120px]" title={upload.result_summary.failed_rows[0]?.error}>
                                      원인: {upload.result_summary.failed_rows[0]?.error}
                                    </span>
                                    <FailDownloadButton 
                                      failedRows={upload.result_summary.failed_rows} 
                                      filename={upload.filename} 
                                    />
                                  </div>
                                )}
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                        업로드 이력이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
