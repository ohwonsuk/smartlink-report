'use client';

export default function ServiceIntro() {
  const savingsData = [
    {
      icon: '⛽',
      percent: '20%',
      label: '유류비 절감',
      sublabel: '(도심비 적정)',
    },
    {
      icon: '🛣️',
      percent: '15%',
      label: '통행료 절감',
      sublabel: '',
    },
    {
      icon: '🚗',
      percent: '11%',
      label: '사고율 감소',
      sublabel: '',
    },
    {
      icon: '🚙',
      percent: '20%',
      label: '운행차량 절감',
      sublabel: '',
    },
  ];

  const services = [
    '운행후 자동으로 국세청 양식의 운행일지 작성',
    '업무용차량의 위치 파악을 모니터링 (On/Off 가능)',
    '차량별 운전자 할인 가능 법적금/과태료 조회 가능',
    '안전운행을 유도하는 차량별 안전운전점수 제공',
  ];

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      {/* 메인 타이틀 */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          타사차량을 SK렌터카로 전환 시 모든 차량을 Data를 통해
        </h2>
        <h2 className="mt-1 text-2xl font-bold text-indigo-600">
          한눈에 편리하게 관리하실 수 있습니다
        </h2>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-[2fr_1fr] gap-8">
        {/* 좌측: 절감 효과 4개 */}
        <div>
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-gray-800">스마트링크 도입 고객사의</h3>
            <h3 className="text-lg font-bold text-indigo-600">비용절감 효과!!</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {savingsData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="mb-2 text-4xl">{item.icon}</div>
                <div className="mb-1 text-2xl font-bold text-indigo-600">{item.percent}</div>
                <div className="text-center text-sm font-semibold text-gray-700">{item.label}</div>
                {item.sublabel && <div className="text-xs text-gray-500">{item.sublabel}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* 우측: SK렌터카 서비스 */}
        <div>
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-gray-800">SK렌터카 사용 시</h3>
            <h3 className="text-lg font-bold text-indigo-600">
              주요 4대서비스 <span className="text-red-600">무료제공!!</span>
            </h3>
          </div>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-start rounded-lg bg-white p-3 shadow-sm">
                <span className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-xs leading-relaxed text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단: 문의 정보 */}
      {/* <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">서비스 도입 및 상담 문의</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold text-gray-800">이메일:</span>{' '}
          <a href="mailto:contact@smartlink.com" className="text-indigo-600 hover:underline">
            contact@smartlink.com
          </a>
          {' | '}
          <span className="font-semibold text-gray-800">전화:</span>{' '}
          <span className="text-indigo-600">1588-0000</span>
        </p>
      </div> */}
    </div>
  );
}
