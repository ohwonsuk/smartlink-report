-- Phase 5: safety_scores 테이블 생성 (차량별 안전점수)

-- 1) 테이블 생성
CREATE TABLE IF NOT EXISTS public.safety_scores (
  score_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  record_date DATE NOT NULL, -- 기록 일자
  
  safe_score NUMERIC(5,2) NOT NULL DEFAULT 0, -- 안전점수 (0~100)
  sudden_accel_count INTEGER NOT NULL DEFAULT 0, -- 급가속 횟수
  sudden_brake_count INTEGER NOT NULL DEFAULT 0, -- 급정거 횟수
  overspeed_count INTEGER NOT NULL DEFAULT 0, -- 과속 횟수
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성
CREATE INDEX safety_scores_cmny_year_idx ON public.safety_scores(cmny_id, year_month);
CREATE INDEX safety_scores_vehicle_idx ON public.safety_scores(vehicle_no, record_date DESC);
CREATE INDEX safety_scores_score_idx ON public.safety_scores(cmny_id, year_month, safe_score DESC);

-- 3) RLS 활성화
ALTER TABLE public.safety_scores ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 안전점수 조회 가능
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

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_safety_scores_updated_at
  BEFORE UPDATE ON public.safety_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

