# Phase 2.5: 프로필 설정 페이지 추가

## 변경 사항

### 1. 프로필 설정 페이지 생성 (`/profile-setup`)
- 첫 로그인 시 이름과 부서명 입력
- 입력 완료 후 승인 대기 화면으로 이동

### 2. 로그인 플로우 수정
```
Google 로그인
  ↓
프로필 생성 (display_name = NULL)
  ↓
프로필 설정 페이지 (/profile-setup)
  ↓
이름, 부서 입력
  ↓
승인 대기 화면 (/waiting-approval)
  ↓
Admin 승인
  ↓
리포트 페이지 (/report)
```

### 3. 데이터베이스 마이그레이션

**실행할 SQL** (`supabase/migrations/003_update_profile_trigger.sql`):

```sql
-- 트리거 함수 업데이트 (display_name을 NULL로 설정)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, department)
  VALUES (
    NEW.id,
    NULL,  -- 사용자가 직접 입력하도록 NULL로 설정
    NULL
  );
  RETURN NEW;
END;
$$;
```

**기존 사용자 데이터 정리** (선택사항):
```sql
-- 기존 사용자의 display_name이 이메일인 경우 NULL로 변경
UPDATE public.profiles 
SET display_name = NULL 
WHERE display_name LIKE '%@%';
```

## 설치 방법

### 1. DB 마이그레이션 실행

Supabase SQL Editor에서 실행:

```sql
-- supabase/migrations/003_update_profile_trigger.sql 내용 복사하여 실행
```

### 2. 개발 서버 재시작

```bash
# 터미널에서 Ctrl+C로 종료 후
npm run dev
```

## 테스트 시나리오

### 1. 새 사용자 로그인
1. 로그아웃 후 새 Google 계정으로 로그인
2. `/profile-setup` 페이지로 자동 이동 확인
3. 이름, 부서 입력 후 "다음" 클릭
4. `/waiting-approval` 페이지로 이동 확인

### 2. 기존 사용자 (display_name이 있는 경우)
1. 기존 계정으로 로그인
2. Admin: `/admin/users`로 이동
3. 일반 사용자 (미승인): `/waiting-approval`로 이동
4. 일반 사용자 (승인됨): `/report`로 이동

### 3. Admin 승인
1. Admin 계정으로 로그인
2. `/admin/users`에서 새 사용자 확인
3. 입력한 이름과 부서 표시 확인
4. 승인 버튼 클릭
5. 해당 사용자로 로그인 시 `/report` 이동 확인

## 파일 구조

```
app/
├── profile-setup/
│   └── page.tsx          # 프로필 설정 페이지 (NEW)
├── report/
│   └── page.tsx          # 리포트 메인 페이지 (NEW)
├── page.tsx              # 라우팅 로직 수정
└── waiting-approval/
    └── page.tsx          # 기존 파일 (변경 없음)

supabase/
└── migrations/
    └── 003_update_profile_trigger.sql  # 트리거 업데이트 (NEW)
```

## 다음 단계: Phase 3

프로필 설정이 완료되면 Phase 3로 진행:
1. favorites 테이블 생성
2. 고객사 검색 API
3. 즐겨찾기 기능
4. 리포트 선택 UI

자세한 내용은 `PHASE3_PLAN.md` 참조

