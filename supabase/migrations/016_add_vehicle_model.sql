-- Phase 5: utilization_vehicle 테이블에 vehicle_model 컬럼 추가

-- 1) vehicle_model 컬럼 추가
ALTER TABLE public.utilization_vehicle 
ADD COLUMN IF NOT EXISTS vehicle_model TEXT;

-- 2) 인덱스 추가
CREATE INDEX IF NOT EXISTS utilization_vehicle_model_idx 
ON public.utilization_vehicle(vehicle_model);

-- 데이터 확인
SELECT 
  cmny_id,
  year_month,
  vehicle_no,
  vehicle_model,
  utilization_pct
FROM public.utilization_vehicle
ORDER BY cmny_id, year_month, utilization_pct DESC
LIMIT 10;

