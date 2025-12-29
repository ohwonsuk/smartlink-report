# 사고내역 (Accidents) 설정

## 개요

첨부 이미지를 참조하여 사고내역 테이블 구조와 샘플 데이터를 생성했습니다.

## 생성된 파일

### 1. 마이그레이션 파일

#### `022_accidents_update.sql`
- 기존 테이블을 삭제하고 사고내역 형식으로 재구성
- 주요 컬럼:

**인적 정보 (마스킹 대상)**
- `department`: 소속 (부서명) - UI에서 마스킹 처리 필요
- `driver_name`: 운전자명 - UI에서 마스킹 처리 필요

**차량 정보**
- `vehicle_no`: 차량번호
- `vehicle_model`: 차종

**사고 정보**
- `accident_category`: 사고구분 (기타, 자손, 대물, 대인 등)
- `accident_type`: 사고분류 (차대차, 차대물, 단독, 대인 등)
- `accident_datetime`: 사고일시
- `accident_location`: 사고장소

**접수 정보**
- `report_date`: 접수일자
- `report_number`: 접수번호

**처리 정보**
- `status`: 처리상태 (접수, 처리중, 완료, 종결)
- `close_date`: 종결일자
- `deductible`: 면책금 (원)

**상세 정보**
- `damage_cost`: 피해 금액 (원)
- `description`: 사고 내용

### 2. 뷰

#### `accidents_summary`
- 고객사별 년월별 사고내역 조회 뷰
- 사고일시 기준 순위 포함

### 3. 샘플 데이터 파일

#### `019_accidents_new_data.sql`
- 첨부 이미지 데이터를 정확히 반영한 샘플 데이터
- SK렌터카 (cmny_id = 153) 주요 데이터 (이미지 기준):

| 소속 | 운전자명 | 차량번호 | 차종 | 사고구분 | 사고분류 | 사고일시 | 접수일자 | 접수번호 | 처리상태 | 종결일자 | 면책금 | 사고장소 |
|------|----------|----------|------|----------|----------|----------|----------|----------|----------|----------|--------|----------|
| 영업1팀 | 김민수 | 223허5990 | 아반떼 | 기타 | 차대차 | 2025-11-04 15:00 | 2025-11-05 | A1234 | 처리중 | - | 0 | - |

- 5개 고객사 × 각 2~10건의 사고 기록 샘플 데이터 포함

## 테이블 구조

### accidents 테이블

```sql
CREATE TABLE public.accidents (
  accident_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL,
  year_month CHAR(6) NOT NULL,
  
  -- 인적 정보 (마스킹 대상)
  department TEXT,
  driver_name TEXT NOT NULL,
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL,
  vehicle_model TEXT,
  
  -- 사고 정보
  accident_category TEXT NOT NULL,
  accident_type TEXT NOT NULL,
  accident_datetime TIMESTAMPTZ NOT NULL,
  accident_location TEXT,
  
  -- 접수 정보
  report_date DATE NOT NULL,
  report_number TEXT,
  
  -- 처리 정보
  status TEXT NOT NULL DEFAULT '접수',
  close_date DATE,
  deductible INTEGER NOT NULL DEFAULT 0,
  
  -- 상세 정보
  damage_cost INTEGER DEFAULT 0,
  description TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### accidents_summary 뷰

고객사별 년월별 사고내역을 자동으로 조회하는 뷰 (순위 포함)

## 사용 방법

### 1. 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 SQL Editor에서 실행:
# 022_accidents_update.sql
```

### 2. 샘플 데이터 삽입

```bash
# SQL Editor에서 실행:
# 019_accidents_new_data.sql
```

### 3. 데이터 조회

#### 고객사별 사고내역 조회 (사고일시 순)

```sql
SELECT 
  department as "소속",
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  vehicle_model as "차종",
  accident_category as "사고구분",
  accident_type as "사고분류",
  TO_CHAR(accident_datetime, 'YYYY-MM-DD HH24:MI') as "사고일시",
  report_date as "접수일자",
  report_number as "접수번호",
  status as "처리상태",
  close_date as "종결일자",
  deductible as "면책금",
  COALESCE(accident_location, '') as "사고장소"
FROM accidents
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY accident_datetime DESC;
```

#### 처리상태별 사고 조회

```sql
SELECT 
  status as "처리상태",
  COUNT(*) as "건수",
  SUM(deductible) as "총면책금",
  SUM(damage_cost) as "총피해액"
FROM accidents
WHERE cmny_id = 153 
  AND year_month = '202511'
GROUP BY status
ORDER BY 
  CASE status
    WHEN '접수' THEN 1
    WHEN '처리중' THEN 2
    WHEN '완료' THEN 3
    WHEN '종결' THEN 4
  END;
```

#### 미종결 사고 조회

```sql
SELECT 
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  accident_category as "사고구분",
  TO_CHAR(accident_datetime, 'YYYY-MM-DD HH24:MI') as "사고일시",
  report_date as "접수일자",
  status as "처리상태",
  deductible as "면책금"
FROM accidents
WHERE cmny_id = 153 
  AND year_month = '202511'
  AND status IN ('접수', '처리중')
ORDER BY accident_datetime DESC;
```

#### 사고분류별 통계

```sql
SELECT 
  accident_category as "사고구분",
  accident_type as "사고분류",
  COUNT(*) as "건수",
  SUM(deductible) as "총면책금",
  AVG(deductible) as "평균면책금",
  SUM(damage_cost) as "총피해액"
FROM accidents
WHERE cmny_id = 153 
  AND year_month = '202511'
GROUP BY accident_category, accident_type
ORDER BY COUNT(*) DESC;
```

## UI 구성 가이드

첨부 이미지를 참조하여 다음과 같이 구성:

### 테이블 구성

| No | 소속 | 운전자명 | 차량번호 | 차종 | 사고구분 | 사고분류 | 사고일시 | 접수일자 | 접수번호 | 처리상태 | 종결일자 | 면책금 | 사고장소 |
|----|------|----------|----------|------|----------|----------|----------|----------|----------|----------|----------|--------|----------|

### 마스킹 처리 필요
- **소속 (department)**: *** 형태로 마스킹
- **운전자명 (driver_name)**: *** 형태로 마스킹

### 사고구분 (accident_category)
- **기타**: 일반 사고
- **자손**: 자차 손해
- **대물**: 대물 손해
- **대인**: 대인 손해

### 사고분류 (accident_type)
- **차대차**: 차량 간 충돌
- **차대물**: 차량과 물체 충돌
- **단독**: 단독 사고
- **대인**: 대인 사고

### 처리상태 (status)
- **접수**: 사고 접수됨
- **처리중**: 처리 진행중
- **완료**: 처리 완료
- **종결**: 사고 종결

### 면책금 (deductible)
- 자손(단독) 사고의 경우 면책금 발생 (예: 30,000원, 50,000원)
- 대물/차대차 사고의 경우 면책금 0원

### 날짜/시간 형식
- **사고일시**: YYYY-MM-DD HH24:MI (예: 2025-11-04 15:00)
- **접수일자**: YYYY-MM-DD (예: 2025-11-05)
- **종결일자**: YYYY-MM-DD 또는 빈값

## 데이터 특징

### 사고일시 vs 접수일자
- **사고일시**: 실제 사고 발생 일시 (필수)
- **접수일자**: 사고 접수 일자 (필수)
- 일반적으로 접수일자가 사고일시와 같거나 1~2일 늦음

### 접수번호
- 사고 접수 시 부여되는 고유 번호
- 형식: A1234, H1001, L3001 등
- NULL 가능

### 종결일자
- 사고 처리가 완전히 종결된 날짜
- 처리상태가 '완료' 또는 '종결'인 경우에만 값이 있음
- '접수', '처리중' 상태는 NULL

### 면책금
- 자차 손해 사고(자손, 단독)의 경우 발생
- 일반적으로 30,000원 ~ 50,000원
- 대물/대인 사고는 0원

### 사고장소
- 사고가 발생한 구체적인 장소
- NULL 가능 (장소를 특정하기 어려운 경우)

## 참고사항

- RLS(Row Level Security) 정책 적용됨
- 승인된 사용자만 조회 가능
- Admin만 생성/수정/삭제 가능
- updated_at 자동 업데이트 트리거 적용
- 소속, 운전자명은 개인정보이므로 UI에서 마스킹 처리 필수
- 사고일시 기준으로 정렬 (최신순)
- 미종결 사고(접수, 처리중)를 별도로 관리 필요

