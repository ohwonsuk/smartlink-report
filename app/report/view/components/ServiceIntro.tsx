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
    <div className="mt-8 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
      {/* 메인 타이틀 - 한 줄로 표시 */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-800">
          타사차량을 SK렌터카로 전환 시 모든 차량을 Data를 통해 <span className="text-indigo-600">한눈에 편리하게 관리하실 수 있습니다</span>
        </h2>
      </div>

      {/* 메인 컨텐츠 영역 - 가로 배너 스타일 */}
      <div className="flex items-stretch justify-between gap-4">
        {/* 좌측: 도입 효과 타이틀 */}
        <div className="flex flex-col justify-center bg-blue-100/50 p-3 rounded-lg min-w-[140px]">
          <h3 className="text-sm font-bold text-gray-800 text-center leading-tight">
            스마트링크 도입<br />고객사의<br />
            <span className="text-indigo-600">비용절감 효과!!</span>
          </h3>
        </div>

        {/* 중앙: 절감 효과 4개 - 한 줄로 */}
        <div className="flex-1 flex justify-between gap-2">
          {savingsData.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-center rounded-lg bg-white p-2 shadow-sm border border-gray-100"
            >
              <div className="mb-1 text-2xl">{item.icon}</div>
              <div className="mb-0.5 text-lg font-bold text-indigo-600 leading-none">{item.percent}</div>
              <div className="text-[10px] font-semibold text-gray-700 leading-tight">{item.label}</div>
              {item.sublabel && <div className="text-[8px] text-gray-400 scale-90">{item.sublabel}</div>}
            </div>
          ))}
        </div>

        {/* 우측: SK렌터카 서비스 - 가로 스타일 */}
        <div className="flex-[1.5] flex bg-white rounded-lg p-2 shadow-sm border border-gray-100 items-center">
          <div className="px-3 border-r border-gray-200 min-w-[120px]">
            <h3 className="text-xs font-bold text-gray-800 text-center leading-tight">
              SK렌터카 사용 시<br />
              <span className="text-indigo-600">주요 4대서비스</span><br />
              <span className="text-red-500 text-[10px]">무료제공!!</span>
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 pl-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-1.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white mt-0.5">
                  {index + 1}
                </span>
                <p className="text-[9px] leading-tight text-gray-700">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
