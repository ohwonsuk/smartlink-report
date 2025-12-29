-- Phase 5: safety_scores 테이블 재구성 (운전자 기준)

-- 1) 기존 테이블 삭제
DROP TABLE IF EXISTS public.safety_scores CASCADE;

-- 2) 운전자 기준 안전점수 테이블 생성
CREATE TABLE public.safety_scores (
  score_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  -- 기본정보 (운전자)
  driver_name TEXT NOT NULL, -- 운전자명
  department TEXT, -- 소속 (부서명)
  employee_no TEXT, -- 사번
  
  -- 누적운행정보
  trip_count INTEGER NOT NULL DEFAULT 0, -- 운행건수
  total_distance_km NUMERIC(10,2) NOT NULL DEFAULT 0, -- 운행거리(Km)
  total_driving_minutes INTEGER NOT NULL DEFAULT 0, -- 운행시간(분)
  
  -- 안전운행 지표
  sudden_accel_count INTEGER NOT NULL DEFAULT 0, -- 급가속횟수
  sudden_decel_count INTEGER NOT NULL DEFAULT 0, -- 급감속횟수
  avg_overspeed_rate NUMERIC(5,2) NOT NULL DEFAULT 0, -- 평균과속률 (%)
  avg_safety_score NUMERIC(5,2) NOT NULL DEFAULT 0, -- 평균안전점수 (0~100)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 고객사별 년월별 운전자 유니크
  UNIQUE(cmny_id, year_month, driver_name)
);

-- 3) 인덱스 생성
CREATE INDEX safety_scores_cmny_year_idx ON public.safety_scores(cmny_id, year_month);
CREATE INDEX safety_scores_driver_idx ON public.safety_scores(driver_name);
CREATE INDEX safety_scores_score_idx ON public.safety_scores(cmny_id, year_month, avg_safety_score DESC);
CREATE INDEX safety_scores_distance_idx ON public.safety_scores(cmny_id, year_month, total_distance_km DESC);

-- 4) RLS 활성화
ALTER TABLE public.safety_scores ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 안전점수 조회 가능
CREATE POLICY "Approved users can view safety scores"
  ON public.safety_scores
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert safety scores"
  ON public.safety_scores
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update safety scores"
  ON public.safety_scores
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete safety scores"
  ON public.safety_scores
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_safety_scores_updated_at
  BEFORE UPDATE ON public.safety_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8) 데이터 확인용 뷰 생성 (Top 20)
DROP VIEW IF EXISTS public.safety_scores_top20;

CREATE VIEW public.safety_scores_top20 AS
SELECT 
  cmny_id,
  cmny_nm,
  year_month,
  driver_name,
  department,
  employee_no,
  trip_count,
  total_distance_km,
  total_driving_minutes,
  sudden_accel_count,
  sudden_decel_count,
  avg_overspeed_rate,
  avg_safety_score,
  rank
FROM (
  SELECT 
    ss.cmny_id,
    c.cmny_nm,
    ss.year_month,
    ss.driver_name,
    ss.department,
    ss.employee_no,
    ss.trip_count,
    ss.total_distance_km,
    ss.total_driving_minutes,
    ss.sudden_accel_count,
    ss.sudden_decel_count,
    ss.avg_overspeed_rate,
    ss.avg_safety_score,
    RANK() OVER (PARTITION BY ss.cmny_id, ss.year_month ORDER BY ss.total_distance_km DESC) as rank
  FROM public.safety_scores ss
  JOIN public.companies c ON ss.cmny_id = c.cmny_id
) ranked
WHERE rank <= 20;

