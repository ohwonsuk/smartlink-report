'use client';

type Props = {
  viewMode: 'pc' | 'mobile';
  onSelectMode: (mode: 'pc' | 'mobile') => void;
};

export default function ViewModeSelector({ viewMode, onSelectMode }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">화면 보기 모드</label>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelectMode('pc')}
          className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all ${
            viewMode === 'pc'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          PC용 (PDF 기준)
        </button>
        <button
          onClick={() => onSelectMode('mobile')}
          className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium transition-all ${
            viewMode === 'mobile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          }`}
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          모바일용 (반응형)
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {viewMode === 'pc'
          ? 'PDF 출력 레이아웃과 동일한 화면으로 표시됩니다.'
          : '모바일 환경에 최적화된 반응형 레이아웃으로 표시됩니다.'}
      </p>
    </div>
  );
}

