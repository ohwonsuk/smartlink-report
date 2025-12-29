# 벌칙금 (Violations) 설정

## 개요

첨부 이미지를 참조하여 벌칙금 테이블 구조와 샘플 데이터를 생성했습니다.

## 생성된 파일

### 1. 마이그레이션 파일

#### `023_violations_update.sql`
- 기존 테이블을 삭제하고 벌칙금 형식으로 재구성
- 주요 컬럼:

**인적 정보 (마스킹 대상)**
- `department`: 소속 (부서명) - UI에서 *** 마스킹 필요
- `driver_name`: 운전자명 - UI에서 *** 마스킹 필요

**차량 정보**
- `vehicle_no`: 차량번호

**위반 정보**
- `violation_datetime`: 위반일시
- `notice_type`: 고지서유형 (위반사실통지서, 과태료납부통지서 등)
- `fine_amount`: 벌칙금 (과태료+과징금 기준)

**상세 정보**
- `detail_info`: 세부내용 (예: [SK렌터카] 주정차위반 과태료)
- `authority`: 관할관청
- `violation_location`: 위반장소

**납부 정보**
- `payment_due_date`: 납부기한
- `is_transferred`: 이관여부 (Boolean)
- `transfer_date`: 이관일
- `is_paid`: 납부여부 (Boolean)
- `payment_date`: 납부일

**추가 정보**
- `penalty_points`: 벌점
- `violation_type`: 위반 유형 (속도위반, 신호위반, 주정차위반, 미납통행료 등)
- `description`: 비고

### 2. 뷰

#### `violations_summary`
- 고객사별 년월별 벌칙금 조회 뷰
- 위반일시 기준 순위 포함

### 3. 샘플 데이터 파일

#### `020_violations_new_data.sql`
- 첨부 이미지 데이터를 정확히 반영한 샘플 데이터
- SK렌터카 (cmny_id = 153) 주요 데이터 (이미지 기준 6건):

| 소속 | 운전자명 | 차량번호 | 위반일시 | 고지서유형 | 벌칙금 | 세부내용 | 관할관청 | 위반장소 | 납부기한 | 이관여부 | 납부여부 |
|------|----------|----------|----------|------------|--------|----------|----------|----------|----------|----------|----------|
| **** | *** | 190허5374 | 2025-11-19 15:20 | 위반사실통지서 | 32,000 | [SK렌터카] 주정차위반 과태료 | 부산광역시 해운대구 | 슈노벨오피스텔삼거리 | 2025-12-12 | N | N |
| **** | *** | 191허2184 | 2025-11-24 16:46 | 위반사실통지서 | 32,000 | [SK렌터카] 주정차위반 과태료 | 경기도 김포시 | 고촌읍 한양수자인 후문 | 2025-12-22 | N | N |
| **** | *** | 191허6256 | 2025-11-24 13:55 | 위반사실통지서 | 32,000 | [SK렌터카] 1속도위반 (20km/H이하) | 신안경찰서 | 인천광역시 중구 하늘로 (운서동) 인근 | 2026-01-01 | N | N |
| **** | *** | 191허9957 | 2025-11-07 07:21 | 위반사실통지서 | 2,700 | [SK렌터카] 미납통행료 | 서울터널(신월여의지하도로) | 서울터널 | - | N | N |
| **** | *** | 191허9957 | 2025-11-14 15:13 | 위반사실통지서 | 900 | [SK렌터카] 미납통행료 | 한국도로공사 | 덕소삼패 | - | N | N |
| **** | *** | 191허9957 | 2025-11-14 15:09 | 위반사실통지서 | 900 | [SK렌터카] 미납통행료 | 한국도로공사 | 덕소삼패 | - | N | N |

**합계: 100,500원**

- 5개 고객사 × 각 2~10건의 벌칙금 기록 샘플 데이터 포함

## 테이블 구조

### violations 테이블

```sql
CREATE TABLE public.violations (
  violation_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL,
  year_month CHAR(6) NOT NULL,
  
  -- 인적 정보 (마스킹 대상)
  department TEXT,
  driver_name TEXT NOT NULL,
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL,
  
  -- 위반 정보
  violation_datetime TIMESTAMPTZ NOT NULL,
  notice_type TEXT NOT NULL,
  fine_amount INTEGER NOT NULL DEFAULT 0,
  
  -- 상세 정보
  detail_info TEXT,
  authority TEXT,
  violation_location TEXT,
  
  -- 납부 정보
  payment_due_date DATE,
  is_transferred BOOLEAN DEFAULT FALSE,
  transfer_date DATE,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_date DATE,
  
  -- 추가 정보
  penalty_points INTEGER DEFAULT 0,
  violation_type TEXT,
  description TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### violations_summary 뷰

고객사별 년월별 벌칙금을 자동으로 조회하는 뷰 (순위 포함)

## 사용 방법

### 1. 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 SQL Editor에서 실행:
# 023_violations_update.sql
```

### 2. 샘플 데이터 삽입

```bash
# SQL Editor에서 실행:
# 020_violations_new_data.sql
```

### 3. 데이터 조회

#### 고객사별 벌칙금 조회 (위반일시 순)

```sql
SELECT 
  department as "소속",
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  TO_CHAR(violation_datetime, 'YYYY-MM-DD HH24:MI') as "위반일시",
  notice_type as "고지서유형",
  fine_amount as "벌칙금",
  COALESCE(detail_info, '') as "세부내용",
  authority as "관할관청",
  COALESCE(violation_location, '') as "위반장소",
  TO_CHAR(payment_due_date, 'YYYY-MM-DD') as "납부기한",
  CASE WHEN is_transferred THEN 'Y' ELSE 'N' END as "이관여부",
  COALESCE(TO_CHAR(transfer_date, 'YYYY-MM-DD'), '') as "이관일",
  CASE WHEN is_paid THEN 'Y' ELSE 'N' END as "납부여부",
  COALESCE(TO_CHAR(payment_date, 'YYYY-MM-DD'), '') as "납부일"
FROM violations
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY violation_datetime DESC;
```

#### 벌칙금 합계 조회

```sql
SELECT 
  COUNT(*) as "총건수",
  SUM(fine_amount) as "벌칙금합계",
  SUM(CASE WHEN is_paid THEN fine_amount ELSE 0 END) as "납부금액",
  SUM(CASE WHEN NOT is_paid THEN fine_amount ELSE 0 END) as "미납금액",
  COUNT(CASE WHEN is_paid THEN 1 END) as "납부건수",
  COUNT(CASE WHEN NOT is_paid THEN 1 END) as "미납건수"
FROM violations
WHERE cmny_id = 153 
  AND year_month = '202511';
```

#### 미납 벌칙금 조회

```sql
SELECT 
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  TO_CHAR(violation_datetime, 'YYYY-MM-DD HH24:MI') as "위반일시",
  notice_type as "고지서유형",
  fine_amount as "벌칙금",
  violation_type as "위반유형",
  TO_CHAR(payment_due_date, 'YYYY-MM-DD') as "납부기한"
FROM violations
WHERE cmny_id = 153 
  AND year_month = '202511'
  AND is_paid = FALSE
ORDER BY payment_due_date;
```

#### 위반유형별 통계

```sql
SELECT 
  violation_type as "위반유형",
  COUNT(*) as "건수",
  SUM(fine_amount) as "총벌칙금",
  AVG(fine_amount) as "평균벌칙금",
  SUM(penalty_points) as "총벌점"
FROM violations
WHERE cmny_id = 153 
  AND year_month = '202511'
GROUP BY violation_type
ORDER BY COUNT(*) DESC;
```

## UI 구성 가이드

첨부 이미지를 참조하여 다음과 같이 구성:

### 테이블 구성

| No | 소속 | 운전자명 | 차량번호 | 위반일시 | 고지서유형 | 벌칙금 | 세부내용 | 관할관청 | 위반장소 | 납부기한 | 이관여부 | 이관일 | 납부여부 | 납부일 |
|----|------|----------|----------|----------|------------|--------|----------|----------|----------|----------|----------|--------|----------|--------|

### 마스킹 처리 필수
- **소속 (department)**: **** 형태로 마스킹
- **운전자명 (driver_name)**: *** 형태로 마스킹

### 고지서유형 (notice_type)
- **위반사실통지서**: 위반 사실을 통지하는 고지서
- **과태료납부통지서**: 과태료 납부를 통지하는 고지서

### 벌칙금 (fine_amount)
- 과태료 + 과징금 기준
- 금액 단위: 원
- 합계 표시 필요

### 세부내용 (detail_info)
- 형식: [SK렌터카] 위반유형 과태료
- 예시:
  - [SK렌터카] 주정차위반 과태료
  - [SK렌터카] 1속도위반 (20km/H이하)
  - [SK렌터카] 미납통행료

### 관할관청 (authority)
- 위반을 관할하는 기관
- 예시:
  - 부산광역시 해운대구
  - 경기도 김포시
  - 신안경찰서
  - 서울터널(신월여의지하도로)
  - 한국도로공사

### 위반장소 (violation_location)
- 구체적인 위반 장소
- NULL 가능

### 납부기한 (payment_due_date)
- 벌칙금 납부 기한
- NULL 가능 (미납통행료 등)

### 이관여부 / 이관일
- 이관여부: Y/N (Boolean)
- 이관일: 날짜 또는 빈값

### 납부여부 / 납부일
- 납부여부: Y/N (Boolean)
- 납부일: 날짜 또는 빈값

### 위반유형별 분류
- **주정차위반**: 불법 주정차
- **속도위반**: 제한속도 초과
  - 20km/H 이하: 32,000원
  - 20km/H 초과: 60,000~80,000원
  - 40km/H 초과: 100,000원
- **신호위반**: 신호등 위반
- **미납통행료**: 통행료 미납

## 데이터 특징

### 벌칙금 = 과태료 + 과징금
- 이미지 하단 설명 참조
- 벌칙금은 과태료와 과징금을 합산한 금액

### 미납통행료 특징
- 납부기한 없음 (NULL)
- 금액이 작음 (900원, 2,700원 등)
- 고지서유형: 위반사실통지서

### 납부상태 관리
- 미납 (is_paid = FALSE): 납부일 없음
- 납부완료 (is_paid = TRUE): 납부일 있음

### 이관 처리
- 이관여부 (is_transferred): 다른 기관으로 이관 여부
- 대부분 이관 없음 (FALSE)

## 참고사항

- RLS(Row Level Security) 정책 적용됨
- 승인된 사용자만 조회 가능
- Admin만 생성/수정/삭제 가능
- updated_at 자동 업데이트 트리거 적용
- 소속, 운전자명은 개인정보이므로 UI에서 마스킹 처리 필수
- 위반일시 기준으로 정렬 (최신순)
- 벌칙금 합계 표시 필요
- 미납 벌칙금 별도 관리 필요
- 납부기한 임박 알림 기능 구현 권장

