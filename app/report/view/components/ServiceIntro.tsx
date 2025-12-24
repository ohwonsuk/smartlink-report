'use client';

type Props = {
  viewMode: 'pc' | 'mobile';
};

export default function ServiceIntro({ viewMode }: Props) {
  return (
    <div className="mt-12 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 p-8 shadow-sm">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">스마트링크 서비스 소개</h3>
        <p className="mt-4 text-lg text-gray-700">
          타사차량을 SK렌터카로 전환 시 모든 차량 Data를 통해
          <br />
          <span className="font-semibold text-indigo-600">
            한눈에 편리하게 관리하실 수 있습니다
          </span>
        </p>

        {/* 주요 효과 */}
        <div
          className={`mt-8 grid gap-6 ${viewMode === 'pc' ? 'grid-cols-3' : 'grid-cols-1'}`}
        >
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-4xl">📊</div>
            <h4 className="mt-4 text-lg font-semibold text-gray-900">실시간 모니터링</h4>
            <p className="mt-2 text-sm text-gray-600">
              모든 차량의 운행 데이터를 실시간으로 확인하고 관리할 수 있습니다
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-4xl">💰</div>
            <h4 className="mt-4 text-lg font-semibold text-gray-900">비용 절감</h4>
            <p className="mt-2 text-sm text-gray-600">
              데이터 기반 의사결정으로 차량 운영 비용을 최적화할 수 있습니다
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-4xl">🛡️</div>
            <h4 className="mt-4 text-lg font-semibold text-gray-900">안전 관리</h4>
            <p className="mt-2 text-sm text-gray-600">
              안전운전 점수 분석을 통해 사고를 사전에 예방할 수 있습니다
            </p>
          </div>
        </div>

        {/* 문의 정보 */}
        <div className="mt-8 text-sm text-gray-600">
          <p>서비스 도입 및 상담 문의</p>
          <p className="mt-1 font-medium text-indigo-600">
            이메일: contact@smartlink.com | 전화: 1588-0000
          </p>
        </div>
      </div>
    </div>
  );
}

