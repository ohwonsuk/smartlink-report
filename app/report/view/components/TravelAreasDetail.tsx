'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, Info } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const year = yearMonth.substring(0, 4);
  const month = parseInt(yearMonth.substring(4, 6));

  useEffect(() => {
    setMounted(true);
  }, []);

  const { wordData, stats } = useMemo(() => {
    if (!records || records.length === 0) return { wordData: [], stats: { topCount: 0, totalCount: 0, ratio: 0 } };

    // 1. 데이터 변환 및 집계
    const aggregated: Record<string, number> = {};
    let totalCount = 0;

    records.forEach((r) => {
      let sido = r.sido || '';
      let sigungu = r.sigungu || '';
      let displayName = '';
      
      if (sido.includes('특별시') || sido.includes('광역시')) {
        const shortSido = sido.replace('특별시', '').replace('광역시', '').trim();
        displayName = `${shortSido} ${sigungu}`;
      } else {
        displayName = sigungu;
      }

      const count = Number(r.trip_count) || 0;
      aggregated[displayName] = (aggregated[displayName] || 0) + count;
      totalCount += count;
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

  // 커스텀 스파이럴 레이아웃 (d3-cloud 의존성 제거로 안정성 확보)
  const layoutWords = useMemo(() => {
    if (wordData.length === 0) return [];
    
    const maxVal = wordData[0].value;
    const minVal = wordData[wordData.length - 1].value;
    const diff = maxVal - minVal || 1;

    return wordData.map((d, i) => {
      // 황금비 나선형 배치 (Golden Spiral)
      const angle = i * 2.4; // 137.5도 (황금각)
      const radius = Math.sqrt(i) * (viewMode === 'pc' ? 35 : 20);
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const relativePos = (d.value - minVal) / diff;
      const fontSize = (viewMode === 'pc' ? 14 : 10) + relativePos * (viewMode === 'pc' ? 36 : 20);
      
      return {
        ...d,
        x,
        y,
        fontSize,
        opacity: 0.7 + relativePos * 0.3
      };
    });
  }, [wordData, viewMode]);

  if (!mounted) return <div className="min-h-[600px] bg-white rounded-lg p-6 shadow animate-pulse" />;

  if (wordData.length === 0) {
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
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">주요 이동지역</h2>
        </div>
        <div className="text-sm text-gray-600">
          Monthly Report - {year}년 {month}월
        </div>
      </div>

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

      <div className="relative flex justify-center bg-gray-50 rounded-xl overflow-hidden min-h-[400px]">
        <svg
          width={viewMode === 'pc' ? 800 : 400}
          height={400}
          className="max-w-full h-auto"
          viewBox={`0 0 ${viewMode === 'pc' ? 800 : 400} 400`}
        >
          <g transform={`translate(${(viewMode === 'pc' ? 800 : 400) / 2}, 200)`}>
            {layoutWords.map((word, i) => (
              <text
                key={i}
                x={word.x}
                y={word.y}
                style={{
                  fontSize: `${word.fontSize}px`,
                  fontWeight: word.fontSize > 20 ? 'bold' : '600',
                  fontFamily: 'sans-serif',
                  fill: COLOR_PALETTE[i % COLOR_PALETTE.length],
                  opacity: word.opacity,
                  transition: 'all 0.3s ease'
                }}
                textAnchor="middle"
                dominantBaseline="middle"
                className="cursor-default select-none hover:opacity-100"
              >
                {word.text}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
        <Info className="w-3 h-3" />
        방문 빈도가 높은 상위 50개 지역을 시각화하였습니다.
      </div>
    </div>
  );
}
