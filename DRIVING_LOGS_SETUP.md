# 업무용승용차 운행기록부 (Driving Logs) 설정

## 개요

첨부 이미지를 참조하여 업무용승용차 운행기록부 형식의 테이블 구조와 샘플 데이터를 생성했습니다.

## 생성된 파일

### 1. 마이그레이션 파일

#### `018_driving_logs_update.sql`
- driving_logs 테이블을 업무용승용차 운행기록부 형식으로 재구성
- 주요 컬럼:
  - `log_date`: 사용일자
  - `department`: 부서명
  - `driver_name`: 성명
  - `odometer_start`: 주행 전 계기판의 거리 (km)
  - `odometer_end`: 주행 후 계기판의 거리 (km)
  - `distance_km`: 주행거리 (자동 계산: odometer_end - odometer_start)
  - `commute_km`: 출퇴근용 거리 (km)
  - `business_km`: 업무용 거리 (km)
  - `note`: 비고
- 월별 집계 뷰 생성: `driving_logs_monthly_summary`
  - 총 주행거리, 업무용 사용거리, 업무용 사용비율 자동 계산

#### `019_add_mileage_to_utilization_vehicle.sql`
- utilization_vehicle 테이블에 `mileage_km` 컬럼 추가
- 주행거리 기준으로 최고 차량을 찾는 함수 생성: `get_top_mileage_vehicle()`

### 2. 샘플 데이터 파일

#### `015_driving_logs_new_data.sql`
- 첨부 이미지 데이터를 정확히 반영한 샘플 데이터
- SK렌터카 (cmny_id = 153), 차량번호 223허3005 (K8):
  ```
  날짜           계기판(시작) → (종료)    주행거리   업무용  비고
  2025-11-20    30114 → 30115          1km       1km   
  2025-11-25    30115 → 30152         37km      37km   
  2025-11-26    30152 → 30262        110km     110km   
  2025-11-27    30262 → 30282         20km       0km   개인용
  2025-11-28    30282 → 30341         59km      59km   
  ---------------------------------------------------------------
  합계                                227km     207km
  업무용 사용비율: 91.2% (207/227)
  ```
- **비고(note) 필드 규칙:**
  - '개인용'일 경우만 입력됨
  - '개인용'으로 입력시 출퇴근용거리, 업무용거리는 0으로 입력
  - 나머지는 NULL (빈값)
- 다른 고객사들의 11월 데이터도 포함:
  - SK하이닉스 (67하8901, K5)
  - 주식회사 락앤락 (11허3456, 그랜저)
  - SK텔레콤 (55가7890, G90)
  - 다인정공 (99마1234, 스타렉스)

#### `016_utilization_vehicle_add_mileage.sql`
- utilization_vehicle 테이블의 모든 레코드에 주행거리 데이터 추가
- 11월 데이터는 driving_logs와 일치하도록 설정

## 테이블 구조

### driving_logs 테이블

```sql
CREATE TABLE public.driving_logs (
  log_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL,
  year_month CHAR(6) NOT NULL,
  vehicle_no TEXT NOT NULL,
  vehicle_model TEXT,
  log_date DATE NOT NULL,
  department TEXT,
  driver_name TEXT,
  odometer_start NUMERIC(10,2) NOT NULL DEFAULT 0,
  odometer_end NUMERIC(10,2) NOT NULL DEFAULT 0,
  distance_km NUMERIC(10,2) GENERATED ALWAYS AS (odometer_end - odometer_start) STORED,
  commute_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  business_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### driving_logs_monthly_summary 뷰

월별 요약 정보를 자동으로 계산하는 뷰:
- 과세기간 (period_start, period_end)
- 총 주행거리 (total_distance_km)
- 출퇴근용 거리 (total_commute_km)
- 업무용 거리 (total_business_km)
- **업무용 사용거리 (total_work_usage_km)**: 출퇴근용 + 업무용 거리의 합계
- **업무용 사용비율 (business_usage_pct)**: (출퇴근용 + 업무용) / 총주행거리 × 100

## 사용 방법

### 1. 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 SQL Editor에서 순서대로 실행:
# 1. 018_driving_logs_update.sql
# 2. 019_add_mileage_to_utilization_vehicle.sql
```

### 2. 샘플 데이터 삽입

```bash
# SQL Editor에서 순서대로 실행:
# 1. 015_driving_logs_new_data.sql
# 2. 016_utilization_vehicle_add_mileage.sql
```

### 3. 데이터 조회

#### 월별 요약 조회

```sql
SELECT 
  cmny_nm as "고객사명",
  vehicle_no as "차량번호",
  vehicle_model as "차종",
  period_start as "기간(시작)",
  period_end as "기간(종료)",
  total_distance_km as "총주행거리(km)",
  total_commute_km as "출퇴근용거리(km)",
  total_business_km as "업무용거리(km)",
  total_work_usage_km as "업무용사용거리(km)",
  business_usage_pct as "업무용사용비율(%)"
FROM driving_logs_monthly_summary
WHERE year_month = '202511'
  AND cmny_id = 153
ORDER BY total_distance_km DESC;
```

#### 일별 상세 조회

```sql
SELECT 
  log_date as "사용일자",
  department as "부서명",
  driver_name as "성명",
  odometer_start as "주행전 계기판의 거리",
  odometer_end as "주행 후 계기판의 거리",
  distance_km as "주행거리(km)",
  commute_km as "출퇴근용(km)",
  business_km as "업무용(km)",
  COALESCE(note, '') as "비고"
FROM driving_logs
WHERE cmny_id = 153 
  AND year_month = '202511'
  AND vehicle_no = '223허3005'
ORDER BY log_date;
```

#### 주행거리가 가장 긴 차량 찾기

```sql
SELECT * FROM get_top_mileage_vehicle(153, '202511');
```

## UI 구성 가이드

첨부 이미지를 참조하여 다음과 같이 구성:

### 헤더 정보
- **과세기간**: `2025-11-01 ~ 2025-11-30` (year_month로부터 생성)
- **상호명**: 선택한 고객사명 (companies.cmny_nm)
- **사업자등록번호**: 선택한 고객사의 사업자번호 (companies.biz_no)
- **차종/차량번호**: 주행거리가 가장 긴 차량 (get_top_mileage_vehicle 함수 사용)

### 테이블 구성
| 사용일자(요일) | 부서명 | 성명 | 주행 전 계기판의 거리 | 주행 후 계기판의 거리 | 주행거리(km) | 출퇴근용(km) | 업무용(km) | 비고 |
|--------------|--------|------|---------------------|---------------------|-------------|-------------|-----------|-----|
| 데이터...    |        |      |                     |                     |             |             |           |     |

### 합계 표시
- **과세기간 총주행 거리(km)**: `total_distance_km`
- **과세기간 업무용 사용거리**: `total_work_usage_km` (출퇴근용 + 업무용)
- **업무용 사용비율**: `business_usage_pct` (소수점 1자리)

### 비고(note) 필드 규칙
- **'개인용'일 경우만 입력**
  - 개인용으로 입력시: `commute_km = 0`, `business_km = 0`
  - 해당 주행은 업무용 사용거리에 포함되지 않음
- **일반 업무용**: `note = NULL` (빈값)

## 데이터 정합성

- `distance_km`는 자동 계산 컬럼 (GENERATED ALWAYS AS): `odometer_end - odometer_start`
- `total_work_usage_km`는 뷰에서 자동 계산: `total_commute_km + total_business_km`
- `business_usage_pct`는 뷰에서 자동 계산: `(출퇴근용 + 업무용) / 총주행거리 × 100`
- 주행거리는 계기판 거리 차이로 정확히 계산됨
- 업무용 사용비율은 소수점 1자리까지 ROUND 처리
- 개인용 주행은 업무용 사용거리 계산에서 제외됨 (commute_km=0, business_km=0)

## 참고사항

- RLS(Row Level Security) 정책 적용됨
- 승인된 사용자만 조회 가능
- Admin만 생성/수정/삭제 가능
- updated_at 자동 업데이트 트리거 적용

