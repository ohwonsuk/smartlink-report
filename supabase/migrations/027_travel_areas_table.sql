-- Phase 5: travel_areas 테이블 생성 (주요 이동지역)

-- 1) 주요 이동지역 테이블 생성
CREATE TABLE public.travel_areas (
  travel_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  sido TEXT NOT NULL, -- 시도명
  sigungu TEXT NOT NULL, -- 시군구명
  trip_count INTEGER NOT NULL DEFAULT 1, -- 횟수
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 동일 지역을 같은 달에 이동한 기록은 합산(Upsert)하기 위해 유니크 제약 조건 설정
  CONSTRAINT travel_areas_unique_entry UNIQUE (cmny_id, year_month, sido, sigungu)
);

-- 2) 인덱스 생성
CREATE INDEX travel_areas_cmny_year_idx ON public.travel_areas(cmny_id, year_month);

-- 3) RLS 활성화
ALTER TABLE public.travel_areas ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 이동지역 조회 가능
CREATE POLICY "Approved users can view travel areas"
  ON public.travel_areas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert travel areas"
  ON public.travel_areas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update travel areas"
  ON public.travel_areas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete travel areas"
  ON public.travel_areas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_travel_areas_updated_at
  BEFORE UPDATE ON public.travel_areas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7) 데이터 확인용 뷰 생성 (전체 건수 합산용)
CREATE VIEW public.travel_areas_summary AS
SELECT 
  cmny_id,
  year_month,
  sido,
  sigungu,
  SUM(trip_count) as total_trip_count
FROM public.travel_areas
GROUP BY cmny_id, year_month, sido, sigungu;
