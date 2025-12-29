-- Profile INSERT 정책 추가
-- 트리거 실패 시 사용자가 자신의 프로필을 생성할 수 있도록 허용

-- 사용자는 자신의 프로필을 생성할 수 있음 (트리거 실패 대비)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);



