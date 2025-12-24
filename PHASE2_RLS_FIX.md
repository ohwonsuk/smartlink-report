# Phase 2: RLS 무한 재귀 문제 수정

## 문제

Admin 관련 RLS 정책이 무한 재귀를 일으켜서 profile 조회가 불가능했습니다:

```
infinite recursion detected in policy for relation "profiles"
```

## 원인

기존 RLS 정책:

```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles profiles_1
      WHERE profiles_1.user_id = auth.uid()
      AND profiles_1.role = 'admin'
    )
  );
```

이 정책은:

1. `profiles` 조회 시 → "이 사용자가 admin인가?" 확인
2. admin 확인을 위해 → 다시 `profiles` 조회
3. 그 조회도 RLS 정책 적용 → 다시 admin 확인
4. **무한 반복** 💥

## 해결 방법

### 1. RLS 정책 간소화

복잡한 Admin 정책을 제거하고, 기본 정책만 유지:

```sql
-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 기본 정보만 수정 가능
CREATE POLICY "Users can update own basic info"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 2. Admin 작업은 service_role 사용

Admin이 모든 사용자를 조회/수정할 때는 `service_role` key를 사용하여 RLS를 우회합니다.

## 설치 방법

### 1. 환경 변수 추가

`.env.local` 파일에 다음 추가:

```bash
# 기존
NEXT_PUBLIC_SUPABASE_URL=https://kexvicijhdgnjkbvxfso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_H2_3LnLTqC-nnXx9onGOEw_AlNkmF3E

# 추가 (Supabase Dashboard → Settings → API → service_role key)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

⚠️ **중요**: `service_role` key는 절대 브라우저에 노출되어서는 안 됩니다!

### 2. RLS 정책 재생성

Supabase SQL Editor에서 다음 쿼리 실행:

```sql
-- supabase/migrations/001_profiles_rls_simple.sql 파일 내용 복사하여 실행
```

또는 터미널에서:

```bash
# Supabase CLI 사용 (설정되어 있다면)
supabase db push
```

### 3. 개발 서버 재시작

```bash
npm run dev
```

## 변경 사항 요약

### 새로 생성된 파일

1. **`lib/supabase/admin.ts`**: Admin 전용 Supabase 클라이언트 (service_role 사용)
2. **`app/api/admin/profiles/route.ts`**: Admin용 API Route (profile 업데이트)
3. **`supabase/migrations/001_profiles_rls_simple.sql`**: 간소화된 RLS 정책

### 수정된 파일

1. **`app/admin/users/page.tsx`**:
   - `service_role`을 사용하여 모든 프로필 조회
   - Admin 권한 확인 로직 추가

2. **`app/admin/users/UserManagementClient.tsx`**:
   - 직접 Supabase 호출 → API Route 호출로 변경
   - 승인/거부/권한 변경 시 `/api/admin/profiles` 사용

3. **`app/page.tsx`**, **`app/admin/layout.tsx`**:
   - 디버깅 로그 추가

## 테스트 시나리오

### 1. Admin 로그인

1. Supabase SQL Editor에서 본인을 Admin으로 설정:

   ```sql
   UPDATE public.profiles
   SET role = 'admin', is_approved = true
   WHERE user_id = '53e9e0dc-b9df-4e12-8943-a08288d18344';
   ```

2. 로그인 후 `/admin/users`로 자동 이동 확인

### 2. 사용자 관리

1. Admin 페이지에서 모든 사용자 목록 조회
2. 사용자 승인/거부 테스트
3. 권한 변경 테스트 (user ↔ admin)

### 3. 일반 사용자

1. 다른 계정으로 로그인
2. 승인 대기 화면 표시 확인
3. Admin이 승인 후 `/report`로 이동 (Phase 3+에서 구현)

## 문제 해결

### service_role key 에러

```
Missing Supabase environment variables
```

→ `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 추가 및 서버 재시작

### Admin 페이지 접근 불가

1. Supabase SQL Editor에서 본인 프로필 확인:

   ```sql
   SELECT user_id, role, is_approved
   FROM public.profiles
   WHERE user_id = '<your-user-id>';
   ```

2. Admin으로 설정:
   ```sql
   UPDATE public.profiles
   SET role = 'admin', is_approved = true
   WHERE user_id = '<your-user-id>';
   ```

### RLS 정책 재설정

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 새 정책 적용 (001_profiles_rls_simple.sql 실행)
```

## 참고

- **RLS (Row Level Security)**: PostgreSQL의 보안 기능으로, 행 단위 접근 제어
- **service_role**: RLS를 우회하는 특수 권한 키
- **Infinite Recursion**: RLS 정책이 자기 자신을 참조하여 발생하는 순환 참조 문제
