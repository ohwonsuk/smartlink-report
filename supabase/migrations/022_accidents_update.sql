-- Phase 5: accidents 테이블 재구성 (사고내역)

-- 1) 기존 테이블 삭제
DROP TABLE IF EXISTS public.accidents CASCADE;

-- 2) 사고내역 테이블 생성
CREATE TABLE public.accidents (
  accident_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  -- 인적 정보 (마스킹 대상)
  department TEXT, -- 소속 (부서명) - 마스킹 대상
  driver_name TEXT NOT NULL, -- 운전자명 - 마스킹 대상
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT, -- 차종
  
  -- 사고 정보
  accident_category TEXT NOT NULL, -- 사고구분 (기타, 자손, 대물, 대인 등)
  accident_type TEXT NOT NULL, -- 사고분류 (차대차, 차대물, 단독, 대인 등)
  accident_datetime TIMESTAMPTZ NOT NULL, -- 사고일시
  accident_location TEXT, -- 사고장소
  
  -- 접수 정보
  report_date DATE NOT NULL, -- 접수일자
  report_number TEXT, -- 접수번호
  
  -- 처리 정보
  status TEXT NOT NULL DEFAULT '접수', -- 처리상태 (접수, 처리중, 완료, 종결)
  close_date DATE, -- 종결일자
  deductible INTEGER NOT NULL DEFAULT 0, -- 면책금 (원)
  
  -- 상세 정보
  damage_cost INTEGER DEFAULT 0, -- 피해 금액 (원)
  description TEXT, -- 사고 내용
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) 인덱스 생성
CREATE INDEX accidents_cmny_year_idx ON public.accidents(cmny_id, year_month);
CREATE INDEX accidents_vehicle_idx ON public.accidents(vehicle_no, accident_datetime DESC);
CREATE INDEX accidents_category_idx ON public.accidents(accident_category);
CREATE INDEX accidents_type_idx ON public.accidents(accident_type);
CREATE INDEX accidents_status_idx ON public.accidents(status);
CREATE INDEX accidents_report_date_idx ON public.accidents(report_date DESC);

-- 4) RLS 활성화
ALTER TABLE public.accidents ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 사고 내역 조회 가능
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

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_accidents_updated_at
  BEFORE UPDATE ON public.accidents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8) 데이터 확인용 뷰 생성
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
  a.accident_category,
  a.accident_type,
  a.accident_datetime,
  a.accident_location,
  a.report_date,
  a.report_number,
  a.status,
  a.close_date,
  a.deductible,
  a.damage_cost,
  a.description,
  RANK() OVER (PARTITION BY a.cmny_id, a.year_month ORDER BY a.accident_datetime DESC) as rank
FROM public.accidents a
JOIN public.companies c ON a.cmny_id = c.cmny_id;

