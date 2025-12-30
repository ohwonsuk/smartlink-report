'use client';

type UtilizationVehicle = {
  vehicle_no: string;
  vehicle_model: string | null;
  driving_minutes: number;
  utilization_pct: number;
};

type Props = {
  yearMonth: string;
  vehicles: UtilizationVehicle[];
  viewMode: 'pc' | 'mobile';
};

export default function UtilizationDetail({ yearMonth, vehicles, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (vehicles.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-gray-900">차량별 가동률</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">차량별 가동률 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-bold text-gray-900">차량별 가동률</h2>
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
                총 주행시간 (분)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                가동률
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {vehicles.slice(0, 15).map((vehicle, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {vehicle.vehicle_no}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {vehicle.vehicle_model || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {vehicle.driving_minutes.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-indigo-600">
                  {vehicle.utilization_pct}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

