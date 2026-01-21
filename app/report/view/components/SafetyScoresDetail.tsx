'use client';

import { ShieldCheck } from 'lucide-react';

type SafetyScore = {
  driver_name: string;
  department: string | null;
  employee_no: string | null;
  trip_count: number;
  total_distance_km: number;
  total_driving_minutes: number;
  sudden_accel_count: number;
  sudden_decel_count: number;
  avg_overspeed_rate: number;
  avg_safety_score: number;
};

type Props = {
  yearMonth: string;
  scores: SafetyScore[];
  viewMode: 'pc' | 'mobile';
};

export default function SafetyScoresDetail({ yearMonth, scores, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (scores.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">구성원별 평균안전점수</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">안전점수 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">구성원별 평균안전점수</h2>
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
              <th
                colSpan={3}
                className="border-r border-gray-300 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap"
              >
                기본정보
              </th>
              <th
                colSpan={3}
                className="border-r border-gray-300 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap"
              >
                누적운행정보
              </th>
              <th
                colSpan={4}
                className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap"
              >
                평균운행정보
              </th>
            </tr>
            <tr>
              {/* 기본정보 */}
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                운전자
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                소속
              </th>
              <th className="border-r border-gray-300 px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                사번
              </th>
              {/* 누적운행정보 */}
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                운행건수
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                운행거리(km)
              </th>
              <th className="border-r border-gray-300 px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                운행시간(분)
              </th>
              {/* 평균운행정보 */}
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                급가속횟수
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                급감속횟수
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                평균과속률(%)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                평균안전점수
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {scores.slice(0, 15).map((score, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* 기본정보 */}
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {maskName(score.driver_name)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {score.department || '-'}
                </td>
                <td className="border-r border-gray-200 whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {maskEmployeeNo(score.employee_no)}
                </td>
                {/* 누적운행정보 */}
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.trip_count.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.total_distance_km.toLocaleString()}
                </td>
                <td className="border-r border-gray-200 whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.total_driving_minutes.toLocaleString()}
                </td>
                {/* 평균운행정보 */}
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.sudden_accel_count.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.sudden_decel_count.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-gray-900">
                  {score.avg_overspeed_rate.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-indigo-600">
                  {score.avg_safety_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 주석 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        [MAX] 15명 운전자 정보 출력
      </div>
    </div>
  );
}

// 이름 마스킹 (이*주 형태)
function maskName(name: string): string {
  if (!name || name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

// 사번 마스킹 (첫글자, 끝글자 제외 중간 마스킹)
function maskEmployeeNo(no: string | null): string {
  if (!no) return '-';
  if (no.length <= 1) return no;
  if (no.length === 2) return no[0] + '*';
  return no[0] + '*'.repeat(no.length - 2) + no[no.length - 1];
}

