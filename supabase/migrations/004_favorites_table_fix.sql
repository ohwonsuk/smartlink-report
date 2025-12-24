-- favorites 테이블 수정: id -> favorite_id

-- 1) 기존 테이블 삭제 (테스트 환경이므로 안전)
DROP TABLE IF EXISTS public.favorites CASCADE;

-- 2) favorites 테이블 재생성
CREATE TABLE public.favorites (
  favorite_id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, cmny_id)
);

-- 3) 인덱스 생성
CREATE INDEX favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX favorites_cmny_id_idx ON public.favorites(cmny_id);

-- 4) RLS 활성화
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책 생성

-- 사용자는 자신의 즐겨찾기만 조회 가능
CREATE POLICY "Users can view own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 즐겨찾기만 생성 가능
CREATE POLICY "Users can create own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 즐겨찾기만 삭제 가능
CREATE POLICY "Users can delete own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

