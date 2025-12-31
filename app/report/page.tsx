'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CompanySearch from './components/CompanySearch';
import FavoritesList from './components/FavoritesList';
import DateSelector from './components/DateSelector';
import ViewModeSelector from './components/ViewModeSelector';

type Favorite = {
  favorite_id: number;
  cmny_id: number;
};

export default function ReportPage() {
  const supabase = createClient();
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  // 전월을 기본값으로 설정
  useEffect(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const yearMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    setSelectedDate(yearMonth);
  }, []);

  // 즐겨찾기 목록 조회
  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('favorite_id, cmny_id')
        .eq('user_id', user.id);

      setFavorites(data || []);
    };

    fetchFavorites();
  }, [supabase, favoritesRefresh]);

  // 즐겨찾기 토글
  const handleToggleFavorite = async () => {
    if (!selectedCompany) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const isFavorite = favorites.some((f) => f.cmny_id === selectedCompany.cmny_id);

    if (isFavorite) {
      // 삭제
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('cmny_id', selectedCompany.cmny_id);

      if (!error) {
        setFavoritesRefresh((prev) => prev + 1);
      }
    } else {
      // 추가
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        cmny_id: selectedCompany.cmny_id,
      });

      if (!error) {
        setFavoritesRefresh((prev) => prev + 1);
      }
    }
  };

  const isFavorite = selectedCompany
    ? favorites.some((f) => f.cmny_id === selectedCompany.cmny_id)
    : false;

  const handleViewReport = () => {
    if (!selectedCompany || !selectedDate) {
      alert('고객사와 날짜를 선택해주세요.');
      return;
    }
    // 리포트 조회 페이지로 이동
    const url = `/report/view?cmny_id=${selectedCompany.cmny_id}&year_month=${selectedDate}&view=${viewMode}`;
    window.location.href = url;
  };

  const handleDownloadPDF = () => {
    if (!selectedCompany || !selectedDate) {
      alert('고객사와 날짜를 선택해주세요.');
      return;
    }
    // Phase 7에서 구현
    alert(`PDF 다운로드: ${selectedCompany.cmny_nm} (${selectedDate})`);
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">월간 리포트 조회</h2>
        <p className="mt-2 text-sm text-gray-600">
          고객사를 선택하고 조회할 월을 선택하세요. 즐겨찾기에서 빠르게 접근할 수도 있습니다.
        </p>
      </div>

      {/* 즐겨찾기 목록 */}
      <FavoritesList
        onSelectCompany={(company) => setSelectedCompany(company)}
        selectedCompanyId={selectedCompany?.cmny_id}
        refreshKey={favoritesRefresh}
      />

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-3 text-sm text-gray-500">또는 직접 검색</span>
        </div>
      </div>

      {/* 리포트 선택 폼 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="space-y-6">
          {/* 고객사 검색 */}
          <div className="space-y-3">
            <CompanySearch
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />
            
            {/* 즐겨찾기 추가/삭제 버튼 */}
            {selectedCompany && (
              <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCompany.cmny_nm}
                  </p>
                  {selectedCompany.biz_no && (
                    <p className="text-xs text-gray-500">
                      사업자번호: {selectedCompany.biz_no}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isFavorite
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-white text-gray-700 hover:bg-gray-100 ring-1 ring-inset ring-gray-300'
                  }`}
                  title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                >
                  <svg
                    className="h-5 w-5"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span>{isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 연도/월 선택 */}
          <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {/* 화면보기 모드 선택 */}
          <ViewModeSelector viewMode={viewMode} onSelectMode={setViewMode} />

          {/* 액션 버튼 */}
          <div className="flex space-x-4">
            <button
              onClick={handleViewReport}
              disabled={!selectedCompany || !selectedDate}
              className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              웹화면 보기
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={!selectedCompany || !selectedDate}
              className="flex-1 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              PDF 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 선택된 정보 표시 */}
      {selectedCompany && (
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-900">선택된 리포트 정보</h3>
          <dl className="mt-2 space-y-1 text-sm text-blue-800">
            <div className="flex">
              <dt className="font-medium">고객사:</dt>
              <dd className="ml-2">{selectedCompany.cmny_nm}</dd>
            </div>
            <div className="flex">
              <dt className="font-medium">조회 월:</dt>
              <dd className="ml-2">{selectedDate}</dd>
            </div>
            <div className="flex">
              <dt className="font-medium">화면 모드:</dt>
              <dd className="ml-2">{viewMode === 'pc' ? 'PC용' : '모바일용'}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
