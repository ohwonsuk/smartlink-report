-- Phase 4: monthly_summary 테이블 생성

-- 1) monthly_summary 테이블 생성
CREATE TABLE IF NOT EXISTS public.monthly_summary (
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식

  -- 대상 차량/집계 기반
  vehicle_count INTEGER NOT NULL DEFAULT 0,
  total_mileage_km NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_driving_minutes INTEGER NOT NULL DEFAULT 0,

  trip_log_vehicle_count INTEGER NOT NULL DEFAULT 0,
  avg_safe_score NUMERIC(5,2),

  maintenance_completed_count INTEGER NOT NULL DEFAULT 0,
  accident_count INTEGER NOT NULL DEFAULT 0,

  violation_count INTEGER NOT NULL DEFAULT 0,
  violation_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (cmny_id, year_month)
);

-- 2) 인덱스 생성
CREATE INDEX monthly_summary_year_month_idx ON public.monthly_summary(year_month);
CREATE INDEX monthly_summary_cmny_id_idx ON public.monthly_summary(cmny_id);

-- 3) RLS 활성화
ALTER TABLE public.monthly_summary ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 월간 요약 조회 가능
CREATE POLICY "Approved users can view all monthly summaries"
  ON public.monthly_summary
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert monthly summaries"
  ON public.monthly_summary
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update monthly summaries"
  ON public.monthly_summary
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete monthly summaries"
  ON public.monthly_summary
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS set_monthly_summary_updated_at ON public.monthly_summary;
CREATE TRIGGER set_monthly_summary_updated_at
  BEFORE UPDATE ON public.monthly_summary
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

