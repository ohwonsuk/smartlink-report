-- Phase 4: utilization_vehicle 테이블 생성 (차량별 가동률 Top 5)

-- 1) utilization_vehicle 테이블 생성
CREATE TABLE IF NOT EXISTS public.utilization_vehicle (
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  driving_minutes INTEGER NOT NULL DEFAULT 0, -- 주행시간(분)
  utilization_pct NUMERIC(5,2) NOT NULL DEFAULT 0, -- 가동률(%) - 24시간 기준
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (cmny_id, year_month, vehicle_no)
);

-- 2) 인덱스 생성
CREATE INDEX utilization_vehicle_cmny_year_idx ON public.utilization_vehicle(cmny_id, year_month);
CREATE INDEX utilization_vehicle_utilization_idx ON public.utilization_vehicle(cmny_id, year_month, utilization_pct DESC);

-- 3) RLS 활성화
ALTER TABLE public.utilization_vehicle ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 차량 가동률 조회 가능
CREATE POLICY "Approved users can view all vehicle utilization"
  ON public.utilization_vehicle
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert vehicle utilization"
  ON public.utilization_vehicle
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update vehicle utilization"
  ON public.utilization_vehicle
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete vehicle utilization"
  ON public.utilization_vehicle
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS set_utilization_vehicle_updated_at ON public.utilization_vehicle;
CREATE TRIGGER set_utilization_vehicle_updated_at
  BEFORE UPDATE ON public.utilization_vehicle
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();



