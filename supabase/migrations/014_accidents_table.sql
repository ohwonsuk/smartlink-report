-- Phase 5: accidents 테이블 생성 (사고 내역)
-- 기존 테이블 삭제 후 재생성
DROP TABLE IF EXISTS public.accidents;

-- 1) 테이블 생성
CREATE TABLE public.accidents (
  accident_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  department TEXT, -- 소속 (NULL 가능)
  driver_name TEXT, -- 운전자명 (NULL 가능)
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT NOT NULL, -- 차종
  
  accident_type TEXT NOT NULL, -- 사고구분
  accident_category TEXT NOT NULL, -- 사고분류 (텍스트 입력)
  accident_date_time TIMESTAMPTZ NOT NULL, -- 사고일시 (Date와 Time 같이 표시)
  
  reception_date DATE NOT NULL, -- 접수일자 (Date만)
  reception_no TEXT NOT NULL, -- 접수번호
  
  status TEXT NOT NULL CHECK (status IN ('사고접수', '처리중', '처리완료', '출고완료')), -- 처리상태
  
  completion_date DATE, -- 종결일자 (NULL 가능, Date만)
  deductible INTEGER, -- 면책금 (NULL 가능)
  location TEXT, -- 사고장소 (NULL 가능)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT accidents_unique_reception UNIQUE (cmny_id, reception_no)
);

-- 2) 인덱스 생성
CREATE INDEX accidents_cmny_year_idx ON public.accidents(cmny_id, year_month);
CREATE INDEX accidents_vehicle_idx ON public.accidents(vehicle_no, accident_date_time DESC);
CREATE INDEX accidents_status_idx ON public.accidents(status);
CREATE INDEX accidents_reception_no_idx ON public.accidents(reception_no);

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

-- 7) accidents_summary 뷰 생성
DROP VIEW IF EXISTS public.accidents_summary;

CREATE VIEW public.accidents_summary AS
SELECT 
  a.accident_id,
  a.cmny_id,
  c.cmny_nm,
  a.year_month,
  a.department,
  a.driver_name,
  a.vehicle_no,
  a.vehicle_model,
  a.accident_type,
  a.accident_category,
  a.accident_date_time,
  a.reception_date,
  a.reception_no,
  a.status,
  a.completion_date,
  a.deductible,
  a.location,
  RANK() OVER (PARTITION BY a.cmny_id, a.year_month ORDER BY a.accident_date_time DESC) as rank
FROM public.accidents a
JOIN public.companies c ON a.cmny_id = c.cmny_id;
