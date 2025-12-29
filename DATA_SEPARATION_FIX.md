# 데이터 분리 및 CSV 업로드 구조 수정

## 🔍 문제 원인

**SQL 실행 오류**: `ERROR: column "mileage_km" does not exist`

`utilization_vehicle` 테이블에 `mileage_km` 컬럼이 없는데, seed 파일에서 해당 컬럼을 업데이트하려고 시도하여 오류 발생.

**근본 원인**:

- `utilization_vehicle`은 CSV 업로드용 데이터
- `driving_logs`는 운행기록부용 데이터
- 두 데이터를 분리하지 않고 혼용하려 했음

---

## ✅ 해결 방안

### 데이터 분리 구조로 재설계

| 테이블                | 용도                    | 관리 방법  | 주요 필드                                                                              |
| --------------------- | ----------------------- | ---------- | -------------------------------------------------------------------------------------- |
| `utilization_vehicle` | 차량별 가동률           | CSV 업로드 | `vehicle_no`, `vehicle_model`, `driving_minutes`, `utilization_pct`                    |
| `monthly_mileage`     | 총 월 주행거리          | CSV 업로드 | `vehicle_no`, `monthly_trip_count`, `monthly_driving_days`, `monthly_total_mileage_km` |
| `driving_logs`        | 업무용승용차 운행기록부 | 별도 관리  | `log_date`, `odometer_start`, `odometer_end`, `commute_km`, `business_km`              |

---

## 📝 수정 내용

### 1. 마이그레이션 수정

#### `019_add_mileage_to_utilization_vehicle.sql`

```sql
-- 수정 전 (❌)
ALTER TABLE public.utilization_vehicle
ADD COLUMN IF NOT EXISTS mileage_km NUMERIC(10,2) DEFAULT 0;

-- 수정 후 (✅)
ALTER TABLE public.utilization_vehicle
ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
```

**변경 이유**: CSV 업로드시 차종 정보도 필요하므로 `vehicle_model` 컬럼만 추가

---

### 2. Seed 파일 재구성

#### 삭제/백업된 파일

- ~~`016_utilization_vehicle_add_mileage.sql`~~ → `mileage_km` 업데이트 시도 (백업됨)
- ~~`013_utilization_vehicle_with_model.sql`~~ → 이전 버전 (백업됨)

#### 새로 생성된 파일

✅ **`013_utilization_vehicle_csv_sample.sql`**

- CSV 업로드 형식으로 샘플 데이터 제공
- `mileage_km` 컬럼 사용 안 함
- 필드: `vehicle_no`, `vehicle_model`, `driving_minutes`, `utilization_pct`

✅ **`016_utilization_vehicle_note.sql`**

- 안내 문서 (실행 불필요)

---

### 3. 페이지 로직 개선 (이미 완료 ✅)

#### `app/report/view/page.tsx`

```typescript
// ✅ driving_logs가 있는 차량만 선택 (수정 완료)
const { data: topVehicle } = await supabase
  .from('driving_logs_monthly_summary') // 뷰 사용
  .select('vehicle_no, vehicle_model, total_distance_km')
  .eq('cmny_id', cmnyId)
  .eq('year_month', currentYearMonth)
  .order('total_distance_km', { ascending: false })
  .limit(1)
  .single();
```

**효과**:

- `utilization_vehicle`에서 선택 안 함 (mileage_km 불필요)
- `driving_logs_monthly_summary` 뷰에서 직접 선택
- 운행기록부 데이터가 있는 차량만 자동 선택

---

## 🚀 실행 방법

### 1단계: 마이그레이션 실행

```sql
-- Supabase SQL Editor에서 실행
-- 019_add_mileage_to_utilization_vehicle.sql (수정된 버전)

ALTER TABLE public.utilization_vehicle
ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
```

### 2단계: 샘플 데이터 입력

```sql
-- 013_utilization_vehicle_csv_sample.sql 전체 실행
-- (CSV 업로드 형식으로 데이터 입력)
```

### 3단계: 확인

```sql
-- 1. utilization_vehicle 확인 (vehicle_model 추가 확인)
SELECT * FROM utilization_vehicle
WHERE cmny_id = 153 AND year_month = '202511'
ORDER BY utilization_pct DESC;

-- 예상 결과: vehicle_model 컬럼 포함, mileage_km 컬럼 없음
-- 223허3005 | K8 | 2190 | 27

-- 2. driving_logs_monthly_summary 확인
SELECT * FROM driving_logs_monthly_summary
WHERE cmny_id = 153 AND year_month = '202511';

-- 예상 결과: 223허3005 차량, total_distance_km = 227
```

---

## 📊 데이터 독립성

### CSV 업로드 데이터 (독립)

1. **차량별 가동률** (`utilization_vehicle`)
   - 필드: `vehicle_no`, `vehicle_model`, `driving_minutes`, `utilization_pct`
   - 화면: ⚡ 차량별 가동률

2. **총 월 주행거리** (`monthly_mileage`)
   - 필드: `vehicle_no`, `monthly_trip_count`, `monthly_driving_days`, `monthly_total_mileage_km`
   - 화면: 📍 총 월 주행거리

### 별도 관리 데이터

3. **업무용승용차 운행기록부** (`driving_logs`)
   - 필드: `log_date`, `odometer_start`, `odometer_end`, `commute_km`, `business_km`
   - 화면: 📝 업무용승용차 운행기록부
   - 뷰: `driving_logs_monthly_summary` (자동 집계)

**각 데이터는 독립적으로 관리되며 서로 영향 없음** ✅

---

## 📋 최종 확인 사항

### ✅ 수정 완료

- [x] `019_add_mileage_to_utilization_vehicle.sql` - vehicle_model만 추가
- [x] `013_utilization_vehicle_csv_sample.sql` - CSV 형식 샘플 데이터
- [x] `016_utilization_vehicle_add_mileage.sql` - 백업 (사용 안 함)
- [x] `app/report/view/page.tsx` - driving_logs_monthly_summary 사용

### ✅ 예상 결과

SK렌터카 (cmny_id = 153) 2025년 11월:

1. **차량별 가동률**: 15대
   - 223허3005 (K8): 27%, 2190분 ✅

2. **총 월 주행거리**: 15대 (Top 20)
   - 223허5990 (K8): 314.5km ✅

3. **업무용승용차 운행기록부**: 223허3005
   - 5일 운행, 227km, 업무용 91.2% ✅

---

## 📖 상세 가이드

더 자세한 내용은 `DATA_STRUCTURE_GUIDE.md` 참조

---

## 🎉 완료!

CSV 업로드 데이터와 운행기록부 데이터가 완전히 분리되어 독립적으로 관리됩니다.
