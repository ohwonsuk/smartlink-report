'use client';

import { Car, MapPin, FileText, ShieldCheck, Zap, Wrench, AlertTriangle, Coins, TrendingUp, TrendingDown } from 'lucide-react';

type Company = {
  cmny_id: number;
  cmny_nm: string;
  biz_no: string | null;
};

type Summary = {
  cmny_id: number;
  year_month: string;
  vehicle_count: number;
  total_mileage_km: number;
  total_driving_minutes: number;
  trip_log_vehicle_count: number;
  avg_safe_score: number | null;
  maintenance_completed_count: number;
  accident_count: number;
  violation_count: number;
  violation_amount: number;
};

type UtilizationVehicle = {
  cmny_id: number;
  year_month: string;
  vehicle_no: string;
  vehicle_model: string | null;
  driving_minutes: number;
  utilization_pct: number;
};

type Props = {
  company: Company;
  summaryData: Summary[];
  currentSummary: Summary | undefined;
  previousSummary: Summary | undefined;
  utilizationData: UtilizationVehicle[];
  currentYearMonth: string;
  viewMode: 'pc' | 'mobile';
};

export default function ReportSummary({
  company,
  summaryData,
  currentSummary,
  previousSummary,
  utilizationData,
  currentYearMonth,
  viewMode,
}: Props) {
  if (!currentSummary) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  // 평균 가동률 계산 (8시간 기준)
  const calculateUtilization = (drivingMinutes: number, vehicleCount: number, yearMonth: string) => {
    if (vehicleCount === 0 || !yearMonth) return 0;
    
    // 월별 일수 계산 (해당 월의 마지막 날짜 구하기)
    const year = parseInt(yearMonth.substring(0, 4));
    const month = parseInt(yearMonth.substring(4, 6));
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 24시간 기준 가동률 = (분) / (대수 * 24시간 * 60분 * 해당월일수) * 100
    const utilization24h = (drivingMinutes / (vehicleCount * 24 * 60 * daysInMonth)) * 100;
    
    // 8시간 기준으로 환산 (×3)
    return utilization24h * 3;
  };

  const currentUtilization = calculateUtilization(
    currentSummary.total_driving_minutes,
    currentSummary.vehicle_count,
    currentSummary.year_month
  );

  const previousUtilization = previousSummary
    ? calculateUtilization(
        previousSummary.total_driving_minutes, 
        previousSummary.vehicle_count,
        previousSummary.year_month
      )
    : null;

  // 3개월 데이터 포맷팅
  const formatMonthData = (field: keyof Summary) => {
    return summaryData.map((s) => ({
      month: formatMonth(s.year_month),
      value: s[field] as number,
    }));
  };

  // 차량별 가동률 Top 5
  const topVehicles = utilizationData.slice(0, 5);

  // 1행 카드 (대상차량, 월 총 주행거리, 운행일지 생성대수, 평균안전운전점수)
  const row1Cards = [
    {
      title: '대상 차량',
      unit: '대',
      icon: <Car className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.vehicle_count,
      previousValue: previousSummary?.vehicle_count,
      data: null, // 3개월 데이터 제외
      decimals: 0,
      hasUtilization: true,
      utilizationValue: currentUtilization,
      previousUtilizationValue: previousUtilization,
    },
    {
      title: '월 총 주행거리',
      unit: 'km',
      icon: <MapPin className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.total_mileage_km,
      previousValue: previousSummary?.total_mileage_km,
      data: formatMonthData('total_mileage_km'),
      decimals: 0,
    },
    {
      title: '운행일지 생성대수',
      unit: '대',
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.trip_log_vehicle_count,
      previousValue: previousSummary?.trip_log_vehicle_count,
      data: formatMonthData('trip_log_vehicle_count'),
      decimals: 0,
    },
    {
      title: '평균 안전점수',
      unit: '점',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.avg_safe_score || 0,
      previousValue: previousSummary?.avg_safe_score,
      data: formatMonthData('avg_safe_score'),
      decimals: 1,
    },
  ];

  // 2행 카드 (가동률 Top 5, 정비현황, 사고내역, 범칙금)
  const row2Cards = [
    {
      title: '가동률 Top 5',
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      isTopVehicles: true,
    },
    {
      title: '정비 현황',
      unit: '건',
      icon: <Wrench className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.maintenance_completed_count,
      previousValue: previousSummary?.maintenance_completed_count,
      data: formatMonthData('maintenance_completed_count'),
      decimals: 0,
    },
    {
      title: '사고 내역',
      unit: '건',
      icon: <AlertTriangle className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.accident_count,
      previousValue: previousSummary?.accident_count,
      data: formatMonthData('accident_count'),
      decimals: 0,
    },
    {
      title: '범칙금',
      unit: '원',
      icon: <Coins className="w-6 h-6 text-indigo-600" />,
      currentValue: currentSummary.violation_amount,
      previousValue: previousSummary?.violation_amount,
      data: formatMonthData('violation_amount'),
      decimals: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1행 */}
      <div className={`grid gap-6 ${viewMode === 'pc' ? 'grid-cols-4' : 'grid-cols-1'}`}>
        {row1Cards.map((card, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                {formatValue(card.currentValue, card.decimals)}
                <span className="ml-1 text-lg font-medium text-gray-500">{card.unit}</span>
              </p>

              {/* 전월 대비 증감 */}
              {card.previousValue !== undefined && card.previousValue !== null && (
                <div className="mt-2">
                  {renderChange(card.currentValue, card.previousValue, card.decimals)}
                </div>
              )}

              {/* 대상차량 - 당월 평균 가동률 */}
              {card.hasUtilization && (
                <div className="mt-3 rounded-md bg-indigo-50 p-3">
                  <p className="text-xs font-medium text-indigo-900">당월 평균 가동률</p>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-bold text-indigo-600">
                      {card.utilizationValue?.toFixed(1)}
                      <span className="ml-1 text-base font-medium">%</span>
                    </p>
                    {card.previousUtilizationValue !== undefined &&
                      card.previousUtilizationValue !== null && (
                        <span className="ml-2">
                          {renderChange(
                            card.utilizationValue || 0,
                            card.previousUtilizationValue,
                            1,
                            true,
                          )}
                        </span>
                      )}
                  </div>
                </div>
              )}

              {/* 3개월 데이터 */}
              {card.data && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {card.data.map((item, i) => (
                    <div key={i} className="rounded-md bg-gray-50 p-2 text-center">
                      <p className="text-xs font-medium text-gray-500">{item.month}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatValue(item.value, card.decimals)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2행 */}
      <div className={`grid gap-6 ${viewMode === 'pc' ? 'grid-cols-4' : 'grid-cols-1'}`}>
        {row2Cards.map((card, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600 summary-card-title">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>

            {/* 가동률 Top 5 */}
            {card.isTopVehicles ? (
              <div className="mt-4">
                <div className="space-y-1.5">
                  {topVehicles.map((vehicle, vIndex) => (
                    <div
                      key={vIndex}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 top-vehicle-item"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                          {vIndex + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {vehicle.vehicle_no}
                          </span>
                          {/* {vehicle.vehicle_model && (
                            <span className="text-xs text-gray-500">{vehicle.vehicle_model}</span>
                          )} */}
                        </div>
                      </div>
                      <span className="text-base font-bold text-indigo-600">
                        {(vehicle.utilization_pct * 3).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  {formatValue(card.currentValue!, card.decimals!)}
                  <span className="ml-1 text-lg font-medium text-gray-500">{card.unit}</span>
                </p>

                {/* 전월 대비 증감 */}
                {card.previousValue !== undefined && card.previousValue !== null && (
                  <div className="mt-2">
                    {renderChange(card.currentValue!, card.previousValue, card.decimals!)}
                  </div>
                )}

                {/* 3개월 데이터 */}
                {card.data && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {card.data.map((item, i) => (
                      <div key={i} className="rounded-md bg-gray-50 p-2 text-center">
                        <p className="text-xs font-medium text-gray-500">{item.month}</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatValue(item.value, card.decimals!)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 월 포맷팅 (202509 → 9월)
function formatMonth(yearMonth: string): string {
  const month = parseInt(yearMonth.substring(4, 6));
  return `${month}월`;
}

// 값 포맷팅
function formatValue(value: number, decimals: number = 0): string {
  if (value === null || value === undefined) return '-';
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.round(value).toLocaleString();
}

// 전월 대비 증감 표시
function renderChange(
  current: number,
  previous: number,
  decimals: number = 0,
  compact: boolean = false,
) {
  if (previous === 0) return null;

  const diff = current - previous;
  const diffPercent = ((diff / previous) * 100).toFixed(1);
  const isPositive = diff > 0;
  const isNegative = diff < 0;

  if (diff === 0) {
    return <span className="text-xs text-gray-500">{compact ? '→' : '전월 대비 변동 없음'}</span>;
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPositive
          ? 'bg-green-100 text-green-800'
          : isNegative
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="mr-0.5 h-3 w-3" />
      ) : (
        <TrendingDown className="mr-0.5 h-3 w-3" />
      )}
      {Math.abs(parseFloat(diffPercent))}%
      {!compact && (
        <span className="ml-1">
          ({isPositive ? '+' : ''}
          {formatValue(diff, decimals)})
        </span>
      )}
    </div>
  );
}
