-- Phase 6: raw_uploads 테이블 생성 및 유니크 제약조건 추가

-- 1) raw_uploads 테이블 생성
CREATE TABLE IF NOT EXISTS public.raw_uploads (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  table_name TEXT NOT NULL, -- monthly_summary, utilization_vehicle 등
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, fail
  result_summary JSONB, -- { "inserted": 10, "updated": 5, "errors": [] }
  cmny_id INTEGER REFERENCES public.companies(cmny_id) ON DELETE SET NULL, -- 선택적 (단일 고객사 업로드인 경우)
  year_month CHAR(6), -- 'YYYYMM' 형식 (선택적)
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS raw_uploads_table_name_idx ON public.raw_uploads(table_name);
CREATE INDEX IF NOT EXISTS raw_uploads_admin_id_idx ON public.raw_uploads(admin_id);
CREATE INDEX IF NOT EXISTS raw_uploads_created_at_idx ON public.raw_uploads(created_at DESC);

-- 2) UPSERT를 위한 유니크 제약조건 추가 (기존에 없는 테이블들)

-- driving_logs: (cmny_id, vehicle_no, log_date) 기준
ALTER TABLE public.driving_logs 
DROP CONSTRAINT IF EXISTS driving_logs_unique_key;
ALTER TABLE public.driving_logs 
ADD CONSTRAINT driving_logs_unique_key UNIQUE (cmny_id, vehicle_no, log_date);

-- maintenance_records: (cmny_id, vehicle_no, check_in_date, maintenance_type) 기준
ALTER TABLE public.maintenance_records 
DROP CONSTRAINT IF EXISTS maintenance_records_unique_key;
ALTER TABLE public.maintenance_records 
ADD CONSTRAINT maintenance_records_unique_key UNIQUE (cmny_id, vehicle_no, check_in_date, maintenance_type);

-- accidents: (cmny_id, vehicle_no, accident_datetime) 기준
ALTER TABLE public.accidents 
DROP CONSTRAINT IF EXISTS accidents_unique_key;
ALTER TABLE public.accidents 
ADD CONSTRAINT accidents_unique_key UNIQUE (cmny_id, vehicle_no, accident_datetime);

-- violations: (cmny_id, vehicle_no, violation_datetime) 기준
ALTER TABLE public.violations 
DROP CONSTRAINT IF EXISTS violations_unique_key;
ALTER TABLE public.violations 
ADD CONSTRAINT violations_unique_key UNIQUE (cmny_id, vehicle_no, violation_datetime);

-- 3) RLS 활성화
ALTER TABLE public.raw_uploads ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: Admin만 조회 가능
CREATE POLICY "Admins can view raw uploads"
  ON public.raw_uploads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 5) RLS 정책: Admin만 삽입 가능
CREATE POLICY "Admins can insert raw uploads"
  ON public.raw_uploads
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) RLS 정책: Admin만 수정 가능
CREATE POLICY "Admins can update raw uploads"
  ON public.raw_uploads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
