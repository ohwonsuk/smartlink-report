'use client';

import { AlertTriangle } from 'lucide-react';

type Accident = {
  department: string | null;
  driver_name: string;
  vehicle_no: string;
  vehicle_model: string | null;
  accident_category: string;
  accident_type: string;
  accident_datetime: string;
  report_date: string;
  report_number: string | null;
  status: string;
  close_date: string | null;
  deductible: number;
  accident_location: string | null;
};

type Props = {
  yearMonth: string;
  accidents: Accident[];
  viewMode: 'pc' | 'mobile';
};

export default function AccidentsDetail({ yearMonth, accidents, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (accidents.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">사고내역</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">사고 내역이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900">사고내역</h2>
        </div>
        <div className="text-sm text-gray-600">
          Monthly Report - {year}년 {month}월
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                소속
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                운전자명
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                차량번호
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                차종
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                사고구분
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                사고분류
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                사고일시
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                접수일자
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                접수번호
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                처리상태
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                종결일자
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                면책금
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                사고장소
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {accidents.slice(0, 10).map((accident, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {maskText(accident.department)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {maskName(accident.driver_name)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {accident.vehicle_no}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {accident.vehicle_model || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {accident.accident_category}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {accident.accident_type}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-900">
                  {formatDateTime(accident.accident_datetime)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-900">
                  {accident.report_date}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {accident.report_number || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(accident.status)}`}
                  >
                    {accident.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {accident.close_date || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {accident.deductible.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {accident.accident_location || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 주석 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        [MAX] 10건 정보 출력
      </div>
    </div>
  );
}

// 이름 마스킹 (첫글자, 끝글자 제외 중간 마스킹)
function maskName(name: string): string {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

// 텍스트 마스킹 (**** 형태)
function maskText(text: string | null): string {
  return text ? '****' : '-';
}

// 일시 포맷팅
function formatDateTime(datetime: string): string {
  const dt = new Date(datetime);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case '완료':
    case '종결':
      return 'bg-green-100 text-green-800';
    case '처리중':
      return 'bg-blue-100 text-blue-800';
    case '접수':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

