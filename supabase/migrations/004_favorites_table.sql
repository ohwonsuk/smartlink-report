-- Phase 3: favorites 테이블 생성

-- 1) favorites 테이블 생성
CREATE TABLE IF NOT EXISTS public.favorites (
  favorite_id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, cmny_id)
);

-- 2) 인덱스 생성
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_cmny_id_idx ON public.favorites(cmny_id);

-- 3) RLS 활성화
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책 생성

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

