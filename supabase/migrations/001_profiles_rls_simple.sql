-- RLS 정책 간소화 (무한 재귀 방지)
-- Admin 관련 복잡한 정책 제거, 서버 측에서 service_role 사용

-- 1) 기존 RLS 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view admin profiles" ON public.profiles;

-- 2) 간단한 RLS 정책만 유지

-- 2-1) 모든 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2-2) 사용자는 자신의 display_name, department만 수정 가능
-- role과 is_approved는 서버 측에서 service_role로만 수정 가능
CREATE POLICY "Users can update own basic info"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 참고:
-- Admin이 다른 사용자 프로필을 조회/수정하려면
-- 서버 측 코드에서 service_role key를 사용해야 합니다.
-- 이렇게 하면 RLS 무한 재귀 문제를 완전히 피할 수 있습니다.

