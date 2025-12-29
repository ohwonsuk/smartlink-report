-- Phase 5: utilization_vehicle 테이블에 주행거리 컬럼 추가

-- 1) mileage_km 컬럼 추가
ALTER TABLE public.utilization_vehicle 
ADD COLUMN IF NOT EXISTS mileage_km NUMERIC(10,2) DEFAULT 0;

-- 2) 인덱스 추가
CREATE INDEX IF NOT EXISTS utilization_vehicle_mileage_idx 
ON public.utilization_vehicle(cmny_id, year_month, mileage_km DESC);

-- 3) 주행거리 기준 Top 5 조회를 위한 함수 생성
CREATE OR REPLACE FUNCTION public.get_top_mileage_vehicle(
  p_cmny_id INTEGER,
  p_year_month CHAR(6)
)
RETURNS TABLE (
  vehicle_no TEXT,
  vehicle_model TEXT,
  mileage_km NUMERIC,
  utilization_pct NUMERIC,
  driving_minutes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uv.vehicle_no,
    uv.vehicle_model,
    uv.mileage_km,
    uv.utilization_pct,
    uv.driving_minutes
  FROM public.utilization_vehicle uv
  WHERE uv.cmny_id = p_cmny_id
    AND uv.year_month = p_year_month
  ORDER BY uv.mileage_km DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4) 데이터 확인
SELECT 
  cmny_id,
  year_month,
  vehicle_no,
  vehicle_model,
  mileage_km,
  utilization_pct
FROM public.utilization_vehicle
ORDER BY cmny_id, year_month, mileage_km DESC
LIMIT 10;

