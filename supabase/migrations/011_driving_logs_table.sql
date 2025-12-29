-- Phase 5: driving_logs 테이블 생성 (운행일지)

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS public.driving_logs (
  log_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  log_date DATE NOT NULL, -- 운행 일자
  
  departure_time TIME NOT NULL, -- 출발 시간
  arrival_time TIME NOT NULL, -- 도착 시간
  departure_place TEXT NOT NULL, -- 출발지
  arrival_place TEXT NOT NULL, -- 도착지
  distance_km NUMERIC(10,2) NOT NULL DEFAULT 0, -- 주행거리 (km)
  purpose TEXT, -- 운행 목적
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성
CREATE INDEX driving_logs_cmny_year_idx ON public.driving_logs(cmny_id, year_month);
CREATE INDEX driving_logs_vehicle_date_idx ON public.driving_logs(vehicle_no, log_date DESC);

-- 3) RLS 활성화
ALTER TABLE public.driving_logs ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 운행일지 조회 가능
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

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_driving_logs_updated_at
  BEFORE UPDATE ON public.driving_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

