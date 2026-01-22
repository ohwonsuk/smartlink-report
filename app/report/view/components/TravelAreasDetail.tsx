'use client';

import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import WordCloud from 'react-d3-cloud';
import { scaleLinear } from 'd3-scale';

type TravelArea = {
  sido: string;
  sigungu: string;
  trip_count: number;
};

type Props = {
  yearMonth: string;
  records: TravelArea[];
  viewMode: 'pc' | 'mobile';
};

// 색상 팔레트 (관리자가 조정 가능하도록 상수로 분리)
const COLOR_PALETTE = [
  '#4F46E5', // indigo-600
  '#0891B2', // cyan-600
  '#059669', // emerald-600
  '#D97706', // amber-600
  '#DC2626', // red-600
  '#7C3AED', // violet-600
  '#2563EB', // blue-600
];

export default function TravelAreasDetail({ yearMonth, records, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  const { wordData, stats } = useMemo(() => {
    if (records.length === 0) return { wordData: [], stats: { topCount: 0, totalCount: 0, ratio: 0 } };

    // 1. 데이터 변환 및 집계
    const aggregated: Record<string, number> = {};
    let totalCount = 0;

    records.forEach((r) => {
      let sido = r.sido;
      let displayName = '';
      
      if (sido.includes('특별시') || sido.includes('광역시')) {
        // 특별시, 광역시 문자는 제외하고 시도명 + 시군구명
        const shortSido = sido.replace('특별시', '').replace('광역시', '').trim();
        displayName = `${shortSido} ${r.sigungu}`;
      } else {
        // 그 외 지역은 시군구명만
        displayName = r.sigungu;
      }

      aggregated[displayName] = (aggregated[displayName] || 0) + r.trip_count;
      totalCount += r.trip_count;
    });

    // 2. 상위 50개 추출
    const sorted = Object.entries(aggregated)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value);

    const top50 = sorted.slice(0, 50);
    const topCount = top50.reduce((sum, item) => sum + item.value, 0);

    return {
      wordData: top50,
      stats: {
        topCount,
        totalCount,
        ratio: totalCount > 0 ? (topCount / totalCount) * 100 : 0,
      },
    };
  }, [records]);

  // 폰트 크기 스케일 조정 (너무 차이나지 않도록 가공)
  const fontSizeScale = useMemo(() => {
    if (wordData.length === 0) return () => 10;
    const min = Math.min(...wordData.map((d) => d.value));
    const max = Math.max(...wordData.map((d) => d.value));
    
    // 최소 12px, 최대 60px (모바일은 조금 더 작게)
    const minSize = viewMode === 'mobile' ? 10 : 14;
    const maxSize = viewMode === 'mobile' ? 40 : 64;
    
    const scale = scaleLinear()
      .domain([min, max])
      .range([minSize, maxSize]);
      
    return (value: number) => scale(value);
  }, [wordData, viewMode]);

  if (records.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">주요 이동지역</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center text-gray-500">이동지역 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow page-break-inside-avoid">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">주요 이동지역</h2>
        </div>
        <div className="text-sm text-gray-600">
          Monthly Report - {year}년 {month}월
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-indigo-50 p-4 text-center">
          <div className="text-xs text-gray-600">상위 50개 지역 방문 횟수</div>
          <div className="mt-1 text-lg font-bold text-indigo-700">
            {stats.topCount.toLocaleString()} <span className="text-sm font-normal">건</span>
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-600">전체 지역 대비 비중</div>
          <div className="mt-1 text-lg font-bold text-blue-700">
            {stats.ratio.toFixed(1)} <span className="text-sm font-normal">%</span>
          </div>
        </div>
      </div>

      {/* WordCloud 영역 */}
      <div className="flex justify-center bg-gray-50 rounded-xl overflow-hidden min-h-[400px]">
        <WordCloud
          data={wordData}
          width={viewMode === 'pc' ? 800 : 400}
          height={400}
          font="Inter, sans-serif"
          fontWeight="bold"
          fontSize={(word) => fontSizeScale(word.value)}
          rotate={0}
          padding={4}
          random={() => 0.5} // 일관된 배치를 위해 고정값
          fill={(_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]}
        />
      </div>

      {/* 하단 주석 */}
      <div className="mt-6 text-center text-xs text-gray-500">
        [기준] 방문 빈도가 높은 상위 50개 지역을 시각화하였습니다.
      </div>
    </div>
  );
}
