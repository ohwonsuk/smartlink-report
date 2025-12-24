'use client';

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

type Props = {
  company: Company;
  currentSummary: Summary;
  previousSummary: Summary | null | undefined;
  yearMonth: string;
  viewMode: 'pc' | 'mobile';
};

export default function ReportSummary({
  company,
  currentSummary,
  previousSummary,
  yearMonth,
  viewMode,
}: Props) {
  // 전월비 계산 함수
  const calculateChange = (current: number, previous: number | null | undefined) => {
    if (!previous || previous === 0) return null;
    const change = current - previous;
    const changeRate = ((current - previous) / previous) * 100;
    return { change, changeRate };
  };

  // 평균 가동률 계산 (8시간 기준)
  const calculateUtilization = (drivingMinutes: number, vehicleCount: number) => {
    if (vehicleCount === 0) return 0;
    // 24시간 기준 가동률 * 3 = 8시간 기준 가동률
    const utilization24h = (drivingMinutes / (vehicleCount * 24 * 60)) * 100;
    return utilization24h * 3;
  };

  const currentUtilization = calculateUtilization(
    currentSummary.total_driving_minutes,
    currentSummary.vehicle_count,
  );
  const previousUtilization = previousSummary
    ? calculateUtilization(previousSummary.total_driving_minutes, previousSummary.vehicle_count)
    : null;

  // 카드 데이터
  const cards = [
    {
      title: '대상 차량',
      value: currentSummary.vehicle_count,
      unit: '대',
      change: calculateChange(
        currentSummary.vehicle_count,
        previousSummary?.vehicle_count,
      ),
      icon: '🚗',
    },
    {
      title: '월 총 주행거리',
      value: currentSummary.total_mileage_km,
      unit: 'km',
      change: calculateChange(
        currentSummary.total_mileage_km,
        previousSummary?.total_mileage_km,
      ),
      icon: '📍',
      decimals: 0,
    },
    {
      title: '평균 가동률',
      value: currentUtilization,
      unit: '%',
      change: calculateChange(currentUtilization, previousUtilization),
      icon: '⚡',
      decimals: 1,
    },
    {
      title: '운행일지 생성대수',
      value: currentSummary.trip_log_vehicle_count,
      unit: '대',
      change: calculateChange(
        currentSummary.trip_log_vehicle_count,
        previousSummary?.trip_log_vehicle_count,
      ),
      icon: '📝',
    },
    {
      title: '평균 안전점수',
      value: currentSummary.avg_safe_score || 0,
      unit: '점',
      change: calculateChange(
        currentSummary.avg_safe_score || 0,
        previousSummary?.avg_safe_score,
      ),
      icon: '🛡️',
      decimals: 1,
    },
    {
      title: '정비 현황',
      value: currentSummary.maintenance_completed_count,
      unit: '건',
      change: calculateChange(
        currentSummary.maintenance_completed_count,
        previousSummary?.maintenance_completed_count,
      ),
      icon: '🔧',
    },
    {
      title: '사고 내역',
      value: currentSummary.accident_count,
      unit: '건',
      change: calculateChange(
        currentSummary.accident_count,
        previousSummary?.accident_count,
      ),
      icon: '⚠️',
    },
    {
      title: '범칙금',
      value: currentSummary.violation_amount,
      unit: '원',
      change: calculateChange(
        currentSummary.violation_amount,
        previousSummary?.violation_amount,
      ),
      icon: '💰',
      decimals: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4x2 카드 그리드 */}
      <div
        className={`grid gap-4 ${viewMode === 'pc' ? 'grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                {typeof card.value === 'number'
                  ? card.decimals !== undefined
                    ? card.value.toFixed(card.decimals)
                    : Math.round(card.value).toLocaleString()
                  : card.value}
                <span className="ml-1 text-lg font-medium text-gray-500">{card.unit}</span>
              </p>
              {card.change && (
                <div className="mt-2 flex items-center space-x-1">
                  {card.change.change >= 0 ? (
                    <span className="text-sm text-green-600">▲</span>
                  ) : (
                    <span className="text-sm text-red-600">▼</span>
                  )}
                  <span
                    className={`text-sm font-medium ${card.change.change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {Math.abs(card.change.change).toLocaleString(undefined, {
                      maximumFractionDigits: card.decimals || 0,
                    })}
                    {card.unit}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({card.change.changeRate >= 0 ? '+' : ''}
                    {card.change.changeRate.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

