-- Phase 5: driving_logs 테이블 업데이트 (업무용승용차 운행기록부 형식)

-- 1) 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS public.driving_logs CASCADE;

-- 2) 업무용승용차 운행기록부 형식으로 테이블 생성
CREATE TABLE public.driving_logs (
  log_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT, -- 차종
  
  -- 운행 정보
  log_date DATE NOT NULL, -- 사용일자
  department TEXT, -- 부서명
  driver_name TEXT, -- 성명 (운전자)
  
  -- 계기판 거리 (km)
  odometer_start NUMERIC(10,2) NOT NULL DEFAULT 0, -- 주행 전 계기판의 거리
  odometer_end NUMERIC(10,2) NOT NULL DEFAULT 0, -- 주행 후 계기판의 거리
  distance_km NUMERIC(10,2) GENERATED ALWAYS AS (odometer_end - odometer_start) STORED, -- 주행거리 (자동 계산)
  
  -- 운행 유형별 거리
  commute_km NUMERIC(10,2), -- 출퇴근용 거리 (km)
  business_km NUMERIC(10,2), -- 업무용 거리 (km)
  
  note TEXT, -- 비고
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) 인덱스 생성
CREATE INDEX driving_logs_cmny_year_idx ON public.driving_logs(cmny_id, year_month);
CREATE INDEX driving_logs_vehicle_date_idx ON public.driving_logs(vehicle_no, log_date DESC);
CREATE INDEX driving_logs_date_idx ON public.driving_logs(log_date DESC);

-- 4) RLS 활성화
ALTER TABLE public.driving_logs ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 운행기록 조회 가능
CREATE POLICY "Approved users can view driving logs"
  ON public.driving_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert driving logs"
  ON public.driving_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update driving logs"
  ON public.driving_logs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete driving logs"
  ON public.driving_logs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_driving_logs_updated_at
  BEFORE UPDATE ON public.driving_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8) 데이터 확인용 뷰 생성 (월별 집계)
-- 업무용 사용거리 = 출퇴근용 거리 + 업무용 거리
DROP VIEW IF EXISTS public.driving_logs_monthly_summary;

CREATE VIEW public.driving_logs_monthly_summary AS
SELECT 
  dl.cmny_id,
  c.cmny_nm,
  dl.year_month,
  dl.vehicle_no,
  dl.vehicle_model,
  MIN(dl.log_date) as period_start,
  MAX(dl.log_date) as period_end,
  SUM(dl.distance_km) as total_distance_km,
  SUM(dl.commute_km) as total_commute_km,
  SUM(dl.business_km) as total_business_km,
  COALESCE(SUM(dl.commute_km), 0) + COALESCE(SUM(dl.business_km), 0) as total_work_usage_km, -- 업무용 사용거리 (출퇴근 + 업무)
  CASE 
    WHEN SUM(dl.distance_km) > 0 
    THEN ROUND(((COALESCE(SUM(dl.commute_km), 0) + COALESCE(SUM(dl.business_km), 0)) / SUM(dl.distance_km) * 100)::numeric, 1)
    ELSE 0 
  END as business_usage_pct,
  COUNT(*) as log_count
FROM public.driving_logs dl
JOIN public.companies c ON dl.cmny_id = c.cmny_id
GROUP BY dl.cmny_id, c.cmny_nm, dl.year_month, dl.vehicle_no, dl.vehicle_model;

