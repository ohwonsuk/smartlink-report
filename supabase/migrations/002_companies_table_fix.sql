-- Phase 2: companies 테이블 수정 (GIN 인덱스 오류 해결)

-- 기존에 생성 시도한 GIN 인덱스가 있다면 삭제
DROP INDEX IF EXISTS public.companies_name_gin_idx;

-- pg_trgm extension이 활성화되어 있다면 제거 (Supabase에서는 필요 없음)
-- DROP EXTENSION IF EXISTS pg_trgm;

-- 일반 B-tree 인덱스 생성 (이미 있다면 무시)
CREATE INDEX IF NOT EXISTS companies_name_idx 
  ON public.companies (cmny_nm);

-- 대소문자 구분 없이 검색을 위한 LOWER 인덱스 (선택사항)
CREATE INDEX IF NOT EXISTS companies_name_lower_idx 
  ON public.companies (LOWER(cmny_nm));



