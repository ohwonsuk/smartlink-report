# 정비현황 (Maintenance Records) 설정

## 개요

첨부 이미지를 참조하여 정비현황 테이블 구조와 샘플 데이터를 생성했습니다.

## 생성된 파일

### 1. 마이그레이션 파일

#### `021_maintenance_records_update.sql`
- 기존 테이블을 삭제하고 정비현황 형식으로 재구성
- 주요 컬럼:

**차량 정보**
- `vehicle_no`: 차량번호
- `vehicle_model`: 모델 (차종)
- `mileage_km`: 주행거리 (km)

**정비 정보**
- `maintenance_type`: 구분 (정비 유형: 기타정비, 정기점검, 긴급정비 등)
- `check_in_date`: 입고일자
- `check_out_date`: 출고일자

**정비 상세**
- `service_product`: 정비상품 (예: 스마트프리미엄(겨울), 표준정비상품 등)
- `service_center`: 정비소명 (정비소 이름)
- `status`: 완료상태 (완료, 진행중, 예정, 취소)

**선택 필드**
- `cost`: 비용 (원)
- `description`: 정비 내용 상세

### 2. 뷰

#### `maintenance_records_top20`
- 고객사별 년월별 입고일자 기준 최신 20건 조회 뷰
- 이미지에 표시된 "[MAX] 20대 차량 정보 출력" 요구사항 반영

### 3. 샘플 데이터 파일

#### `018_maintenance_records_new_data.sql`
- 첨부 이미지 데이터를 정확히 반영한 샘플 데이터
- SK렌터카 (cmny_id = 153) Top 10 데이터 (이미지 기준):

| 구분 | 차량번호 | 모델 | 주행거리 | 입고일자 | 출고일자 | 정비상품 | 정비소명 | 완료상태 |
|------|----------|------|----------|----------|----------|----------|----------|----------|
| 기타정비 | 192허9352 | 카니발 | 53,639 | 2025-11-25 | 2025-11-23 | - | 온하정비 | 완료 |
| 기타정비 | 223허3008 | K8 | 6,748 | 2025-11-23 | 2025-11-25 | 스마트프리미엄(겨울) | CLS타이어(화성) | 완료 |
| 기타정비 | 305러7602 | 그랜저 | 5,320 | 2025-11-18 | 2025-11-18 | 표준정비상품 | CLS타이어(화성) | 완료 |
| 기타정비 | 190허6895 | 이퀴녹스 | 16,344 | 2025-11-10 | 2025-11-10 | - | CLS타이어(화성) | 완료 |
| 기타정비 | 191허6079 | QM6 | 44,945 | 2025-11-28 | 2025-11-28 | - | 서부점 | 완료 |
| 기타정비 | 230호7178 | 쏘나타 | 4,725 | 2025-11-26 | 2025-11-26 | 스마트프리미엄(분기) | (정비)가성점포 | 완료 |
| 기타정비 | 34하9576 | 레이 | 21,983 | 2025-11-18 | 2025-11-26 | 표준정비상품 | (정비)가성점포 | 완료 |
| 기타정비 | 34하9727 | 레이 | 8,774 | 2025-11-18 | 2025-11-27 | 표준정비상품 | (정비)가성점포 | 완료 |
| 기타정비 | 223허3008 | K8 | 11,319 | 2025-11-27 | 2025-11-28 | 스마트프리미엄(겨울) | 고일 | 완료 |

- 5개 고객사 × 각 6~20건의 정비 기록 샘플 데이터 포함

## 테이블 구조

### maintenance_records 테이블

```sql
CREATE TABLE public.maintenance_records (
  maintenance_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL,
  year_month CHAR(6) NOT NULL,
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL,
  vehicle_model TEXT,
  mileage_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- 정비 정보
  maintenance_type TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  
  -- 정비 상세
  service_product TEXT,
  service_center TEXT,
  status TEXT NOT NULL DEFAULT '완료',
  
  -- 선택 필드
  cost INTEGER DEFAULT 0,
  description TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### maintenance_records_top20 뷰

고객사별 년월별 입고일자 기준 최신 20건을 자동으로 조회하는 뷰

## 사용 방법

### 1. 마이그레이션 실행

```bash
# Supabase CLI 사용
supabase db push

# 또는 SQL Editor에서 실행:
# 021_maintenance_records_update.sql
```

### 2. 샘플 데이터 삽입

```bash
# SQL Editor에서 실행:
# 018_maintenance_records_new_data.sql
```

### 3. 데이터 조회

#### 고객사별 정비현황 조회 (입고일자 순)

```sql
SELECT 
  maintenance_type as "구분",
  vehicle_no as "차량번호",
  vehicle_model as "모델",
  mileage_km as "주행거리",
  check_in_date as "입고일자",
  check_out_date as "출고일자",
  COALESCE(service_product, '') as "정비상품",
  service_center as "정비소명",
  status as "완료상태",
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as "등록일",
  TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as "수정일"
FROM maintenance_records
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY check_in_date DESC;
```

#### Top 20 정비기록 조회 (뷰 사용)

```sql
SELECT 
  maintenance_type as "구분",
  vehicle_no as "차량번호",
  vehicle_model as "모델",
  mileage_km as "주행거리",
  check_in_date as "입고일자",
  check_out_date as "출고일자",
  service_product as "정비상품",
  service_center as "정비소명",
  status as "완료상태",
  rank as "순위"
FROM maintenance_records_top20
WHERE cmny_id = 153 
  AND year_month = '202511'
  AND rank <= 20
ORDER BY rank;
```

#### 진행중인 정비 조회

```sql
SELECT 
  maintenance_type as "구분",
  vehicle_no as "차량번호",
  vehicle_model as "모델",
  check_in_date as "입고일자",
  service_center as "정비소명",
  status as "완료상태"
FROM maintenance_records
WHERE cmny_id = 153 
  AND year_month = '202511'
  AND status = '진행중'
ORDER BY check_in_date DESC;
```

#### 정비소별 정비 건수

```sql
SELECT 
  service_center as "정비소명",
  COUNT(*) as "정비건수",
  COUNT(CASE WHEN status = '완료' THEN 1 END) as "완료건수",
  COUNT(CASE WHEN status = '진행중' THEN 1 END) as "진행중건수"
FROM maintenance_records
WHERE cmny_id = 153 
  AND year_month = '202511'
GROUP BY service_center
ORDER BY COUNT(*) DESC;
```

## UI 구성 가이드

첨부 이미지를 참조하여 다음과 같이 구성:

### 테이블 구성

| No | 구분 | 차량번호 | 모델 | 주행거리 | 입고일자 | 출고일자 | 정비상품 | 정비소명 | 완료상태 | 등록/수정일 |
|----|------|----------|------|----------|----------|----------|----------|----------|----------|-------------|

### 정비 구분 (maintenance_type)
- **기타정비**: 일반 정비 및 부품 교체
- **정기점검**: 정기 점검 및 관리
- **긴급정비**: 긴급 수리 및 고장 처리

### 정비상품 (service_product)
- 스마트프리미엄(겨울)
- 스마트프리미엄(분기)
- 표준정비상품
- 정기점검(3만km), 정기점검(5만km) 등
- NULL 가능 (정비상품이 없는 경우)

### 정비소명 (service_center)
- CLS타이어(화성)
- 온하정비
- 서부점
- (정비)가성점포
- 고일
- 현대서비스센터, 기아서비스센터 등

### 완료상태 (status)
- **완료**: 정비 완료
- **진행중**: 정비 진행중
- **예정**: 정비 예정
- **취소**: 정비 취소

### 표시 옵션
- **[MAX] 20대 차량 정보 출력**: Top 20 정비기록만 표시 (입고일자 기준)
- 등록/수정일 형식: `YYYY-MM-DD HH24:MI / YYYY-MM-DD HH24:MI`

## 데이터 특징

### 입고일자 vs 출고일자
- **입고일자**: 차량이 정비소에 입고된 날짜 (필수)
- **출고일자**: 정비 완료 후 출고된 날짜 (선택)
- 당일 정비의 경우 입고/출고일자가 동일
- 장기 정비의 경우 출고일자가 입고일자보다 늦음

### 정비상품
- 일부 정비는 정비상품이 없을 수 있음 (NULL)
- 정비상품은 패키지 형태나 정비 항목명

### 정비소명
- 실제 정비를 수행한 정비소 이름
- 타이어 전문점, 서비스센터, 정비점 등 다양

### 완료상태
- 대부분 "완료" 상태
- 일부 "진행중" 상태 (현재 정비 중)

## 참고사항

- RLS(Row Level Security) 정책 적용됨
- 승인된 사용자만 조회 가능
- Admin만 생성/수정/삭제 가능
- updated_at 자동 업데이트 트리거 적용
- 입고일자 기준으로 정렬 (최신순)
- Top 20 뷰를 통해 최신 20건만 효율적으로 조회 가능

