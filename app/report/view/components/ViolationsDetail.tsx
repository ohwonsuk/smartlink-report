'use client';

type Violation = {
  department: string | null;
  driver_name: string;
  vehicle_no: string;
  violation_datetime: string;
  notice_type: string;
  fine_amount: number;
  detail_info: string | null;
  authority: string | null;
  violation_location: string | null;
  payment_due_date: string | null;
  is_transferred: boolean;
  transfer_date: string | null;
  is_paid: boolean;
  payment_date: string | null;
};

type Props = {
  yearMonth: string;
  violations: Violation[];
  viewMode: 'pc' | 'mobile';
};

export default function ViolationsDetail({ yearMonth, violations, viewMode }: Props) {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  // 합계 계산
  const totalFine = violations.reduce((sum, v) => sum + v.fine_amount, 0);

  if (violations.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💰</span>
            <h2 className="text-xl font-bold text-gray-900">범칙금</h2>
          </div>
          <div className="text-sm text-gray-600">
            Monthly Report - {year}년 {month}월
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="text-gray-500">범칙금 내역이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💰</span>
          <h2 className="text-xl font-bold text-gray-900">범칙금</h2>
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
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                소속
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                운전자명
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                차량번호
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                위반일시
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                고지서유형
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                범칙금
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                세부내용
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                관할관청
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                위반장소
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                납부기한
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                이관여부
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                이관일
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                납부여부
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                납부일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {violations.slice(0, 10).map((violation, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                  {maskText(violation.department)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {maskName(violation.driver_name)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900">
                  {violation.vehicle_no}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-900">
                  {formatDateTime(violation.violation_datetime)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-900">
                  {violation.notice_type}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-gray-900">
                  {violation.fine_amount.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-sm text-gray-500">{violation.detail_info || '-'}</td>
                <td className="px-3 py-3 text-sm text-gray-500">{violation.authority || '-'}</td>
                <td className="px-3 py-3 text-sm text-gray-500">
                  {violation.violation_location || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {violation.payment_due_date || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${violation.is_transferred ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {violation.is_transferred ? 'Y' : 'N'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {violation.transfer_date || 'N'}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${violation.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {violation.is_paid ? 'Y' : 'N'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-center text-sm text-gray-500">
                  {violation.payment_date || 'N'}
                </td>
              </tr>
            ))}
            {/* 합계 행 */}
            <tr className="bg-indigo-50 font-semibold">
              <td colSpan={6} className="px-3 py-3 text-center text-sm text-gray-900">
                합계
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right text-sm text-indigo-900">
                {totalFine.toLocaleString()}
              </td>
              <td colSpan={8}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단 주석 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        [MAX] 10건 정보 출력
      </div>

      {/* 하단 주석 */}
      {/* <div className="mt-4 space-y-1 text-xs text-gray-500">
        <div className="font-medium">벌칙금:</div>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>SK렌터카 차량 관리 회원이 운전 중 발생한 과태료(속도/신호/주정거)와 벌점</li>
          <li>위반행위가 발생한 후 관할 유관기관에서 관련 제재(벌점/벌금/가산금/과태료)등을 SK렌터카 본사 혹은 SK렌터카 각 지역별사업장으로 발송한 내역</li>
          <li>차량 10대이상 제공 시 제공(대환차가 기본이므로 대환차 기준 X)</li>
          <li>원할 경우 상기 데이터외 홈페이지 연동 제공이 가능합니다.</li>
          <li>교통범칙금 증빙 시 별도 제출 자료</li>
          <li>리스할 관리 기준임(음주/무면허 제외)</li>
        </ul>
        <div className="mt-2">
          <strong>조회 항목 : 벌점(4)</strong> *** 빨간 색채
          <br />
          <strong>소송 · 민형사 → </strong>***빨간 색채
          <br />
          <strong>과태료 벌점 → 운전자분</strong>
        </div>
      </div> */}
    </div>
  );
}

// 이름 마스킹 (*** 형태)
function maskName(name: string): string {
  return '***';
}

// 텍스트 마스킹 (**** 형태)
function maskText(text: string | null): string {
  return text ? '****' : '-';
}

// 일시 포맷팅
function formatDateTime(datetime: string): string {
  const dt = new Date(datetime);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  const hours = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
