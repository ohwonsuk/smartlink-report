-- profiles 테이블에 email 컬럼 추가

-- 1) email 컬럼 추가
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2) 인덱스 생성 (선택사항, 이메일 검색 최적화)
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- 3) 기존 사용자의 이메일 업데이트 (auth.users에서 가져오기)
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id
AND p.email IS NULL;

