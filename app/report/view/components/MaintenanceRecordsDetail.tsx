'use client';

import { Wrench } from 'lucide-react';

type MaintenanceRecord = {
  maintenance_type: string;
  vehicle_no: string;
  vehicle_model: string;
  current_mileage: number | null;
  check_in_date: string;
  check_out_date: string | null;
  service_product: string | null;
  service_center: string;
  center_phone: string | null;
  technician_name: string | null;
  status: string | null;
};

type Props = {
  yearMonth: string;
  records: MaintenanceRecord[];
  viewMode: 'pc' | 'mobile';
};

export default function MaintenanceRecordsDetail({ yearMonth, records, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (records.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <Wrench className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">정비현황</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">정비 기록이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <Wrench className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">정비현황</h2>
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
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                구분
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                차량번호
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                차종
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                주행거리
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                입고일자
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                출고일자
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                정비상품
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                정비소명
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                정비소연락처
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                정비담당자
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                완료상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {records.slice(0, 10).map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {record.maintenance_type}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {record.vehicle_no}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {record.vehicle_model}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {record.current_mileage?.toLocaleString() || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-900">
                  {record.check_in_date}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-900">
                  {record.check_out_date || '-'}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {record.service_product || '-'}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {record.service_center}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {maskPhone(record.center_phone)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {maskTechnician(record.technician_name)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(record.status || '')}`}
                  >
                    {record.status || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 주석 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        [MAX] 10대 차량 정보 출력
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case '완료':
      return 'bg-green-100 text-green-800';
    case '진행중':
      return 'bg-blue-100 text-blue-800';
    case '접수':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// 정비담당자 마스킹: 맨앞뒤 제외한 가운데 마스킹
function maskTechnician(name: string | null): string {
  if (!name) return '-';
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

// 정비소연락처 마스킹: 전화번호 중간의 하이픈(-) 사이값 마스킹
function maskPhone(phone: string | null): string {
  if (!phone) return '-';
  const parts = phone.split('-');
  if (parts.length === 3) {
    return `${parts[0]}-****-${parts[2]}`;
  }
  if (parts.length === 2) {
    return `${parts[0]}-****`;
  }
  return phone;
}

