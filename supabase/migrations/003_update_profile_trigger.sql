-- Phase 2.5: 트리거 함수 업데이트 (display_name을 NULL로 설정)

-- 기존 트리거 함수 업데이트
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, department)
  VALUES (
    NEW.id,
    NEW.email,  -- auth.users의 email 저장
    NULL,  -- 사용자가 직접 입력하도록 NULL로 설정
    NULL
  );
  RETURN NEW;
END;
$$;

-- 기존 사용자의 display_name이 이메일인 경우 NULL로 변경 (선택사항)
-- UPDATE public.profiles 
-- SET display_name = NULL 
-- WHERE display_name LIKE '%@%';

