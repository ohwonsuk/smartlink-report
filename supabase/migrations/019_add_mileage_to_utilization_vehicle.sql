-- Phase 5: utilization_vehicle 테이블에 vehicle_model 컬럼 추가
-- CSV 업로드시 차종 정보도 포함되어야 함

-- 1) vehicle_model 컬럼 추가
ALTER TABLE public.utilization_vehicle 
ADD COLUMN IF NOT EXISTS vehicle_model TEXT;

-- 2) 데이터 확인
SELECT 
  cmny_id,
  year_month,
  vehicle_no,
  vehicle_model,
  driving_minutes,
  utilization_pct
FROM public.utilization_vehicle
ORDER BY cmny_id, year_month, utilization_pct DESC
LIMIT 10;

