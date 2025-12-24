# Phase 3: 고객사 검색 및 즐겨찾기

## 목표
- 고객사 검색 기능 (autocomplete)
- 즐겨찾기 등록/삭제 기능
- 즐겨찾기 목록 표시

## 데이터베이스 스키마

### 1. favorites 테이블

```sql
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, cmny_id)
);

-- 인덱스
CREATE INDEX favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX favorites_cmny_id_idx ON public.favorites(cmny_id);

-- RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 즐겨찾기만 조회/생성/삭제 가능
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);
```

## UI 구성

### 1. 리포트 메인 페이지 (`/report`)

```
┌─────────────────────────────────────────────────────┐
│  스마트링크 월간 리포트                                │
│  홍길동 · 개발팀                          [로그아웃]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  즐겨찾기 ⭐                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ SK렌터카  │ │ 현대렌터카 │ │ 롯데렌터카 │           │
│  │ [조회] [X]│ │ [조회] [X]│ │ [조회] [X]│           │
│  └──────────┘ └──────────┘ └──────────┘           │
│                                                     │
│  고객사 검색                                          │
│  ┌─────────────────────────────────────┐           │
│  │ 고객사명 입력...            [검색] 🔍 │           │
│  └─────────────────────────────────────┘           │
│                                                     │
│  검색 결과                                           │
│  ┌─────────────────────────────────────┐           │
│  │ SK렌터카                    [조회] ⭐ │           │
│  │ 현대렌터카                  [조회] ☆  │           │
│  │ 롯데렌터카                  [조회] ⭐ │           │
│  └─────────────────────────────────────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 리포트 선택 다이얼로그

```
┌─────────────────────────────────────┐
│  SK렌터카 - 리포트 보기               │
├─────────────────────────────────────┤
│                                     │
│  연도: [2024 ▼]                     │
│  월:   [11 ▼]  (기본: 전월)          │
│                                     │
│  [웹에서 보기]  [PDF 다운로드]        │
│                                     │
└─────────────────────────────────────┘
```

## API 엔드포인트

### 1. 고객사 검색 API (`/api/companies/search`)

```typescript
// GET /api/companies/search?q=sk
{
  "data": [
    { "cmny_id": 1, "cmny_nm": "SK렌터카", "biz_no": "110-81-12345" },
    { "cmny_id": 2, "cmny_nm": "현대렌터카", "biz_no": "110-81-23456" }
  ]
}
```

### 2. 즐겨찾기 조회 API (`/api/favorites`)

```typescript
// GET /api/favorites
{
  "data": [
    {
      "id": "uuid",
      "cmny_id": 1,
      "cmny_nm": "SK렌터카",
      "created_at": "2024-12-24T10:00:00Z"
    }
  ]
}
```

### 3. 즐겨찾기 추가 API (`/api/favorites`)

```typescript
// POST /api/favorites
{
  "cmny_id": 1
}
```

### 4. 즐겨찾기 삭제 API (`/api/favorites/[id]`)

```typescript
// DELETE /api/favorites/[id]
```

## 파일 구조

```
app/
├── report/
│   ├── page.tsx                    # 메인 리포트 페이지
│   └── components/
│       ├── FavoriteList.tsx        # 즐겨찾기 목록
│       ├── CompanySearch.tsx       # 고객사 검색
│       └── ReportDialog.tsx        # 리포트 선택 다이얼로그
├── api/
│   ├── companies/
│   │   └── search/
│   │       └── route.ts            # 고객사 검색 API
│   └── favorites/
│       ├── route.ts                # 즐겨찾기 CRUD
│       └── [id]/
│           └── route.ts            # 즐겨찾기 삭제
```

## 구현 순서

1. ✅ 프로필 설정 페이지 추가
2. ⏳ favorites 테이블 생성 (migration)
3. ⏳ 고객사 검색 API
4. ⏳ 즐겨찾기 API (CRUD)
5. ⏳ 리포트 메인 페이지 UI
6. ⏳ 고객사 검색 컴포넌트
7. ⏳ 즐겨찾기 목록 컴포넌트
8. ⏳ 리포트 선택 다이얼로그

## 테스트 시나리오

1. **프로필 설정**
   - 첫 로그인 시 이름, 부서 입력 페이지 표시
   - 입력 후 대기 화면으로 이동

2. **고객사 검색**
   - 검색어 입력 시 자동완성
   - 검색 결과 클릭 시 리포트 선택 다이얼로그

3. **즐겨찾기**
   - ☆ 클릭 시 즐겨찾기 추가
   - ⭐ 클릭 시 즐겨찾기 삭제
   - 즐겨찾기 목록에 표시

4. **리포트 조회**
   - 연도/월 선택
   - 웹에서 보기 / PDF 다운로드

