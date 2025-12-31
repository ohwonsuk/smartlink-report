'use client';

import { Fuel, Navigation, ShieldCheck, TrendingDown } from 'lucide-react';

type ServiceIntroProps = {
  viewMode?: 'pc' | 'mobile';
};

export default function ServiceIntro({ viewMode = 'pc' }: ServiceIntroProps) {
  const savingsData = [
    {
      icon: <Fuel className="w-6 h-6 text-indigo-600" />,
      percent: '20%',
      label: '유류비 절감',
      sublabel: '(도심비 적정)',
    },
    {
      icon: <Navigation className="w-6 h-6 text-indigo-600" />,
      percent: '15%',
      label: '통행료 절감',
      sublabel: '',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      percent: '11%',
      label: '사고율 감소',
      sublabel: '',
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-indigo-600" />,
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

      {/* 메인 컨텐츠 영역 - PC 모드에서는 항상 가로, Mobile 모드에서만 반응형 */}
      <div className={viewMode === 'pc' 
        ? "flex items-stretch justify-between gap-4"
        : "flex flex-col lg:flex-row items-stretch justify-between gap-4"
      }>
        {/* 좌측: 도입 효과 타이틀 */}
        <div className={viewMode === 'pc'
          ? "flex flex-col justify-center bg-blue-100/50 p-2 rounded-lg min-w-[150px] text-center"
          : "flex flex-col justify-center bg-blue-100/50 p-4 lg:p-3 rounded-lg lg:min-w-[140px] text-center"
        }>
          <h3 className={viewMode === 'pc'
            ? "text-[12px] font-bold text-gray-800 leading-[1.3]"
            : "text-sm sm:text-base lg:text-sm font-bold text-gray-800 leading-tight"
          }>
            <span className="whitespace-nowrap">스마트링크 도입</span><br className={viewMode === 'mobile' ? "hidden lg:block" : ""} /> <span className="whitespace-nowrap">고객사의</span>
            <span className={viewMode === 'pc' ? "text-indigo-600 whitespace-nowrap block mt-0.5" : "block lg:inline-block lg:mt-1 text-indigo-600"}>비용절감 효과!!</span>
          </h3>
        </div>

        {/* 중앙: 절감 효과 4개 - PC는 항상 1x4, Mobile은 2x2 */}
        <div className={viewMode === 'pc'
          ? "flex-1 flex justify-between gap-2"
          : "grid grid-cols-2 sm:grid-cols-4 sm:flex-1 lg:flex lg:justify-between gap-2"
        }>
          {savingsData.map((item, index) => (
            <div
              key={index}
              className={viewMode === 'pc'
                ? "flex-1 flex flex-col items-center justify-center rounded-lg bg-white p-2 shadow-sm border border-gray-100"
                : "flex flex-col items-center justify-center rounded-lg bg-white p-3 lg:p-2 shadow-sm border border-gray-100"
              }
            >
              <div className={viewMode === 'pc' ? "mb-1 text-2xl" : "mb-1 text-2xl lg:text-xl"}>{item.icon}</div>
              <div className={viewMode === 'pc' ? "mb-0.5 text-lg font-bold text-indigo-600 leading-none" : "mb-0.5 text-xl lg:text-lg font-bold text-indigo-600 leading-none"}>{item.percent}</div>
              <div className={viewMode === 'pc' ? "text-[10px] font-semibold text-gray-700 leading-tight whitespace-nowrap" : "text-xs lg:text-[10px] font-semibold text-gray-700 leading-tight whitespace-nowrap"}>{item.label}</div>
              {item.sublabel && <div className={viewMode === 'pc' ? "text-[8px] text-gray-400 scale-90" : "text-[10px] lg:text-[8px] text-gray-400 scale-90"}>{item.sublabel}</div>}
            </div>
          ))}
        </div>

        {/* 우측: SK렌터카 서비스 - PC는 가로, Mobile은 반응형 */}
        <div className={viewMode === 'pc'
          ? "flex-[1.5] flex bg-white rounded-lg p-2 shadow-sm border border-gray-100 items-center"
          : "flex-1 lg:flex-[1.5] flex flex-col sm:flex-row bg-white rounded-lg p-2 shadow-sm border border-gray-100 items-center"
        }>
          <div className={viewMode === 'pc'
            ? "px-3 border-r border-gray-200 min-w-[120px] text-center"
            : "w-full sm:w-auto px-3 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-gray-100 sm:border-gray-200 sm:min-w-[120px] text-center"
          }>
            <h3 className={viewMode === 'pc'
              ? "text-xs font-bold text-gray-800 leading-tight"
              : "text-xs sm:text-sm lg:text-xs font-bold text-gray-800 leading-tight"
            }>
              SK렌터카 사용 시<br />
              <span className="text-indigo-600">주요 4대서비스</span><br />
              <span className="text-red-500 text-[10px]">무료제공!!</span>
            </h3>
          </div>
          <div className={viewMode === 'pc'
            ? "flex-1 grid grid-cols-2 gap-x-3 gap-y-1 pl-3"
            : "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-1 p-3 lg:pl-3 lg:py-0"
          }>
            {services.map((service, index) => (
              <div key={index} className="flex items-start">
                <span className={viewMode === 'pc'
                  ? "mr-1.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white mt-0.5"
                  : "mr-2 sm:mr-1.5 flex h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] sm:text-[8px] font-bold text-white mt-0.5"
                }>
                  {index + 1}
                </span>
                <p className={viewMode === 'pc' ? "text-[9px] leading-tight text-gray-700" : "text-[10px] lg:text-[9px] leading-tight text-gray-700"}>{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
