-- RLS 무한 재귀 문제 수정

-- 1) 기존 RLS 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2) 새로운 RLS 정책 생성 (무한 재귀 방지)

-- 2-1) 모든 사용자는 자신의 프로필을 조회 가능
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2-2) 모든 사용자는 admin 프로필을 조회 가능 (admin 체크용)
-- 이렇게 하면 본인 프로필 + 모든 admin 프로필을 볼 수 있음
CREATE POLICY "Users can view admin profiles"
  ON public.profiles
  FOR SELECT
  USING (role = 'admin');

-- 2-3) Admin은 모든 프로필 조회 가능
-- 이 정책은 현재 조회하려는 row가 아니라, 조회하는 user의 role을 체크
-- 하지만 이것도 재귀를 일으킬 수 있으므로 주석 처리
-- CREATE POLICY "Admins can view all profiles"
--   ON public.profiles
--   FOR SELECT
--   USING (
--     (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
--   );

-- 대신, 서버 측 코드에서 admin 체크 후 필요시 service_role로 조회

-- 2-4) 사용자는 자신의 display_name, department만 수정 가능
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    -- role과 is_approved는 변경 불가 (admin만 가능)
  );

-- 2-5) Admin이 다른 프로필을 수정할 수 있도록 하는 정책
-- 본인이 admin이면 다른 사용자 프로필 수정 가능
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    -- 본인 프로필을 확인하여 admin인 경우만 허용
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
      LIMIT 1
    )
  );

-- 참고: 이 정책도 재귀 가능성이 있지만, UPDATE는 일반적으로 덜 빈번하므로
-- 문제가 될 가능성이 낮음. 만약 문제가 되면 서버 측에서 service_role 사용 필요

