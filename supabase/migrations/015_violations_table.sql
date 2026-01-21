-- Phase 5: violations 테이블 생성 (범칙금)
-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS public.violations;

-- 1) 테이블 생성
CREATE TABLE public.violations (
  violation_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  department TEXT, -- 소속 (NULL 가능)
  driver_name TEXT, -- 운전자명 (NULL 가능)
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  violation_date_time TIMESTAMPTZ NOT NULL, -- 위반일시
  notice_type TEXT NOT NULL, -- 고지서유형
  fine_amount INTEGER NOT NULL DEFAULT 0, -- 범칙금
  detail_info TEXT, -- 세부내용
  authority TEXT, -- 관할관청
  location TEXT, -- 위반장소
  payment_due_date DATE, -- 납부기한
  
  is_transferred CHAR(1) NOT NULL DEFAULT 'N' CHECK (is_transferred IN ('Y', 'N')), -- 이관여부
  transfer_date DATE, -- 이관일 (NULL 가능)
  
  is_paid CHAR(1) NOT NULL DEFAULT 'N' CHECK (is_paid IN ('Y', 'N')), -- 납부여부
  payment_date DATE, -- 납부일 (NULL 가능)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT violations_unique_entry UNIQUE (cmny_id, vehicle_no, violation_date_time)
);

-- 2) 인덱스 생성
CREATE INDEX violations_cmny_year_idx ON public.violations(cmny_id, year_month);
CREATE INDEX violations_vehicle_idx ON public.violations(vehicle_no, violation_date_time DESC);
CREATE INDEX violations_is_paid_idx ON public.violations(is_paid);

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

-- 7) violations_summary 뷰 생성
DROP VIEW IF EXISTS public.violations_summary;

CREATE VIEW public.violations_summary AS
SELECT 
  v.violation_id,
  v.cmny_id,
  c.cmny_nm,
  v.year_month,
  v.department,
  v.driver_name,
  v.vehicle_no,
  v.violation_date_time,
  v.notice_type,
  v.fine_amount,
  v.detail_info,
  v.authority,
  v.location,
  v.payment_due_date,
  v.is_transferred,
  v.transfer_date,
  v.is_paid,
  v.payment_date,
  RANK() OVER (PARTITION BY v.cmny_id, v.year_month ORDER BY v.violation_date_time DESC) as rank
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id;
