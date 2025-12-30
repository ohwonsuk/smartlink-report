'use client';

import { useState } from 'react';
import ReportTabs from './ReportTabs';
import ReportSummary from './ReportSummary';
import ServiceIntro from './ServiceIntro';
import DetailReport from './DetailReport';

type Props = {
  company: any;
  summaryData: any[];
  currentSummary: any;
  previousSummary: any;
  utilizationData: any[];
  currentYearMonth: string;
  viewMode: 'pc' | 'mobile';
  detailData: {
    utilizationVehicles: any[];
    monthlyMileages: any[];
    drivingLogs: any;
    safetyScores: any[];
    maintenanceRecords: any[];
    accidents: any[];
    violations: any[];
  };
};

export default function ReportViewClient({
  company,
  summaryData,
  currentSummary,
  previousSummary,
  utilizationData,
  currentYearMonth,
  viewMode,
  detailData,
}: Props) {
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');

  return (
    <>
      {/* 탭 네비게이션 - 출력 시 숨김 */}
      <div className="no-print">
        <ReportTabs onTabChange={(tab) => setActiveTab(tab)} defaultTab="summary" />
      </div>

      {/* 탭 컨텐츠 */}
      {/* 요약 리포트 (Page 1) */}
      <div className={activeTab === 'summary' ? 'block' : 'print:block hidden'}>
        <ReportSummary
          company={company}
          summaryData={summaryData}
          currentSummary={currentSummary}
          previousSummary={previousSummary}
          utilizationData={utilizationData}
          currentYearMonth={currentYearMonth}
          viewMode={viewMode}
        />
        <div className="mt-8 service-intro-container text-center">
          <ServiceIntro />
        </div>
        <div className="page-break" />
      </div>

      {/* 상세 리포트 (Page 2-8) */}
      <div className={activeTab === 'detail' ? 'block' : 'print:block hidden'}>
        <DetailReport
          company={company}
          yearMonth={currentYearMonth}
          viewMode={viewMode}
          utilizationVehicles={detailData.utilizationVehicles}
          monthlyMileages={detailData.monthlyMileages}
          drivingLogs={detailData.drivingLogs}
          safetyScores={detailData.safetyScores}
          maintenanceRecords={detailData.maintenanceRecords}
          accidents={detailData.accidents}
          violations={detailData.violations}
        />
      </div>


      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
            clear: both;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10pt; /* 전체 폰트 크기 축소 */
          }
          .max-w-\[1200px\] {
            max-width: 100% !important;
            width: 100% !important;
          }
          /* 테이블 행 높이 축소 */
          table td, table th {
            padding-top: 2px !important;
            padding-bottom: 2px !important;
            font-size: 8pt !important;
          }
          /* 제목 및 마진 축소 */
          h2, h3 {
            margin-top: 10px !important;
            margin-bottom: 5px !important;
            font-size: 14pt !important;
          }
          .rounded-lg {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            padding: 10px !important;
          }
          .mt-8, .py-8 {
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          /* 가독성 향상을 위한 테이블 간격 확대 */
          table td, table th {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            padding-left: 6px !important;
            padding-right: 6px !important;
            line-height: 1.3 !important;
            font-size: 8pt !important;
          }
          /* 요약 페이지(1페이지) 카드 제목 및 간격 최적화 */
          .summary-card-title {
            font-size: 9pt !important;
            color: #4b5563 !important;
          }
          /* 가동률 Top 5 카드 집약도 높임 (Row 1과 높이 맞춤) */
          .top-vehicle-item {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            margin-bottom: 2px !important;
          }
          .top-vehicle-item span {
            font-size: 8pt !important;
          }
          /* 1페이지 전체적인 간격 및 마진 축소 (페이지 넘침 방지) */
          .space-y-6 {
            gap: 12px !important;
          }
          .mt-8 {
            margin-top: 10px !important;
          }
          /* 제목 크기 조정 */
          h2, h3 {
            margin-top: 8px !important;
            margin-bottom: 6px !important;
            font-size: 12pt !important;
          }
          /* 특정 컬럼 너비 최적화 */
          .whitespace-nowrap {
            white-space: nowrap !important;
          }
          td:last-child {
            min-width: 100px !important;
            white-space: normal !important;
          }
        }
      `}</style>
    </>
  );
}

