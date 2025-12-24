# 스마트링크 월간 리포트

## Phase 1 설치 및 실행 가이드

### 1단계: 패키지 설치

```bash
npm install
```

### 2단계: 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```bash
# Supabase 프로젝트 정보
NEXT_PUBLIC_SUPABASE_URL=https://kexvicijhdgnjkbvxfso.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Service Role Key (서버 전용 - admin 작업용)
# Supabase Dashboard > Settings > API > service_role key에서 복사
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**중요**: Supabase Dashboard에서 실제 API 키를 복사해서 사용하세요.

### 3단계: Supabase 설정

#### 3-1. Google OAuth 설정

1. Supabase Dashboard > Authentication > Providers로 이동
2. Google Provider 활성화
3. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
4. Authorized redirect URIs에 추가:
   - 로컬: `http://localhost:3000/auth/callback`
   - 배포: `https://your-domain.vercel.app/auth/callback`

#### 3-2. 데이터베이스 마이그레이션

Supabase Dashboard > SQL Editor에서 다음 파일 실행:

- `supabase/migrations/001_profiles_table.sql`

### 4단계: 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

### 5단계: 첫 Admin 계정 생성

1. Google 로그인
2. Supabase Dashboard > Table Editor > profiles에서 본인 계정 확인
3. SQL Editor에서 실행:

```sql
-- user_id를 본인 계정의 UUID로 변경
UPDATE public.profiles
SET role = 'admin', is_approved = TRUE
WHERE user_id = 'your-user-id-here';
```

## Phase 1 테스트 시나리오

1. ✅ Google 로그인 → profiles 자동 생성 확인
2. ✅ 미승인 사용자는 "관리자 승인 대기" 화면 표시
3. ✅ 로그아웃 후 재로그인 동작 확인

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## 프로젝트 구조

```
smartlink-report/
├── app/
│   ├── login/              # 로그인 페이지
│   ├── waiting-approval/   # 승인 대기 페이지
│   ├── auth/callback/      # OAuth 콜백 핸들러
│   └── page.tsx            # 메인 (리다이렉트)
├── lib/
│   └── supabase/           # Supabase 클라이언트
│       ├── client.ts       # 브라우저용
│       ├── server.ts       # 서버용
│       └── middleware.ts   # 미들웨어용
├── supabase/
│   └── migrations/         # DB 마이그레이션 SQL
└── middleware.ts           # Next.js 미들웨어
```

## 다음 단계: Phase 2

- Admin 사용자 관리 화면 (`/admin/users`)
- companies 테이블 생성
- 테스트 데이터 seed

## 문의사항

Phase 1 완료 후 테스트하시고, 다음 단계 진행 시 말씀해주세요!
