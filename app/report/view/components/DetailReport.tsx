'use client';

import UtilizationDetail from './UtilizationDetail';
import MonthlyMileageDetail from './MonthlyMileageDetail';
import DrivingLogsDetail from './DrivingLogsDetail';
import SafetyScoresDetail from './SafetyScoresDetail';
import MaintenanceRecordsDetail from './MaintenanceRecordsDetail';
import AccidentsDetail from './AccidentsDetail';
import ViolationsDetail from './ViolationsDetail';
import TravelAreasDetail from './TravelAreasDetail';

type Props = {
  company: {
    cmny_nm: string;
    biz_no: string | null;
  };
  yearMonth: string;
  viewMode: 'pc' | 'mobile';
  utilizationVehicles: any[];
  monthlyMileages: any[];
  drivingLogs: any;
  safetyScores: any[];
  maintenanceRecords: any[];
  accidents: any[];
  violations: any[];
  travelAreas: any[];
};

export default function DetailReport({
  company,
  yearMonth,
  viewMode,
  utilizationVehicles,
  monthlyMileages,
  drivingLogs,
  safetyScores,
  maintenanceRecords,
  accidents,
  violations,
  travelAreas,
}: Props) {
  return (
    <div className="space-y-8">
      {/* 1. 차량별 가동률 */}
      <UtilizationDetail
        yearMonth={yearMonth}
        vehicles={utilizationVehicles || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 2. 총 월 주행거리 */}
      <MonthlyMileageDetail
        yearMonth={yearMonth}
        mileages={monthlyMileages || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 3. 업무용승용차 운행기록부 */}
      <DrivingLogsDetail
        company={company}
        yearMonth={yearMonth}
        vehicleInfo={drivingLogs?.vehicleInfo || { vehicle_no: '', vehicle_model: '' }}
        logs={drivingLogs?.logs || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 4. 구성원별 평균안전점수 */}
      <SafetyScoresDetail
        yearMonth={yearMonth}
        scores={safetyScores || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 5. 정비현황 */}
      <MaintenanceRecordsDetail
        yearMonth={yearMonth}
        records={maintenanceRecords || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 6. 사고내역 */}
      <AccidentsDetail
        yearMonth={yearMonth}
        accidents={accidents || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 7. 범칙금 */}
      <ViolationsDetail
        yearMonth={yearMonth}
        violations={violations || []}
        viewMode={viewMode}
      />
      <div className="page-break" />

      {/* 8. 주요 이동지역 */}
      <TravelAreasDetail
        yearMonth={yearMonth}
        records={travelAreas || []}
        viewMode={viewMode}
      />
    </div>
  );
}

