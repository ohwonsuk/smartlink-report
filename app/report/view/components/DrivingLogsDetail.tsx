'use client';

type DrivingLog = {
  log_date: string;
  department: string | null;
  driver_name: string | null;
  odometer_start: number;
  odometer_end: number;
  distance_km: number;
  commute_km: number;
  business_km: number;
  note: string | null;
};

type Props = {
  company: {
    cmny_nm: string;
    biz_no: string | null;
  };
  yearMonth: string;
  vehicleInfo: {
    vehicle_no: string;
    vehicle_model: string | null;
  };
  logs: DrivingLog[];
  viewMode: 'pc' | 'mobile';
};

export default function DrivingLogsDetail({
  company,
  yearMonth,
  vehicleInfo,
  logs,
  viewMode,
}: Props) {
  // 합계 계산
  const totals = logs.reduce(
    (acc, log) => ({
      distance_km: acc.distance_km + log.distance_km,
      business_km: acc.business_km + (log.commute_km + log.business_km),
    }),
    { distance_km: 0, business_km: 0 },
  );

  // 업무용 사용비율
  const businessUsagePct =
    totals.distance_km > 0 ? ((totals.business_km / totals.distance_km) * 100).toFixed(1) : '0.0';

  // 과세기간 (해당 월의 첫날~마지막날)
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).getDate();
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${endDate}`;

  if (logs.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <p className="text-gray-500">운행 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 - 이미지 양식과 동일하게 */}
      <div className="mb-6 border border-gray-300">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 text-center align-middle" rowSpan={2}>
                <div className="text-sm font-medium text-gray-700">과세기간</div>
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm">
                {startDate}
              </td>
              <td
                className="border border-gray-300 p-4 text-center align-middle text-2xl font-bold"
                rowSpan={2}
              >
                업무용승용차 운행기록부
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm font-medium">
                상 호 명
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm">
                {company.cmny_nm}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm">
                {endDateStr}
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm font-medium">
                사업자등록번호
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle text-sm">
                {company.biz_no || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 1. 기본정보 */}
      <div className="mb-4">
        <h3 className="mb-2 text-base font-bold text-gray-900">1. 기본정보</h3>
        <table className="border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="w-32 border border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium">
                차종
              </td>
              <td className="border border-gray-300 p-2 text-center text-sm">
                {vehicleInfo.vehicle_model || '-'}
              </td>
            </tr>
            <tr>
              <td className="w-32 border border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium">
                차량등록번호
              </td>
              <td className="border border-gray-300 p-2 text-center text-sm">
                {vehicleInfo.vehicle_no}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 업무용 사용비율 계산 */}
      <div>
        <h3 className="mb-2 text-base font-bold text-gray-900">2. 업무용 사용비율 계산</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th
                  rowSpan={2}
                  className="border border-gray-300 p-2 text-center font-medium text-gray-700"
                >
                  사용
                  <br />
                  일자
                  <br />
                  (요일)
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-300 p-2 text-center font-medium text-gray-700"
                >
                  사용자
                </th>
                <th
                  colSpan={3}
                  className="border border-gray-300 p-2 text-center font-medium text-gray-700"
                >
                  운행내역
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-300 p-2 text-center font-medium text-gray-700"
                >
                  업무용 사용거리(km)
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 p-2 text-center font-medium text-gray-700"
                >
                  비고
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  부서
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  성명
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  주행 전<br />
                  계기판의 거리
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  주행 후<br />
                  계기판의 거리(km)
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  주행거리
                  <br />
                  (km)
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  출퇴근용(km)
                </th>
                <th className="border border-gray-300 p-2 text-center text-xs font-medium text-gray-700">
                  일반업무용(km)
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">{log.log_date}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {log.department || ''}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {log.driver_name || ''}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {log.odometer_start.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {log.odometer_end.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-medium">
                    {log.distance_km.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {log.commute_km > 0 ? log.commute_km.toLocaleString() : ''}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {log.business_km > 0 ? log.business_km.toLocaleString() : ''}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{log.note || ''}</td>
                </tr>
              ))}
              {/* 합계 행 */}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={5} className="border border-gray-300 p-2 text-center">
                  합계
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {totals.distance_km.toLocaleString()}
                </td>
                <td colSpan={2} className="border border-gray-300 p-2 text-right">
                  {totals.business_km.toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {businessUsagePct}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

