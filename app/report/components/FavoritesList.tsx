'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Company = {
  cmny_id: number;
  cmny_nm: string;
  biz_no: string | null;
};

type Favorite = {
  favorite_id: number;
  cmny_id: number;
  companies: Company;
};

type Props = {
  onSelectCompany: (company: Company) => void;
  selectedCompanyId: number | null | undefined;
  refreshKey?: number;
};

export default function FavoritesList({
  onSelectCompany,
  selectedCompanyId,
  refreshKey,
}: Props) {
  const supabase = createClient();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [refreshKey]);

  const fetchFavorites = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // 1단계: favorites만 조회
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('favorites')
      .select('favorite_id, cmny_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (favoritesError) {
      console.error('즐겨찾기 조회 오류:', favoritesError);
      setLoading(false);
      return;
    }

    if (!favoritesData || favoritesData.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    // 2단계: companies 정보 별도 조회
    const cmnyIds = favoritesData.map((f) => f.cmny_id);
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('cmny_id, cmny_nm, biz_no')
      .in('cmny_id', cmnyIds);

    if (companiesError) {
      console.error('고객사 정보 조회 오류:', companiesError);
      setLoading(false);
      return;
    }

    // 3단계: 데이터 결합
    const mergedData = favoritesData.map((fav) => ({
      favorite_id: fav.favorite_id,
      cmny_id: fav.cmny_id,
      companies: companiesData?.find((c) => c.cmny_id === fav.cmny_id) || {
        cmny_id: fav.cmny_id,
        cmny_nm: '알 수 없음',
        biz_no: null,
      },
    }));

    console.log('즐겨찾기 조회 성공:', mergedData);
    setFavorites(mergedData);
    setLoading(false);
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    const { error } = await supabase.from('favorites').delete().eq('favorite_id', favoriteId);

    if (error) {
      console.error('즐겨찾기 삭제 오류:', error);
      alert('즐겨찾기 삭제에 실패했습니다.');
    } else {
      setFavorites(favorites.filter((f) => f.favorite_id !== favoriteId));
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-gray-200"></div>
          <div className="mt-4 space-y-3">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-12 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-sm font-semibold text-gray-900">즐겨찾기</h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 즐겨찾기한 고객사가 없습니다. 고객사를 검색하여 즐겨찾기에 추가해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">즐겨찾기 ({favorites.length})</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <div
            key={favorite.favorite_id}
            className={`group relative rounded-lg border p-4 transition-all ${
              selectedCompanyId === favorite.companies.cmny_id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(favorite.favorite_id);
              }}
              className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
              title="즐겨찾기 삭제"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* 고객사 정보 */}
            <button
              onClick={() => onSelectCompany(favorite.companies)}
              className="w-full text-left"
            >
              <h4 className="pr-6 text-sm font-medium text-gray-900">
                {favorite.companies.cmny_nm}
              </h4>
              {favorite.companies.biz_no && (
                <p className="mt-1 text-xs text-gray-500">
                  사업자번호: {favorite.companies.biz_no}
                </p>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

