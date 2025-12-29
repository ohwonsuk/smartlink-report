'use client';

type MonthlyMileage = {
  vehicle_no: string;
  vehicle_model: string | null;
  monthly_trip_count: number;
  monthly_driving_days: number;
  monthly_total_mileage_km: number;
};

type Props = {
  yearMonth: string;
  mileages: MonthlyMileage[];
  viewMode: 'pc' | 'mobile';
};

export default function MonthlyMileageDetail({ yearMonth, mileages, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (mileages.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-gray-500">총 월 주행거리 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📍</span>
          <h2 className="text-xl font-bold text-gray-900">총 월 주행거리</h2>
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
                차량번호
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                모델
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                월 운행건수
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                월 운행일수
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                월 누적주행거리(km)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mileages.slice(0, 20).map((mileage, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {mileage.vehicle_no}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {mileage.vehicle_model || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {mileage.monthly_trip_count}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {mileage.monthly_driving_days}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-indigo-600">
                  {mileage.monthly_total_mileage_km.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 주석 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        [MAX] 20대 차량 정보 출력
      </div>
    </div>
  );
}

