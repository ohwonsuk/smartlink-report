import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReportSummary from './components/ReportSummary';
import ServiceIntro from './components/ServiceIntro';
import ReportActionsClient from './components/ReportActionsClient';
import ReportViewClient from './components/ReportViewClient';

type SearchParams = {
  cmny_id?: string;
  year_month?: string;
  view?: 'pc' | 'mobile';
};

export default async function ReportViewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 프로필 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved, role, display_name, department, email')
    .eq('user_id', user.id)
    .single();

  if (!profile?.is_approved && profile?.role !== 'admin') {
    redirect('/waiting-approval');
  }

  // searchParams await (Next.js 15)
  const params = await searchParams;

  // 파라미터 검증
  const cmnyId = params.cmny_id ? parseInt(params.cmny_id) : null;
  const yearMonth = params.year_month || '';
  const viewMode = params.view || 'pc';

  if (!cmnyId || !yearMonth) {
    redirect('/report');
  }

  // 고객사 정보 조회
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('cmny_id, cmny_nm, biz_no')
    .eq('cmny_id', cmnyId)
    .single();

  if (companyError || !company) {
    redirect('/report');
  }

  // 월간 요약 데이터 조회 (3개월치)
  const currentYearMonth = yearMonth.replace('-', '');
  const prevMonth1 = getPreviousYearMonth(currentYearMonth);
  const prevMonth2 = getPreviousYearMonth(prevMonth1);

  const { data: summaryData } = await supabase
    .from('monthly_summary')
    .select('*')
    .eq('cmny_id', cmnyId)
    .in('year_month', [currentYearMonth, prevMonth1, prevMonth2])
    .order('year_month', { ascending: true });

  const currentSummary = summaryData?.find((s) => s.year_month === currentYearMonth);
  const previousSummary = summaryData?.find((s) => s.year_month === prevMonth1);

  // 차량별 가동률 Top 5 조회 (현재 월만)
  const { data: utilizationData } = await supabase
    .from('utilization_vehicle')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('utilization_pct', { ascending: false })
    .limit(5);

  // 상세 리포트 데이터 조회
  // 1. 차량별 가동률 - Top 15
  const { data: utilizationVehiclesData } = await supabase
    .from('utilization_vehicle')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('utilization_pct', { ascending: false })
    .limit(15);

  // 2. 총 월 주행거리 - Top 15
  const { data: monthlyMileagesData } = await supabase
    .from('monthly_mileage')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('monthly_total_mileage_km', { ascending: false })
    .limit(15);

  // 3. 운행기록부 - driving_logs
  const { data: topVehicle } = await supabase
    .from('driving_logs_monthly_summary')
    .select('vehicle_no, vehicle_model, total_distance_km')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('total_distance_km', { ascending: false })
    .limit(1)
    .single();

  let drivingLogsData = null;
  if (topVehicle) {
    const { data: logs } = await supabase
      .from('driving_logs')
      .select('*')
      .eq('cmny_id', cmnyId)
      .eq('year_month', currentYearMonth)
      .eq('vehicle_no', topVehicle.vehicle_no)
      .order('log_date', { ascending: true })
      .limit(12); // 운행일지는 행이 많으므로 12건

    drivingLogsData = {
      vehicleInfo: {
        vehicle_no: topVehicle.vehicle_no,
        vehicle_model: topVehicle.vehicle_model,
      },
      logs: logs || [],
    };
  }

  // 4. 안전점수 - Top 15
  const { data: safetyScoresData } = await supabase
    .from('safety_scores')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('total_distance_km', { ascending: false })
    .limit(15);

  // 5. 정비현황 - Top 10
  const { data: maintenanceData } = await supabase
    .from('maintenance_records')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('check_in_date', { ascending: false })
    .limit(10);

  // 6. 사고내역 (최신 10건)
  const { data: accidentsData } = await supabase
    .from('accidents')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('accident_datetime', { ascending: false })
    .limit(10);

  // 7. 범칙금 (최신 10건)
  const { data: violationsData } = await supabase
    .from('violations')
    .select('*')
    .eq('cmny_id', cmnyId)
    .eq('year_month', currentYearMonth)
    .order('violation_datetime', { ascending: false })
    .limit(10);

  if (!currentSummary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">데이터 없음</h2>
          <p className="mt-2 text-gray-600">
            선택하신 {yearMonth}의 리포트 데이터가 없습니다.
          </p>
          <a
            href="/report"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            리포트 선택 화면으로
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${viewMode === 'mobile' ? 'px-4' : ''}`}>
      {/* 리포트 헤더 */}
      <div className="bg-white shadow-sm">
        <div
          className={`mx-auto ${viewMode === 'pc' ? 'max-w-[1200px]' : 'max-w-full'} px-6 py-4`}
        >
          <div className={viewMode === 'pc' 
            ? "flex items-center justify-between" 
            : "flex flex-col sm:flex-row items-center justify-between gap-y-2"
          }>
            {/* 좌: 고객사명 (요약 페이지에만 표시) */}
            <div className={viewMode === 'pc'
              ? "text-lg font-bold text-gray-900"
              : "text-base sm:text-lg font-bold text-gray-900 text-center sm:text-left"
            }>
              {company.cmny_nm}
            </div>

            {/* 중앙: Monthly Report - YY년MM월 */}
            <div className={viewMode === 'pc'
              ? "text-center text-xl font-bold text-gray-900"
              : "text-lg sm:text-xl font-bold text-gray-900 text-center"
            }>
              Monthly Report - {formatYearMonth(currentYearMonth)}
            </div>

            {/* 우: 서비스 제공업체 로고 */}
            <div className={viewMode === 'pc'
              ? "flex items-center"
              : "flex items-center justify-center sm:justify-end"
            }>
              <img src="/logo.svg" alt="SK렌터카" className={viewMode === 'pc' ? "h-6 w-auto" : "h-5 sm:h-6 w-auto"} />
            </div>
          </div>
        </div>
      </div>

      {/* 리포트 본문 */}
      <div className={`mx-auto ${viewMode === 'pc' ? 'max-w-[1200px]' : 'max-w-full'} py-8`}>
        <ReportViewClient
          company={company}
          summaryData={summaryData || []}
          currentSummary={currentSummary}
          previousSummary={previousSummary}
          utilizationData={utilizationData || []}
          currentYearMonth={currentYearMonth}
          viewMode={viewMode}
          detailData={{
            utilizationVehicles: utilizationVehiclesData || [],
            monthlyMileages: monthlyMileagesData || [],
            drivingLogs: drivingLogsData,
            safetyScores: safetyScoresData || [],
            maintenanceRecords: maintenanceData || [],
            accidents: accidentsData || [],
            violations: violationsData || [],
          }}
        />

        {/* 하단 버튼 */}
        <ReportActionsClient />
      </div>
    </div>
  );
}

// 전월 계산 함수
function getPreviousYearMonth(yearMonth: string): string {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (month === 1) {
    return `${year - 1}12`;
  } else {
    return `${year}${String(month - 1).padStart(2, '0')}`;
  }
}

// 년월 포맷팅 함수
function formatYearMonth(yearMonth: string): string {
  const year = yearMonth.substring(2, 4);
  const month = parseInt(yearMonth.substring(4, 6));
  return `${year}년 ${month}월`;
}

