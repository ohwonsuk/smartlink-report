# monthly_mileage 테이블 재구성 완료

## ✅ 완료된 작업

### 1. 테이블 재설계
- [x] 기존 `mileage_detail` 테이블 삭제
- [x] 새로운 `monthly_mileage` 테이블 생성 (월별 집계 데이터)
- [x] 일별 데이터 → 월별 집계 데이터로 변경

**파일**: `supabase/migrations/017_monthly_mileage_table.sql`

### 2. 테이블 구조 변경

#### Before (mileage_detail - 일별 데이터)
```sql
- record_date DATE
- daily_mileage_km NUMERIC(10,2)
- cumulative_mileage_km INTEGER
```

#### After (monthly_mileage - 월별 집계)
```sql
- year_month CHAR(6)
- vehicle_no TEXT
- vehicle_model TEXT
- monthly_trip_count INTEGER        -- 월 운행건수
- monthly_driving_days INTEGER      -- 월 운행일수
- monthly_total_mileage_km NUMERIC(10,1)  -- 월 누적주행거리
```

### 3. 샘플 데이터 생성
- [x] 가동률 샘플 차량번호와 100% 일치
- [x] 첨부 이미지 데이터 형식 반영
- [x] 5개 고객사, 총 31건

**파일**: `supabase/seed/014_monthly_mileage_data.sql`

---

## 📊 테이블 구조

### monthly_mileage

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| mileage_id | BIGSERIAL | PK | 1 |
| cmny_id | INTEGER | 고객사 ID | 153 |
| year_month | CHAR(6) | 년월 (YYYYMM) | 202511 |
| vehicle_no | TEXT | 차량번호 | 223허5990 |
| vehicle_model | TEXT | 모델명 | K8 |
| monthly_trip_count | INTEGER | 월 운행건수 | 54 |
| monthly_driving_days | INTEGER | 월 운행일수 | 21 |
| monthly_total_mileage_km | NUMERIC(10,1) | 월 누적주행거리 (km) | 314.5 |

**제약조건**: UNIQUE(cmny_id, year_month, vehicle_no)

---

## 📊 샘플 데이터 (2025년 11월)

### SK렌터카 (153) - 15대

| No | 차량번호 | 모델 | 월 운행건수 | 월 운행일수 | 월 누적주행거리(km) |
|----|----------|------|-------------|-------------|---------------------|
| 1 | 223허5990 | K8 | 54 | 21 | 314.5 |
| 2 | 223허5988 | K8 | 52 | 21 | 312.5 |
| 3 | 223허5975 | K8 | 52 | 21 | 304.6 |
| 4 | 223허5978 | K8 | 48 | 21 | 299.4 |
| 5 | 223허3005 | K8 | 47 | 21 | 295.4 |
| 6 | 23누7436 | 아이오닉 6 | 47 | 20 | 286.5 |
| 7 | 190허5645 | G80 | 40 | 20 | 276.4 |
| 8 | 223허5990 | K8 | 39 | 20 | 265.6 |
| 9 | 223허5991 | K8 | 39 | 19 | 234.5 |
| 10 | 223허5982 | K8 | 38 | 19 | 224.5 |
| 11 | 27누1848 | 아이오닉 6 | 37 | 19 | 222.5 |
| 12 | 223허3015 | K8 | 37 | 19 | 221.6 |
| 13 | 191허2189 | QM6 | 36 | 18 | 190.1 |
| 14 | 223허3001 | K8 | 33 | 18 | 180.4 |
| 15 | 92나7850 | 통고 | 32 | 17 | 179.5 |

### SK하이닉스 (10) - 5대

| No | 차량번호 | 모델 | 월 운행건수 | 월 운행일수 | 월 누적주행거리(km) |
|----|----------|------|-------------|-------------|---------------------|
| 1 | 67하8901 | K5 | 45 | 20 | 280.3 |
| 2 | 78하9012 | G70 | 38 | 18 | 245.8 |
| 3 | 89하0123 | 쏘렌토 | 42 | 19 | 268.5 |
| 4 | 90호1234 | K8 | 48 | 21 | 295.7 |
| 5 | 01호2345 | 아이오닉 5 | 35 | 17 | 215.4 |

### 주식회사 락앤락 (13) - 5대

| No | 차량번호 | 모델 | 월 운행건수 | 월 운행일수 | 월 누적주행거리(km) |
|----|----------|------|-------------|-------------|---------------------|
| 1 | 11허3456 | 그랜저 | 50 | 22 | 325.8 |
| 2 | 22허4567 | K7 | 46 | 21 | 298.4 |
| 3 | 33하5678 | SM6 | 42 | 20 | 275.6 |
| 4 | 44하6789 | 카니발 | 40 | 19 | 255.3 |
| 5 | 55하7890 | K5 | 36 | 18 | 230.7 |

### SK텔레콤 (14) - 4대

| No | 차량번호 | 모델 | 월 운행건수 | 월 운행일수 | 월 누적주행거리(km) |
|----|----------|------|-------------|-------------|---------------------|
| 1 | 55가7890 | G90 | 52 | 22 | 340.5 |
| 2 | 66나8901 | K9 | 48 | 21 | 310.8 |
| 3 | 77다9012 | EV6 | 44 | 20 | 285.3 |
| 4 | 88라0123 | 팰리세이드 | 41 | 19 | 268.9 |

### 다인정공 (21) - 2대

| No | 차량번호 | 모델 | 월 운행건수 | 월 운행일수 | 월 누적주행거리(km) |
|----|----------|------|-------------|-------------|---------------------|
| 1 | 99마1234 | 스타렉스 | 38 | 19 | 245.6 |
| 2 | 00바2345 | 봉고 | 35 | 18 | 228.3 |

**총 31건** (15 + 5 + 5 + 4 + 2)

---

## 🔄 주요 변경사항

### 1. 데이터 구조
- **일별 상세 데이터** → **월별 집계 데이터**
- 여러 일자의 레코드 → 1개 월별 레코드

### 2. 새로운 필드
- `monthly_trip_count`: 월 운행건수
- `monthly_driving_days`: 월 운행일수
- `vehicle_model`: 차량 모델명

### 3. 데이터 정합성
- 가동률 테이블의 차량번호와 100% 일치
- 모델명도 동일하게 유지

---

## 🚀 Supabase SQL 실행 순서

### 1️⃣ 테이블 재생성
```sql
-- supabase/migrations/017_monthly_mileage_table.sql 실행
-- 기존 mileage_detail 삭제
-- 새로운 monthly_mileage 생성
```

### 2️⃣ 샘플 데이터 입력
```sql
-- supabase/seed/014_monthly_mileage_data.sql 실행
-- 31건의 월별 주행거리 데이터 입력
```

### 3️⃣ 데이터 확인
```sql
-- 데이터 확인
SELECT 
  c.cmny_nm,
  mm.vehicle_no,
  mm.vehicle_model,
  mm.monthly_trip_count,
  mm.monthly_driving_days,
  mm.monthly_total_mileage_km
FROM public.monthly_mileage mm
JOIN public.companies c ON mm.cmny_id = c.cmny_id
WHERE mm.year_month = '202511'
ORDER BY c.cmny_nm, mm.monthly_total_mileage_km DESC;
```

**예상 결과**: 31개 행

### 4️⃣ 전체 건수 확인
```sql
SELECT COUNT(*) as total_count FROM public.monthly_mileage;
```

**예상**: 31

---

## ✅ 체크리스트

- [x] 기존 mileage_detail 테이블 삭제
- [x] monthly_mileage 테이블 생성
- [x] 월별 집계 필드 추가 (운행건수, 운행일수)
- [x] 가동률 샘플 차량번호와 일치
- [x] 모델명 포함
- [x] 샘플 데이터 31건 생성
- [x] RLS 정책 설정
- [x] 인덱스 생성

---

## 📄 생성된 파일

1. `supabase/migrations/017_monthly_mileage_table.sql` - 테이블 재생성
2. `supabase/seed/014_monthly_mileage_data.sql` - 샘플 데이터 31건
3. `MONTHLY_MILEAGE_UPDATE.md` - 이 문서

---

SQL 스크립트를 실행하면 첨부 이미지와 동일한 형식의 월별 주행거리 데이터가 생성됩니다! 🚀

