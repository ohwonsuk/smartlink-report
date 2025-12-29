'use client';

import UtilizationDetail from './UtilizationDetail';
import MonthlyMileageDetail from './MonthlyMileageDetail';
import DrivingLogsDetail from './DrivingLogsDetail';
import SafetyScoresDetail from './SafetyScoresDetail';
import MaintenanceRecordsDetail from './MaintenanceRecordsDetail';
import AccidentsDetail from './AccidentsDetail';
import ViolationsDetail from './ViolationsDetail';

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
}: Props) {
  return (
    <div className="space-y-8">
      {/* 1. 차량별 가동률 */}
      <UtilizationDetail
        yearMonth={yearMonth}
        vehicles={utilizationVehicles || []}
        viewMode={viewMode}
      />

      {/* 2. 총 월 주행거리 */}
      <MonthlyMileageDetail
        yearMonth={yearMonth}
        mileages={monthlyMileages || []}
        viewMode={viewMode}
      />

      {/* 3. 업무용승용차 운행기록부 */}
      {drivingLogs && drivingLogs.vehicleInfo && drivingLogs.logs ? (
        <DrivingLogsDetail
          company={company}
          yearMonth={yearMonth}
          vehicleInfo={drivingLogs.vehicleInfo}
          logs={drivingLogs.logs}
          viewMode={viewMode}
        />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-bold text-gray-900">업무용승용차 운행기록부</h2>
          </div>
          <p className="mt-4 text-gray-500">운행 기록이 없습니다.</p>
        </div>
      )}

      {/* 4. 구성원별 평균안전점수 */}
      {safetyScores && safetyScores.length > 0 ? (
        <SafetyScoresDetail yearMonth={yearMonth} scores={safetyScores} viewMode={viewMode} />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-xl font-bold text-gray-900">구성원별 평균안전점수</h2>
          </div>
          <p className="mt-4 text-gray-500">안전점수 데이터가 없습니다.</p>
        </div>
      )}

      {/* 5. 정비현황 */}
      {maintenanceRecords && maintenanceRecords.length > 0 ? (
        <MaintenanceRecordsDetail
          yearMonth={yearMonth}
          records={maintenanceRecords}
          viewMode={viewMode}
        />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🔧</span>
            <h2 className="text-xl font-bold text-gray-900">정비현황</h2>
          </div>
          <p className="mt-4 text-gray-500">정비 기록이 없습니다.</p>
        </div>
      )}

      {/* 6. 사고내역 */}
      {accidents && accidents.length > 0 ? (
        <AccidentsDetail yearMonth={yearMonth} accidents={accidents} viewMode={viewMode} />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-bold text-gray-900">사고내역</h2>
          </div>
          <p className="mt-4 text-gray-500">사고 내역이 없습니다.</p>
        </div>
      )}

      {/* 7. 범칙금 */}
      {violations && violations.length > 0 ? (
        <ViolationsDetail yearMonth={yearMonth} violations={violations} viewMode={viewMode} />
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl">💰</span>
            <h2 className="text-xl font-bold text-gray-900">범칙금</h2>
          </div>
          <p className="mt-4 text-gray-500">범칙금 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

