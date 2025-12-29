# companies 테이블 재생성 가이드

## 변경 사항

- **cmny_id 타입 변경**: UUID → INTEGER
- **cmny_id 입력 방식**: 자동 생성 → 수기 입력

## 실행 순서

### 1단계: 기존 테이블 삭제 및 재생성

Supabase SQL Editor에서 다음 파일을 실행:

```sql
-- supabase/migrations/002_companies_table.sql
```

이 파일은 다음을 수행합니다:

1. 기존 `companies` 테이블 삭제 (CASCADE로 관련 객체도 삭제)
2. 새로운 테이블 생성 (cmny_id INTEGER PRIMARY KEY)
3. 인덱스 생성
4. RLS 정책 생성
5. 트리거 생성

### 2단계: 테스트 데이터 입력

```sql
-- supabase/seed/001_test_companies.sql
```

샘플 데이터 5개가 cmny_id와 함께 입력됩니다:

- cmny_id: 1, 2, 3, 4, 5
- 고객사명: SK렌터카, 현대렌터카, 롯데렌터카, 에이비카, 그린카

## 주의사항

⚠️ **기존 데이터 백업**: 기존 companies 테이블에 데이터가 있다면 먼저 백업하세요.

```sql
-- 백업 (선택사항)
CREATE TABLE companies_backup AS SELECT * FROM public.companies;
```

⚠️ **외래키 참조**: 다른 테이블에서 companies를 참조하는 외래키가 있다면 CASCADE로 삭제됩니다.
나중에 Phase 3+에서 생성될 테이블들도 영향을 받을 수 있습니다.

## 확인

재생성 후 다음 쿼리로 확인:

```sql
-- 테이블 구조 확인
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'companies'
ORDER BY ordinal_position;

-- 데이터 확인
SELECT * FROM public.companies ORDER BY cmny_id;
```


