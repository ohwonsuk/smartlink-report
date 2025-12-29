-- Phase 5: accidents 테이블 생성 (사고 내역) - 마스킹 필요

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS public.accidents (
  accident_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  accident_date DATE NOT NULL, -- 사고 일자
  accident_time TIME, -- 사고 시간
  accident_type TEXT NOT NULL, -- 사고 유형 (자차, 대물, 대인, 종합)
  location TEXT NOT NULL, -- 사고 위치
  driver_name TEXT NOT NULL, -- 운전자명 (마스킹 대상)
  department TEXT, -- 소속/부서 (마스킹 대상)
  damage_cost INTEGER NOT NULL DEFAULT 0, -- 피해 금액 (원)
  description TEXT, -- 사고 내용
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성
CREATE INDEX accidents_cmny_year_idx ON public.accidents(cmny_id, year_month);
CREATE INDEX accidents_vehicle_idx ON public.accidents(vehicle_no, accident_date DESC);
CREATE INDEX accidents_type_idx ON public.accidents(accident_type);

-- 3) RLS 활성화
ALTER TABLE public.accidents ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 사고 내역 조회 가능
CREATE POLICY "Approved users can view accidents"
  ON public.accidents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert accidents"
  ON public.accidents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update accidents"
  ON public.accidents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete accidents"
  ON public.accidents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_accidents_updated_at
  BEFORE UPDATE ON public.accidents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

