-- RLS 및 Profile 문제 진단 스크립트

-- 1) 현재 모든 프로필 확인 (RLS 무시)
-- Supabase SQL Editor는 서비스 권한으로 실행되므로 RLS를 무시하고 조회 가능
SELECT 
  user_id, 
  role, 
  is_approved, 
  display_name, 
  department,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 2) 특정 user_id로 직접 조회 (본인 user_id를 입력하세요)
SELECT 
  user_id, 
  role, 
  is_approved, 
  display_name
FROM public.profiles
WHERE user_id = '53e9e0dc-b9df-4e12-8943-a08288d18344'::uuid;

-- 3) RLS 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 4) RLS 활성화 상태 확인
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'companies');

-- 5) 트리거 확인
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('profiles', 'companies')
ORDER BY event_object_table, trigger_name;

-- 6) ENUM 타입 확인
SELECT 
  t.typname,
  e.enumlabel,
  e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- 7) 임시로 RLS 비활성화 (디버깅용 - 테스트 후 다시 활성화)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 8) RLS 다시 활성화
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

