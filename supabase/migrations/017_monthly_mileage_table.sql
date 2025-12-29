-- Phase 5: mileage_detail 테이블을 monthly_mileage로 재구성

-- 1) 기존 mileage_detail 테이블 삭제
DROP TABLE IF EXISTS public.mileage_detail CASCADE;

-- 2) monthly_mileage 테이블 생성 (월별 집계 데이터)
CREATE TABLE IF NOT EXISTS public.monthly_mileage (
  mileage_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT, -- 모델명
  
  monthly_trip_count INTEGER NOT NULL DEFAULT 0, -- 월 운행건수
  monthly_driving_days INTEGER NOT NULL DEFAULT 0, -- 월 운행일수
  monthly_total_mileage_km NUMERIC(10,1) NOT NULL DEFAULT 0, -- 월 누적주행거리 (km)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(cmny_id, year_month, vehicle_no)
);

-- 3) 인덱스 생성
CREATE INDEX monthly_mileage_cmny_year_idx ON public.monthly_mileage(cmny_id, year_month);
CREATE INDEX monthly_mileage_vehicle_idx ON public.monthly_mileage(vehicle_no);
CREATE INDEX monthly_mileage_mileage_idx ON public.monthly_mileage(cmny_id, year_month, monthly_total_mileage_km DESC);

-- 4) RLS 활성화
ALTER TABLE public.monthly_mileage ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 주행거리 조회 가능
CREATE POLICY "Approved users can view monthly mileage"
  ON public.monthly_mileage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert monthly mileage"
  ON public.monthly_mileage
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update monthly mileage"
  ON public.monthly_mileage
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete monthly mileage"
  ON public.monthly_mileage
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_monthly_mileage_updated_at
  BEFORE UPDATE ON public.monthly_mileage
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

