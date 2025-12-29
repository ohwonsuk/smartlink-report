-- Phase 5: mileage_detail 테이블 생성 (차량별 주행거리 상세)

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS public.mileage_detail (
  mileage_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  record_date DATE NOT NULL, -- 기록 일자
  
  daily_mileage_km NUMERIC(10,2) NOT NULL DEFAULT 0, -- 일일 주행거리 (km)
  cumulative_mileage_km INTEGER NOT NULL DEFAULT 0, -- 누적 주행거리 (km)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성
CREATE INDEX mileage_detail_cmny_year_idx ON public.mileage_detail(cmny_id, year_month);
CREATE INDEX mileage_detail_vehicle_idx ON public.mileage_detail(vehicle_no, record_date DESC);

-- 3) RLS 활성화
ALTER TABLE public.mileage_detail ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 주행거리 조회 가능
CREATE POLICY "Approved users can view mileage details"
  ON public.mileage_detail
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert mileage details"
  ON public.mileage_detail
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update mileage details"
  ON public.mileage_detail
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete mileage details"
  ON public.mileage_detail
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_mileage_detail_updated_at
  BEFORE UPDATE ON public.mileage_detail
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

