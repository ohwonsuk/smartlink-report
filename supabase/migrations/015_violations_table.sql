-- Phase 5: violations 테이블 생성 (범칙금) - 마스킹 필요

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS public.violations (
  violation_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  violation_date DATE NOT NULL, -- 위반 일자
  violation_time TIME, -- 위반 시간
  violation_type TEXT NOT NULL, -- 위반 유형 (속도위반, 신호위반, 주정차위반, 기타)
  location TEXT NOT NULL, -- 위반 위치
  driver_name TEXT NOT NULL, -- 운전자명 (마스킹 대상)
  department TEXT, -- 소속/부서 (마스킹 대상)
  fine_amount INTEGER NOT NULL DEFAULT 0, -- 범칙금액 (원)
  penalty_points INTEGER DEFAULT 0, -- 벌점
  payment_status TEXT DEFAULT 'unpaid', -- 납부 상태 (paid, unpaid, overdue)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성
CREATE INDEX violations_cmny_year_idx ON public.violations(cmny_id, year_month);
CREATE INDEX violations_vehicle_idx ON public.violations(vehicle_no, violation_date DESC);
CREATE INDEX violations_type_idx ON public.violations(violation_type);
CREATE INDEX violations_payment_idx ON public.violations(payment_status);

-- 3) RLS 활성화
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 범칙금 조회 가능
CREATE POLICY "Approved users can view violations"
  ON public.violations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert violations"
  ON public.violations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update violations"
  ON public.violations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete violations"
  ON public.violations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_violations_updated_at
  BEFORE UPDATE ON public.violations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

