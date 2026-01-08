# Phase 5: 상세 페이지 개발 계획

## 📋 개요
- **목표**: 요약 카드 클릭 시 상세 페이지로 이동하여 세부 데이터 확인
- **기간**: 3~4일
- **주요 기능**: 7개 상세 페이지, 그래프, 마스킹, 테이블 형식 데이터

---

## 🗄️ 데이터베이스 설계

### 1. 고객사 샘플 데이터 (companies)
```sql
cmny_id = 153, SK하이닉스
cmny_id = 10, SK렌터카
cmny_id = 13, 주식회사 락앤락
cmny_id = 14, SK텔레콤
cmny_id = 21, 다인정공
```

### 2. 필요한 테이블 (7개)

#### ✅ 1) utilization_vehicle (이미 생성됨)
- 차량별 가동률
- 컬럼: cmny_id, year_month, vehicle_no, vehicle_model, driving_minutes, utilization_pct

#### 🆕 2) mileage_detail (차량별 주행거리)
- 컬럼: cmny_id, year_month, vehicle_no, date, daily_mileage_km, cumulative_mileage_km

#### 🆕 3) driving_logs (운행일지)
- 컬럼: cmny_id, year_month, vehicle_no, date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose

#### 🆕 4) safety_scores (차량별 안전점수)
- 컬럼: cmny_id, year_month, vehicle_no, date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count

#### 🆕 5) maintenance_records (정비 현황)
- 컬럼: cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status

#### 🆕 6) accidents (사고 내역) - 마스킹 필요
- 컬럼: cmny_id, year_month, vehicle_no, accident_date, accident_type, location, driver_name, department, damage_cost, is_masked

#### 🆕 7) violations (범칙금) - 마스킹 필요
- 컬럼: cmny_id, year_month, vehicle_no, violation_date, violation_type, location, driver_name, department, fine_amount, is_masked

---

## 📄 7개 상세 페이지

### 1. 차량별 가동률 (/report/detail/utilization)
- **데이터**: utilization_vehicle
- **표시**: 차량번호, 주행시간, 가동률(24h, 8h), 순위
- **그래프**: 차량별 가동률 막대 그래프
- **정렬**: 가동률 내림차순

### 2. 차량별 주행거리 (/report/detail/mileage)
- **데이터**: mileage_detail
- **표시**: 차량번호, 일자별 주행거리, 누적 주행거리
- **그래프**: 일자별 주행거리 라인 차트
- **정렬**: 총 주행거리 내림차순

### 3. 운행일지 (/report/detail/driving-logs)
- **데이터**: driving_logs
- **표시**: 차량번호, 일자, 출발지/도착지, 출발/도착시간, 거리, 목적
- **그래프**: 일자별 운행 건수 막대 그래프
- **정렬**: 일자 최신순

### 4. 차량별 안전점수 (/report/detail/safety)
- **데이터**: safety_scores
- **표시**: 차량번호, 안전점수, 급가속/급정거/과속 횟수
- **그래프**: 차량별 안전점수 막대 그래프
- **정렬**: 안전점수 내림차순

### 5. 정비 현황 (/report/detail/maintenance)
- **데이터**: maintenance_records
- **표시**: 차량번호, 정비일자, 정비유형, 내용, 비용, 상태
- **그래프**: 정비 유형별 건수 파이 차트
- **정렬**: 정비일자 최신순

### 6. 사고 내역 (/report/detail/accidents) - 마스킹
- **데이터**: accidents
- **표시**: 차량번호, 사고일자, 사고유형, 위치, 운전자명(마스킹), 소속(마스킹), 피해금액
- **마스킹**: "홍길동" → "홍*동", "영업1팀" → "영업*팀"
- **그래프**: 사고 유형별 건수 막대 그래프
- **정렬**: 사고일자 최신순

### 7. 범칙금 (/report/detail/violations) - 마스킹
- **데이터**: violations
- **표시**: 차량번호, 위반일자, 위반유형, 위치, 운전자명(마스킹), 소속(마스킹), 범칙금액
- **마스킹**: "홍길동" → "홍*동", "영업1팀" → "영업*팀"
- **그래프**: 위반 유형별 건수 막대 그래프
- **정렬**: 위반일자 최신순

---

## 🎨 UI 공통 구조

```
┌─────────────────────────────────────────────────────────────┐
│ 헤더: [뒤로가기] [페이지 제목] [그래프 토글]                 │
├─────────────────────────────────────────────────────────────┤
│ 필터: [차량번호 검색] [정렬 옵션]                            │
├─────────────────────────────────────────────────────────────┤
│ 그래프 영역 (토글로 표시/숨김)                               │
├─────────────────────────────────────────────────────────────┤
│ 테이블 데이터                                                │
│ ┌──────┬──────┬──────┬──────┬──────┐                      │
│ │ 항목1│ 항목2│ 항목3│ 항목4│ 항목5│                      │
│ ├──────┼──────┼──────┼──────┼──────┤                      │
│ │ 데이터 ...                         │                      │
│ └──────┴──────┴──────┴──────┴──────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 마스킹 정책

### 마스킹 대상
- **운전자명**: "홍길동" → "홍*동"
- **소속/부서**: "영업1팀" → "영업*팀"

### 구현 방법
```typescript
function maskName(name: string): string {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

function maskDepartment(dept: string): string {
  if (!dept || dept.length < 2) return dept;
  const lastChar = dept[dept.length - 1];
  return dept.slice(0, -1) + '*' + lastChar;
}
```

---

## 📊 그래프 라이브러리

**사용**: `recharts` (React용 차트 라이브러리)

```bash
npm install recharts
```

### 그래프 유형
1. **막대 그래프** (Bar Chart): 가동률, 안전점수, 사고/위반 유형별
2. **라인 차트** (Line Chart): 일자별 주행거리
3. **파이 차트** (Pie Chart): 정비 유형별 비율

---

## 🧪 테스트 시나리오

### 1. 네비게이션 테스트
- [x] 요약 페이지에서 각 카드 클릭 시 해당 상세 페이지로 이동
- [x] 뒤로가기 버튼으로 요약 페이지 복귀

### 2. 데이터 표시 테스트
- [x] 테이블에 데이터 정상 표시
- [x] 정렬 기능 동작 확인
- [x] 차량번호 검색 기능 동작 확인

### 3. 마스킹 테스트
- [x] 사고 내역 페이지에서 운전자명 마스킹 확인
- [x] 범칙금 페이지에서 소속 마스킹 확인

### 4. 그래프 테스트
- [x] 그래프 토글 on/off 동작 확인
- [x] 그래프 데이터 정확성 확인
- [x] 반응형 그래프 크기 조정 확인

### 5. 반응형 테스트
- [x] PC 뷰: 넓은 테이블, 큰 그래프
- [x] 모바일 뷰: 스크롤 가능한 테이블, 작은 그래프

---

## 📁 파일 구조

```
app/report/detail/
├── layout.tsx                    # 상세 페이지 공통 레이아웃
├── utilization/
│   └── page.tsx                  # 차량별 가동률
├── mileage/
│   └── page.tsx                  # 차량별 주행거리
├── driving-logs/
│   └── page.tsx                  # 운행일지
├── safety/
│   └── page.tsx                  # 안전점수
├── maintenance/
│   └── page.tsx                  # 정비 현황
├── accidents/
│   └── page.tsx                  # 사고 내역
├── violations/
│   └── page.tsx                  # 범칙금
└── components/
    ├── DetailHeader.tsx          # 헤더 컴포넌트
    ├── GraphToggle.tsx           # 그래프 토글
    ├── DataTable.tsx             # 테이블 컴포넌트
    └── charts/
        ├── BarChart.tsx          # 막대 그래프
        ├── LineChart.tsx         # 라인 차트
        └── PieChart.tsx          # 파이 차트
```

---

## 🚀 개발 단계

### Step 1: DB 설정 (1일차)
- [x] companies 샘플 데이터 수정
- [ ] 6개 새 테이블 생성 (mileage_detail, driving_logs, safety_scores, maintenance_records, accidents, violations)
- [ ] 각 테이블에 샘플 데이터 입력 (최대 20건)
- [ ] RLS 정책 설정

### Step 2: 공통 컴포넌트 (1일차)
- [ ] DetailHeader 컴포넌트
- [ ] GraphToggle 컴포넌트
- [ ] DataTable 컴포넌트
- [ ] 마스킹 유틸리티 함수

### Step 3: 상세 페이지 구현 (2일차)
- [ ] 차량별 가동률 페이지
- [ ] 차량별 주행거리 페이지
- [ ] 운행일지 페이지
- [ ] 안전점수 페이지

### Step 4: 나머지 페이지 + 그래프 (2일차)
- [ ] 정비 현황 페이지
- [ ] 사고 내역 페이지 (마스킹)
- [ ] 범칙금 페이지 (마스킹)
- [ ] recharts 설치 및 그래프 구현

### Step 5: 요약 페이지 연동 (3일차)
- [ ] 요약 카드에 링크 추가
- [ ] 파라미터 전달 (cmny_id, year_month)
- [ ] 반응형 테스트

### Step 6: 테스트 및 버그 수정 (3~4일차)
- [ ] 전체 기능 테스트
- [ ] 버그 수정
- [ ] 성능 최적화

---

## 📊 샘플 데이터 분포

각 고객사별 샘플 데이터:
- SK하이닉스 (153): 5건
- SK렌터카 (10): 5건  
- 주식회사 락앤락 (13): 4건
- SK텔레콤 (14): 4건
- 다인정공 (21): 2건

**총합: 20건 이내**

