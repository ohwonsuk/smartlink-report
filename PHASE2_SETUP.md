# Phase 2: Admin 사용자 관리 설정 가이드

## Phase 2 구현 완료 항목

✅ **companies 테이블 생성**

- 고객사 정보 저장 (고객사명, 사업자번호)
- 검색 최적화 (GIN 인덱스)
- RLS 정책 (승인된 사용자 조회, admin 관리)

✅ **Admin 레이아웃**

- Admin 전용 레이아웃 및 네비게이션
- 로그아웃 기능
- Admin 권한 체크

✅ **사용자 관리 화면**

- 사용자 목록 조회
- 사용자 승인/취소
- 권한 변경 (admin ↔ user)
- 필터링 (전체/승인 대기/승인됨)

✅ **테스트 데이터**

- 테스트용 고객사 5개

---

## 설치 및 실행

### 1단계: DB 마이그레이션 실행

Supabase Dashboard > SQL Editor에서 다음 파일들을 순서대로 실행:

#### 1) companies 테이블 생성

```sql
-- supabase/migrations/002_companies_table.sql 파일 내용 복사 후 실행
```

#### 2) 테스트 고객사 데이터 생성

```sql
-- supabase/seed/001_test_companies.sql 파일 내용 복사 후 실행
```

### 2단계: 개발 서버 재시작

```bash
# 이미 실행 중이면 Ctrl+C로 중지 후
npm run dev
```

---

## Phase 2 테스트 시나리오

### 시나리오 1: Admin 로그인 및 화면 접근

1. ✅ Admin 계정으로 로그인
2. ✅ http://localhost:3000 접속 → Admin 페이지로 자동 리다이렉트
3. ✅ Admin 네비게이션 표시 확인
4. ✅ "사용자 관리" 메뉴 클릭

### 시나리오 2: 새 사용자 승인

1. ✅ 다른 Google 계정으로 로그인 (시크릿 창 사용)
2. ✅ "관리자 승인 대기" 화면 표시 확인
3. ✅ Admin 계정으로 `/admin/users` 이동
4. ✅ 새 사용자가 "승인 대기" 상태로 표시되는지 확인
5. ✅ "승인" 버튼 클릭
6. ✅ 상태가 "승인됨"으로 변경되는지 확인
7. ✅ 새 사용자 계정으로 재로그인
8. ✅ 승인 대기 화면 대신 다른 화면으로 이동하는지 확인

### 시나리오 3: 권한 변경

1. ✅ Admin 계정으로 `/admin/users` 이동
2. ✅ 일반 사용자의 권한을 "관리자"로 변경
3. ✅ 해당 사용자로 로그인하여 Admin 메뉴 접근 확인
4. ✅ 다시 "일반 사용자"로 변경
5. ✅ Admin 메뉴 접근 불가 확인

### 시나리오 4: 승인 취소

1. ✅ Admin 계정으로 `/admin/users` 이동
2. ✅ 승인된 사용자의 "승인 취소" 버튼 클릭
3. ✅ 상태가 "대기중"으로 변경되는지 확인
4. ✅ 해당 사용자로 로그인하여 승인 대기 화면 표시 확인

### 시나리오 5: 필터링

1. ✅ "전체" 버튼: 모든 사용자 표시
2. ✅ "승인 대기" 버튼: 미승인 사용자만 표시
3. ✅ "승인됨" 버튼: 승인된 사용자만 표시
4. ✅ 각 필터의 카운트가 정확한지 확인

---

## 화면 구조

```
/admin
├── layout.tsx              # Admin 레이아웃 (권한 체크)
├── components/
│   └── AdminNav.tsx        # Admin 네비게이션
└── users/
    ├── page.tsx            # 사용자 관리 페이지 (Server)
    └── UserManagementClient.tsx  # 사용자 관리 클라이언트 컴포넌트
```

---

## 주요 기능

### 사용자 관리 화면 (`/admin/users`)

#### 기능

- **사용자 목록**: 모든 사용자 프로필 조회
- **승인/취소**: 사용자 접근 권한 제어
- **권한 변경**: admin ↔ user 전환
- **필터링**: 전체/승인 대기/승인됨

#### 표시 정보

- 사용자명 (display_name)
- User ID
- 부서 (department)
- 권한 (role)
- 승인 상태 (is_approved)
- 가입일 (created_at)

---

## 데이터베이스 구조

### companies 테이블

```sql
companies (
  cmny_id UUID PRIMARY KEY,
  cmny_nm TEXT NOT NULL,     -- 고객사명
  biz_no TEXT,                -- 사업자번호
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### RLS 정책

- 승인된 사용자: 모든 고객사 조회 가능
- Admin: 고객사 생성/수정/삭제 가능

---

## 다음 단계: Phase 3

Phase 2 테스트 완료 후 Phase 3 진행:

- 고객사 검색 (자동완성)
- 즐겨찾기 기능
- 즐겨찾기 목록 표시

**Phase 3 시작**: "Phase 3 시작해줘" 라고 말씀해주세요!

---

## 문제 해결

### Admin 페이지 접근 불가

- profiles 테이블에서 본인 계정의 role이 'admin'인지 확인
- SQL로 수동 설정:

```sql
UPDATE public.profiles
SET role = 'admin', is_approved = TRUE
WHERE user_id = 'your-user-id';
```

### 사용자 목록이 표시되지 않음

- Supabase RLS 정책이 올바르게 적용되었는지 확인
- Browser Console에서 오류 메시지 확인
- Network 탭에서 API 요청/응답 확인

### 승인/권한 변경이 작동하지 않음

- Admin 권한이 있는지 확인
- RLS 정책에서 Admin만 업데이트 가능하도록 설정되어 있음


