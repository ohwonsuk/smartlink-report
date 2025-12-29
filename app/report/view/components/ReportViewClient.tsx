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
      {/* 탭 네비게이션 */}
      <ReportTabs onTabChange={(tab) => setActiveTab(tab)} defaultTab="summary" />

      {/* 탭 컨텐츠 */}
      {activeTab === 'summary' ? (
        <>
          <ReportSummary
            company={company}
            summaryData={summaryData}
            currentSummary={currentSummary}
            previousSummary={previousSummary}
            utilizationData={utilizationData}
            currentYearMonth={currentYearMonth}
            viewMode={viewMode}
          />
          <ServiceIntro viewMode={viewMode} />
        </>
      ) : (
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
      )}
    </>
  );
}

