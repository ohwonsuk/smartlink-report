import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReportSummary from './components/ReportSummary';
import ServiceIntro from './components/ServiceIntro';
import ReportActionsClient from './components/ReportActionsClient';

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

  // 월간 요약 데이터 조회 (선택 월 + 전월)
  const currentYearMonth = yearMonth.replace('-', '');
  const prevYearMonth = getPreviousYearMonth(currentYearMonth);

  const { data: summaryData } = await supabase
    .from('monthly_summary')
    .select('*')
    .eq('cmny_id', cmnyId)
    .in('year_month', [currentYearMonth, prevYearMonth])
    .order('year_month', { ascending: false });

  const currentSummary = summaryData?.find((s) => s.year_month === currentYearMonth);
  const previousSummary = summaryData?.find((s) => s.year_month === prevYearMonth);

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
          <div className="flex items-center justify-between">
            {/* 좌: 고객사명 (요약 페이지에만 표시) */}
            <div className="text-lg font-bold text-gray-900">{company.cmny_nm}</div>

            {/* 중앙: Monthly Report - YY년MM월 */}
            <div className="text-center text-xl font-bold text-gray-900">
              Monthly Report - {formatYearMonth(currentYearMonth)}
            </div>

            {/* 우: 서비스 제공업체 로고 */}
            <div className="text-sm font-medium text-gray-600">스마트링크</div>
          </div>
        </div>
      </div>

      {/* 리포트 본문 */}
      <div className={`mx-auto ${viewMode === 'pc' ? 'max-w-[1200px]' : 'max-w-full'} py-8`}>
        <ReportSummary
          company={company}
          currentSummary={currentSummary}
          previousSummary={previousSummary}
          yearMonth={currentYearMonth}
          viewMode={viewMode}
        />

        {/* 서비스 소개 섹션 */}
        <ServiceIntro viewMode={viewMode} />

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

