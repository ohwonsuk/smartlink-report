# 데이터 구조 및 관리 가이드

## 📊 데이터 분리 구조

### 1. CSV 업로드 데이터

#### `utilization_vehicle` - 차량별 가동률
**용도**: CSV 파일 업로드로 관리

**필드**:
- `cmny_id`: 고객사 ID
- `year_month`: 년월 (YYYYMM)
- `vehicle_no`: 차량번호
- `vehicle_model`: 차종
- `driving_minutes`: 주행시간(분)
- `utilization_pct`: 가동률(%)

**샘플 데이터**: `supabase/seed/013_utilization_vehicle_csv_sample.sql`

**CSV 업로드 형식**:
```csv
cmny_id,year_month,vehicle_no,vehicle_model,driving_minutes,utilization_pct
153,202511,223허3005,K8,2190,27
153,202511,23누7436,아이오닉 6,1620,25
```

---

#### `monthly_mileage` - 총 월 주행거리
**용도**: CSV 파일 업로드로 관리

**필드**:
- `cmny_id`: 고객사 ID
- `year_month`: 년월 (YYYYMM)
- `vehicle_no`: 차량번호
- `vehicle_model`: 차종
- `monthly_trip_count`: 월 운행건수
- `monthly_driving_days`: 월 운행일수
- `monthly_total_mileage_km`: 월 누적주행거리(km)

**샘플 데이터**: `supabase/seed/014_monthly_mileage_data.sql`

**CSV 업로드 형식**:
```csv
cmny_id,year_month,vehicle_no,vehicle_model,monthly_trip_count,monthly_driving_days,monthly_total_mileage_km
153,202511,223허3005,K8,47,21,295.4
```

---

### 2. 별도 관리 데이터

#### `driving_logs` - 업무용승용차 운행기록부
**용도**: 별도 입력 또는 CSV 업로드

**필드**:
- `cmny_id`: 고객사 ID
- `year_month`: 년월 (YYYYMM)
- `vehicle_no`: 차량번호
- `vehicle_model`: 차종
- `log_date`: 사용일자
- `department`: 부서명
- `driver_name`: 운전자명
- `odometer_start`: 주행 전 계기판 거리
- `odometer_end`: 주행 후 계기판 거리
- `distance_km`: 주행거리 (자동 계산)
- `commute_km`: 출퇴근용 거리
- `business_km`: 업무용 거리
- `note`: 비고 (예: 개인용)

**샘플 데이터**: `supabase/seed/015_driving_logs_new_data.sql`

**자동 뷰**: `driving_logs_monthly_summary` (월별 집계)

---

## 🔄 데이터 흐름

### 상세 리포트 페이지 (`/app/report/view/page.tsx`)

```typescript
// 1. 차량별 가동률 - utilization_vehicle (CSV 업로드)
const { data: utilizationVehiclesData } = await supabase
  .from('utilization_vehicle')
  .select('*')
  .eq('cmny_id', cmnyId)
  .eq('year_month', currentYearMonth)
  .order('utilization_pct', { ascending: false });

// 2. 총 월 주행거리 - monthly_mileage (CSV 업로드)
const { data: monthlyMileagesData } = await supabase
  .from('monthly_mileage')
  .select('*')
  .eq('cmny_id', cmnyId)
  .eq('year_month', currentYearMonth)
  .order('monthly_total_mileage_km', { ascending: false })
  .limit(20);

// 3. 업무용승용차 운행기록부 - driving_logs (별도 관리)
// driving_logs가 있는 차량 중 주행거리가 가장 긴 차량 선택
const { data: topVehicle } = await supabase
  .from('driving_logs_monthly_summary')  // 뷰 사용!
  .select('vehicle_no, vehicle_model, total_distance_km')
  .eq('cmny_id', cmnyId)
  .eq('year_month', currentYearMonth)
  .order('total_distance_km', { ascending: false })
  .limit(1)
  .single();
```

---

## 📋 마이그레이션 순서

1. `008_utilization_vehicle_table.sql` - utilization_vehicle 테이블 생성
2. `019_add_mileage_to_utilization_vehicle.sql` - vehicle_model 컬럼 추가
3. `017_monthly_mileage_table.sql` - monthly_mileage 테이블 생성
4. `018_driving_logs_update.sql` - driving_logs 테이블 업데이트

---

## 🗃️ 샘플 데이터 순서

1. `001_test_companies.sql` - 고객사 정보
2. `005_monthly_summary_update.sql` - 월간 요약
3. `013_utilization_vehicle_csv_sample.sql` - 차량별 가동률 ✅ (CSV 업로드용)
4. `014_monthly_mileage_data.sql` - 총 월 주행거리 ✅ (CSV 업로드용)
5. `015_driving_logs_new_data.sql` - 운행기록부 ✅ (별도 관리)
6. `017_safety_scores_driver_data.sql` - 안전점수
7. `018_maintenance_records_new_data.sql` - 정비현황
8. `019_accidents_new_data.sql` - 사고내역
9. `020_violations_new_data.sql` - 범칙금

---

## ⚠️ 주의사항

### ❌ 사용하지 않는 파일

- ~~`016_utilization_vehicle_add_mileage.sql`~~ → `mileage_km` 컬럼 추가 시도 (삭제됨)
- ~~`013_utilization_vehicle_with_model.sql`~~ → 이전 버전 (백업됨)

### ✅ 데이터 독립성

- `utilization_vehicle`: CSV 업로드 → 가동률 리포트
- `monthly_mileage`: CSV 업로드 → 총 월 주행거리 리포트
- `driving_logs`: 별도 관리 → 업무용승용차 운행기록부

**각 데이터는 독립적으로 관리되며, 서로 영향을 주지 않습니다.**

---

## 🚀 실행 방법

### 1단계: 마이그레이션 실행

```sql
-- Supabase SQL Editor에서 순서대로 실행
1. 008_utilization_vehicle_table.sql
2. 019_add_mileage_to_utilization_vehicle.sql (vehicle_model 추가)
3. 017_monthly_mileage_table.sql
4. 018_driving_logs_update.sql
```

### 2단계: 샘플 데이터 입력

```sql
-- Supabase SQL Editor에서 순서대로 실행
1. 001_test_companies.sql
2. 005_monthly_summary_update.sql
3. 013_utilization_vehicle_csv_sample.sql
4. 014_monthly_mileage_data.sql
5. 015_driving_logs_new_data.sql
6. 017_safety_scores_driver_data.sql
7. 018_maintenance_records_new_data.sql
8. 019_accidents_new_data.sql
9. 020_violations_new_data.sql
```

### 3단계: 확인

```sql
-- 1. utilization_vehicle 확인 (차량별 가동률)
SELECT * FROM utilization_vehicle 
WHERE cmny_id = 153 AND year_month = '202511'
ORDER BY utilization_pct DESC;

-- 2. monthly_mileage 확인 (총 월 주행거리)
SELECT * FROM monthly_mileage 
WHERE cmny_id = 153 AND year_month = '202511'
ORDER BY monthly_total_mileage_km DESC;

-- 3. driving_logs 확인 (운행기록부)
SELECT * FROM driving_logs 
WHERE cmny_id = 153 AND year_month = '202511' AND vehicle_no = '223허3005'
ORDER BY log_date;

-- 4. driving_logs_monthly_summary 확인 (월별 집계 뷰)
SELECT * FROM driving_logs_monthly_summary
WHERE cmny_id = 153 AND year_month = '202511';
```

---

## 📊 예상 결과

SK렌터카 (cmny_id = 153) 2025년 11월:

✅ **차량별 가동률**: 15대
- 223허3005 (K8): 27%, 2190분
- 23누7436 (아이오닉 6): 25%, 1620분

✅ **총 월 주행거리**: 15대
- 223허5990 (K8): 314.5km, 54건
- 223허5988 (K8): 312.5km, 52건

✅ **업무용승용차 운행기록부**: 223허3005 (K8)
- 5일 운행 (2025-11-20, 25, 26, 27, 28)
- 총 주행거리: 227km
- 업무용 사용거리: 207km
- 업무용 사용비율: 91.2%

---

## 🔧 트러블슈팅

### 문제: "column mileage_km does not exist"

**원인**: `utilization_vehicle`에 `mileage_km` 컬럼을 추가하려고 시도

**해결**: `016_utilization_vehicle_add_mileage.sql` 파일 사용 안 함 (백업됨)

### 문제: 운행기록부가 표시되지 않음

**원인**: `utilization_vehicle`에서 차량 선택 시 `driving_logs` 데이터 없음

**해결**: `driving_logs_monthly_summary` 뷰에서 차량 선택하도록 페이지 로직 수정 완료 ✅

---

## 📞 문의

데이터 구조 관련 문의사항은 `DATA_STRUCTURE_GUIDE.md` 참조

