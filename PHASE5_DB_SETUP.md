# Phase 5: 데이터베이스 설정 가이드

## 📋 개요
Phase 5에서는 상세 페이지를 위한 7개 테이블을 생성하고 샘플 데이터를 입력합니다.

---

## 🗄️ 생성할 테이블 (7개)

1. **mileage_detail** - 차량별 주행거리 상세
2. **driving_logs** - 운행일지
3. **safety_scores** - 차량별 안전점수
4. **maintenance_records** - 정비 현황
5. **accidents** - 사고 내역 (마스킹 필요)
6. **violations** - 범칙금 (마스킹 필요)
7. **companies** - 고객사 정보 업데이트

---

## 🚀 Supabase SQL 실행 순서

### 1단계: 고객사 데이터 업데이트

```sql
-- 009_companies_update.sql 실행
-- 새로운 샘플 고객사 5개 입력
```

**예상 결과**: 5개 고객사 (153, 10, 13, 14, 21)

---

### 2단계: 새 테이블 생성 (6개)

다음 마이그레이션 파일을 순서대로 실행하세요:

```sql
-- 1. 010_mileage_detail_table.sql
-- 2. 011_driving_logs_table.sql
-- 3. 012_safety_scores_table.sql
-- 4. 013_maintenance_records_table.sql
-- 5. 014_accidents_table.sql
-- 6. 015_violations_table.sql
```

각 파일은 다음을 포함합니다:
- 테이블 생성
- 인덱스 생성
- RLS 활성화
- RLS 정책 설정 (승인된 사용자 조회, Admin 생성/수정/삭제)
- updated_at 트리거

---

### 3단계: 샘플 데이터 입력 (8개 파일)

다음 시드 파일을 순서대로 실행하세요:

```sql
-- 1. 005_monthly_summary_update.sql (요약 데이터 업데이트)
-- 2. 006_utilization_vehicle_update.sql (가동률 데이터 업데이트)
-- 3. 007_mileage_detail_data.sql (주행거리 20건)
-- 4. 008_driving_logs_data.sql (운행일지 20건)
-- 5. 009_safety_scores_data.sql (안전점수 20건)
-- 6. 010_maintenance_records_data.sql (정비 20건)
-- 7. 011_accidents_data.sql (사고 20건 - 마스킹 대상)
-- 8. 012_violations_data.sql (범칙금 20건 - 마스킹 대상)
```

---

## 📊 샘플 데이터 분포

### 고객사별 데이터 건수

| 고객사 | cmny_id | 건수 (각 테이블) |
|--------|---------|------------------|
| SK하이닉스 | 153 | 5건 |
| SK렌터카 | 10 | 5건 |
| 주식회사 락앤락 | 13 | 4건 |
| SK텔레콤 | 14 | 4건 |
| 다인정공 | 21 | 2건 |
| **합계** | - | **20건** |

---

## ✅ 데이터 확인 쿼리

### 1. 고객사 확인
```sql
SELECT cmny_id, cmny_nm, biz_no 
FROM public.companies 
ORDER BY cmny_id;
```
**예상**: 5개 행

### 2. 월간 요약 확인
```sql
SELECT c.cmny_nm, ms.year_month, ms.vehicle_count, ms.total_mileage_km
FROM public.monthly_summary ms
JOIN public.companies c ON ms.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, ms.year_month;
```
**예상**: 15개 행 (5개 고객사 × 3개월)

### 3. 가동률 Top 5 확인
```sql
SELECT c.cmny_nm, uv.vehicle_no, (uv.utilization_pct * 3) AS utilization_8h
FROM public.utilization_vehicle uv
JOIN public.companies c ON uv.cmny_id = c.cmny_id
WHERE uv.year_month = '202511'
ORDER BY c.cmny_nm, uv.utilization_pct DESC;
```
**예상**: 19개 행 (SK하이닉스 5 + SK렌터카 5 + 락앤락 4 + SK텔레콤 4 + 다인정공 2 = 20건 - 1건?)

### 4. 주행거리 상세 확인
```sql
SELECT COUNT(*) as total_count FROM public.mileage_detail;
```
**예상**: 20개 행

### 5. 운행일지 확인
```sql
SELECT COUNT(*) as total_count FROM public.driving_logs;
```
**예상**: 20개 행

### 6. 안전점수 확인
```sql
SELECT COUNT(*) as total_count FROM public.safety_scores;
```
**예상**: 20개 행

### 7. 정비 현황 확인
```sql
SELECT COUNT(*) as total_count FROM public.maintenance_records;
```
**예상**: 20개 행

### 8. 사고 내역 확인 (마스킹 테스트)
```sql
SELECT 
  c.cmny_nm,
  a.vehicle_no,
  a.driver_name, -- 마스킹 필요: 김철수 → 김*수
  a.department,  -- 마스킹 필요: 생산1팀 → 생산1*
  a.damage_cost
FROM public.accidents a
JOIN public.companies c ON a.cmny_id = c.cmny_id
ORDER BY a.accident_date DESC
LIMIT 10;
```
**예상**: 10개 행, 운전자명/부서명은 원본 (마스킹은 UI에서 처리)

### 9. 범칙금 확인 (마스킹 테스트)
```sql
SELECT 
  c.cmny_nm,
  v.vehicle_no,
  v.driver_name, -- 마스킹 필요
  v.department,  -- 마스킹 필요
  v.fine_amount,
  v.payment_status
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id
ORDER BY v.violation_date DESC
LIMIT 10;
```
**예상**: 10개 행

### 10. 전체 테이블 건수 확인
```sql
SELECT 
  (SELECT COUNT(*) FROM public.companies) AS companies_count,
  (SELECT COUNT(*) FROM public.monthly_summary) AS summary_count,
  (SELECT COUNT(*) FROM public.utilization_vehicle) AS utilization_count,
  (SELECT COUNT(*) FROM public.mileage_detail) AS mileage_count,
  (SELECT COUNT(*) FROM public.driving_logs) AS logs_count,
  (SELECT COUNT(*) FROM public.safety_scores) AS safety_count,
  (SELECT COUNT(*) FROM public.maintenance_records) AS maintenance_count,
  (SELECT COUNT(*) FROM public.accidents) AS accidents_count,
  (SELECT COUNT(*) FROM public.violations) AS violations_count;
```

**예상 결과**:
```
companies_count: 5
summary_count: 15 (5 고객사 × 3개월)
utilization_count: 19
mileage_count: 20
logs_count: 20
safety_count: 20
maintenance_count: 20
accidents_count: 20
violations_count: 20
```

---

## 🔐 마스킹 정책

### DB 저장
- **원본 그대로 저장**: `driver_name`, `department`
- DB에서는 마스킹하지 않음

### UI 표시 (프론트엔드에서 마스킹)
```typescript
// 운전자명 마스킹
function maskName(name: string): string {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}
// "김철수" → "김*수"
// "이영희" → "이*희"

// 부서명 마스킹
function maskDepartment(dept: string): string {
  if (!dept || dept.length < 2) return dept;
  const lastChar = dept[dept.length - 1];
  return dept.slice(0, -1) + '*' + lastChar;
}
// "생산1팀" → "생산1*"
// "영업2팀" → "영업2*"
```

---

## 🐛 트러블슈팅

### 문제 1: ENUM 타입 중복 오류
```
ERROR: type "maintenance_status" already exists
```

**해결책**: 마이그레이션 파일의 `DO $$ BEGIN ... END $$` 블록이 이미 처리함

### 문제 2: 외래키 오류
```
ERROR: insert or update on table violates foreign key constraint
```

**해결책**: 
1. 먼저 `companies` 테이블 업데이트 실행
2. 그 다음 나머지 테이블 데이터 입력

### 문제 3: RLS 정책 오류
```
ERROR: new row violates row-level security policy
```

**해결책**: Supabase Dashboard에서 service_role key 사용 또는 RLS 임시 비활성화
```sql
ALTER TABLE public.accidents DISABLE ROW LEVEL SECURITY;
-- 데이터 입력 후
ALTER TABLE public.accidents ENABLE ROW LEVEL SECURITY;
```

---

## 📝 실행 체크리스트

### Step 1: 마이그레이션 (테이블 생성)
- [ ] 009_companies_update.sql
- [ ] 010_mileage_detail_table.sql
- [ ] 011_driving_logs_table.sql
- [ ] 012_safety_scores_table.sql
- [ ] 013_maintenance_records_table.sql
- [ ] 014_accidents_table.sql
- [ ] 015_violations_table.sql

### Step 2: 시드 데이터 (샘플 데이터 입력)
- [ ] 005_monthly_summary_update.sql
- [ ] 006_utilization_vehicle_update.sql
- [ ] 007_mileage_detail_data.sql
- [ ] 008_driving_logs_data.sql
- [ ] 009_safety_scores_data.sql
- [ ] 010_maintenance_records_data.sql
- [ ] 011_accidents_data.sql
- [ ] 012_violations_data.sql

### Step 3: 데이터 검증
- [ ] 고객사 5개 확인
- [ ] 각 테이블 20건씩 확인
- [ ] 외래키 관계 확인

---

## 🎯 다음 단계

DB 설정 완료 후:
1. **공통 컴포넌트 개발** (DetailHeader, GraphToggle, DataTable)
2. **마스킹 유틸리티 함수 작성**
3. **7개 상세 페이지 UI 구현**
4. **recharts 라이브러리로 그래프 추가**
5. **요약 페이지에서 상세 페이지 링크 연결**

---

**준비 완료! Supabase SQL Editor에서 위 파일들을 순서대로 실행하세요.** 🚀

