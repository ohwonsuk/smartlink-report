'use client';

type Props = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export default function DateSelector({ selectedDate, onSelectDate }: Props) {
  // 최근 12개월 생성
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
      options.push({ value: yearMonth, label });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
    <div>
      <label htmlFor="date-selector" className="block text-sm font-medium text-gray-700">
        조회 월
      </label>
      <select
        id="date-selector"
        value={selectedDate}
        onChange={(e) => onSelectDate(e.target.value)}
        className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">월을 선택하세요</option>
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">기본값: 전월 ({monthOptions[1]?.label})</p>
    </div>
  );
}

