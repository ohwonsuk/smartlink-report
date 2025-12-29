-- Phase 5: violations 테이블 재구성 (벌칙금)

-- 1) 기존 테이블 삭제
DROP TABLE IF EXISTS public.violations CASCADE;

-- 2) 벌칙금 테이블 생성
CREATE TABLE public.violations (
  violation_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  -- 인적 정보 (마스킹 대상)
  department TEXT, -- 소속 (부서명) - 마스킹 대상
  driver_name TEXT NOT NULL, -- 운전자명 - 마스킹 대상
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  -- 위반 정보
  violation_datetime TIMESTAMPTZ NOT NULL, -- 위반일시
  notice_type TEXT NOT NULL, -- 고지서유형 (위반사실통지서, 과태료납부통지서 등)
  fine_amount INTEGER NOT NULL DEFAULT 0, -- 벌칙금 (과태료+과징금 기준)
  
  -- 상세 정보
  detail_info TEXT, -- 세부내용 (예: [SK렌터카] 주정차위반 과태료)
  authority TEXT, -- 관할관청
  violation_location TEXT, -- 위반장소
  
  -- 납부 정보
  payment_due_date DATE, -- 납부기한
  is_transferred BOOLEAN DEFAULT FALSE, -- 이관여부
  transfer_date DATE, -- 이관일
  is_paid BOOLEAN DEFAULT FALSE, -- 납부여부
  payment_date DATE, -- 납부일
  
  -- 추가 정보
  penalty_points INTEGER DEFAULT 0, -- 벌점
  violation_type TEXT, -- 위반 유형 (속도위반, 신호위반, 주정차위반 등)
  description TEXT, -- 비고
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) 인덱스 생성
CREATE INDEX violations_cmny_year_idx ON public.violations(cmny_id, year_month);
CREATE INDEX violations_vehicle_idx ON public.violations(vehicle_no, violation_datetime DESC);
CREATE INDEX violations_type_idx ON public.violations(violation_type);
CREATE INDEX violations_notice_type_idx ON public.violations(notice_type);
CREATE INDEX violations_payment_idx ON public.violations(is_paid);
CREATE INDEX violations_due_date_idx ON public.violations(payment_due_date);

-- 4) RLS 활성화
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 벌칙금 조회 가능
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

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_violations_updated_at
  BEFORE UPDATE ON public.violations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8) 데이터 확인용 뷰 생성
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
  v.violation_datetime,
  v.notice_type,
  v.fine_amount,
  v.detail_info,
  v.authority,
  v.violation_location,
  v.payment_due_date,
  v.is_transferred,
  v.transfer_date,
  v.is_paid,
  v.payment_date,
  v.penalty_points,
  v.violation_type,
  RANK() OVER (PARTITION BY v.cmny_id, v.year_month ORDER BY v.violation_datetime DESC) as rank
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id;

