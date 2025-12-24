-- Phase 2: companies 테이블 생성

-- 0) 기존 테이블 및 관련 객체 삭제 (재생성용)
DROP TABLE IF EXISTS public.companies CASCADE;
-- 관련 인덱스는 테이블 삭제 시 자동 삭제됨

-- 1) companies 테이블 생성
-- cmny_id는 INTEGER 타입으로 수기 입력값 사용
CREATE TABLE public.companies (
  cmny_id INTEGER PRIMARY KEY,
  cmny_nm TEXT NOT NULL,
  biz_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) 인덱스 생성 (검색 최적화)
-- 일반 B-tree 인덱스 (LIKE 검색 최적화)
-- 참고: Supabase에서는 pg_trgm extension이 기본 활성화되지 않을 수 있어
--       일반 B-tree 인덱스를 사용합니다. LIKE 검색에는 충분히 빠릅니다.
CREATE INDEX companies_name_idx 
  ON public.companies (cmny_nm);

-- 대소문자 구분 없이 검색을 위한 LOWER 인덱스
CREATE INDEX companies_name_lower_idx 
  ON public.companies (LOWER(cmny_nm));

-- cmny_id 검색 최적화 (이미 PRIMARY KEY이지만 명시적으로 추가)
-- PRIMARY KEY는 자동으로 인덱스가 생성되므로 별도 인덱스 불필요

-- 3) RLS 활성화
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책 생성
-- 기존 정책이 있다면 삭제 (테이블 삭제 시 자동 삭제되지만 명시적으로 처리)

-- 승인된 사용자는 모든 고객사 조회 가능
CREATE POLICY "Approved users can view all companies"
  ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- Admin만 고객사 생성 가능
CREATE POLICY "Admins can insert companies"
  ON public.companies
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admin만 고객사 수정 가능
CREATE POLICY "Admins can update companies"
  ON public.companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Admin만 고객사 삭제 가능
CREATE POLICY "Admins can delete companies"
  ON public.companies
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 5) updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS set_companies_updated_at ON public.companies;
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

