# 구성원별 평균안전점수 (Safety Scores) 설정

## 개요

첨부 이미지를 참조하여 운전자 기준의 안전점수 테이블 구조와 샘플 데이터를 생성했습니다.

## 생성된 파일

### 1. 마이그레이션 파일

#### `020_safety_scores_driver_based.sql`
- **기존 차량 기준 테이블을 삭제하고 운전자 기준으로 재구성**
- 주요 컬럼:

**기본정보**
- `driver_name`: 운전자명
- `department`: 소속 (부서명)
- `employee_no`: 사번

**누적운행정보**
- `trip_count`: 운행건수
- `total_distance_km`: 운행거리(Km)
- `total_driving_minutes`: 운행시간(분)

**안전운행 지표**
- `sudden_accel_count`: 급가속횟수
- `sudden_decel_count`: 급감속횟수
- `avg_overspeed_rate`: 평균과속률 (%)
- `avg_safety_score`: 평균안전점수 (0~100)

**제약조건**
- UNIQUE(cmny_id, year_month, driver_name): 고객사별 년월별 운전자 유니크

### 2. 뷰

#### `safety_scores_top20`
- 고객사별 년월별 운행거리 기준 Top 20 운전자 조회 뷰
- 이미지에 표시된 "[MAX] 20대 차량 정보 출력" 요구사항 반영

### 3. 샘플 데이터 파일

#### `017_safety_scores_driver_data.sql`
- 첨부 이미지 데이터를 정확히 반영한 샘플 데이터
- SK렌터카 (cmny_id = 153) Top 10 데이터 (이미지 기준):

| 운전자 | 소속 | 사번 | 운행건수 | 운행거리(km) | 운행시간(분) | 급가속 | 급감속 | 평균과속률 | 평균안전점수 |
|--------|------|------|----------|--------------|--------------|--------|--------|------------|--------------|
| 이*주  | 영업팀 | E2001 | 2 | 121.0 | 188 | 8 | 1 | 0.00 | 90 |
| 오*석  | 영업팀 | E2002 | 13 | 389.8 | 795 | 39 | 6 | 0.13 | 90 |
| 박*준  | 물류팀 | E2003 | 38 | 747.4 | 1653 | 18 | 10 | 0.08 | 90 |
| 박*    | 기획팀 | E2004 | 1 | 10.9 | 46 | 0 | 0 | 0.00 | 90 |
| 김*준  | 영업팀 | E2005 | 16 | 635.2 | 885 | 44 | 34 | 2.08 | 90 |
| 최*오  | 물류팀 | E2006 | 76 | 1447.8 | 2076 | 555 | 220 | 6.55 | 84 |
| 김*    | 영업팀 | E2007 | 12 | 286.1 | 574 | 191 | 37 | 3.17 | 84 |
| 이*수  | 물류팀 | E2008 | 12 | 516.9 | 585 | 118 | 62 | 13.75 | 84 |
| 박*현  | 기획팀 | E2009 | 3 | 352.8 | 248 | 186 | 47 | 29.57 | 83 |
| 허*석  | 영업팀 | E2010 | 8 | 171.2 | 207 | 123 | 33 | 10.51 | 83 |

- 5개 고객사 × 각 10~20명의 운전자 샘플 데이터 포함

## 테이블 구조

### safety_scores 테이블

```sql
CREATE TABLE public.safety_scores (
  score_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL,
  year_month CHAR(6) NOT NULL,
  
  -- 기본정보
  driver_name TEXT NOT NULL,
  department TEXT,
  employee_no TEXT,
  
  -- 누적운행정보
  trip_count INTEGER NOT NULL DEFAULT 0,
  total_distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_driving_minutes INTEGER NOT NULL DEFAULT 0,
  
  -- 안전운행 지표
  sudden_accel_count INTEGER NOT NULL DEFAULT 0,
  sudden_decel_count INTEGER NOT NULL DEFAULT 0,
  avg_overspeed_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_safety_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(cmny_id, year_month, driver_name)
);
```

### safety_scores_top20 뷰

고객사별 년월별 운행거리 기준 Top 20 운전자를 자동으로 조회하는 뷰

## 사용 방법

### 1. 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 SQL Editor에서 실행:
# 020_safety_scores_driver_based.sql
```

### 2. 샘플 데이터 삽입

```bash
# SQL Editor에서 실행:
# 017_safety_scores_driver_data.sql
```

### 3. 데이터 조회

#### 고객사별 운전자 안전점수 조회 (운행거리 순)

```sql
SELECT 
  driver_name as "운전자",
  department as "소속",
  employee_no as "사번",
  trip_count as "운행건수",
  total_distance_km as "운행거리(km)",
  total_driving_minutes as "운행시간(분)",
  sudden_accel_count as "급가속횟수",
  sudden_decel_count as "급감속횟수",
  avg_overspeed_rate as "평균과속률",
  avg_safety_score as "평균안전점수"
FROM safety_scores
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY total_distance_km DESC;
```

#### Top 20 운전자 조회 (뷰 사용)

```sql
SELECT 
  driver_name as "운전자",
  department as "소속",
  employee_no as "사번",
  trip_count as "운행건수",
  total_distance_km as "운행거리(km)",
  total_driving_minutes as "운행시간(분)",
  sudden_accel_count as "급가속횟수",
  sudden_decel_count as "급감속횟수",
  avg_overspeed_rate as "평균과속률",
  avg_safety_score as "평균안전점수",
  rank as "순위"
FROM safety_scores_top20
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY rank;
```

#### 안전점수 기준 조회

```sql
SELECT 
  driver_name as "운전자",
  department as "소속",
  trip_count as "운행건수",
  total_distance_km as "운행거리(km)",
  avg_safety_score as "평균안전점수"
FROM safety_scores
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY avg_safety_score DESC, total_distance_km DESC;
```

## UI 구성 가이드

첨부 이미지를 참조하여 다음과 같이 구성:

### 테이블 구성

#### 기본정보
| 운전자 | 소속 | 사번 |
|--------|------|------|

#### 누적운행정보
| 운행건수 | 운행거리(Km) | 운행시간(분) |
|----------|--------------|--------------|

#### 평관운행정보
| 급가속횟수 | 급감속횟수 | 평균과속률 | 평균안전점수 |
|------------|------------|------------|--------------|

### 표시 옵션
- **[MAX] 20대 차량 정보 출력**: Top 20 운전자만 표시 (운행거리 기준)
- 운전자명 마스킹 처리 가능 (예: 이*주, 박*준)

## 데이터 특징

### 차량 기준 vs 운전자 기준
- **기존**: 차량별 일별 안전점수 기록
- **신규**: 운전자별 월별 누적 안전점수 집계
- 운전자가 여러 차량을 운행해도 통합 집계됨

### 집계 데이터
- 월별로 운전자의 모든 운행을 집계
- 운행건수, 총 운행거리, 총 운행시간
- 급가속/급감속 누적 횟수
- 평균 과속률 및 평균 안전점수

### 정렬 기준
- **기본**: 운행거리 내림차순 (이미지 참조)
- **선택**: 안전점수, 운행건수 등으로 정렬 가능

## 참고사항

- RLS(Row Level Security) 정책 적용됨
- 승인된 사용자만 조회 가능
- Admin만 생성/수정/삭제 가능
- updated_at 자동 업데이트 트리거 적용
- 고객사별 년월별 운전자는 유니크 제약조건 있음
- 운전자 정보는 별도 테이블 없이 safety_scores 테이블에 직접 저장

