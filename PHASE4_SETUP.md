# Phase 4: 리포트 요약 페이지 구현 가이드

## 📋 Phase 4 목표

- ✅ monthly_summary 테이블 생성 + 더미 데이터 3개월치
- ✅ 요약 페이지 UI (4×2 카드 레이아웃)
- ✅ 수식 적용 (가동률, 전월비, 증감률)
- ✅ 서비스 소개 섹션 (하단 고정)
- ✅ "웹화면 보기" 버튼 연결

---

## 🗄️ Step 1: 데이터베이스 설정

### 1.1 monthly_summary 테이블 생성

Supabase SQL Editor에서 `007_monthly_summary_table.sql` 실행:

```sql
-- Phase 4: monthly_summary 테이블 생성
-- (파일 내용 전체 복사하여 실행)
```

**테이블 구조**:
- `cmny_id` (INTEGER): 고객사 ID
- `year_month` (CHAR(6)): 년월 (YYYYMM 형식)
- `vehicle_count`: 대상 차량 수
- `total_mileage_km`: 총 주행거리 (km)
- `total_driving_minutes`: 총 주행시간 (분)
- `trip_log_vehicle_count`: 운행일지 생성 대수
- `avg_safe_score`: 평균 안전점수
- `maintenance_completed_count`: 정비 완료 건수
- `accident_count`: 사고 건수
- `violation_count`: 범칙금 건수
- `violation_amount`: 범칙금 총액

### 1.2 더미 데이터 삽입

Supabase SQL Editor에서 `003_monthly_summary_data.sql` 실행:

```sql
-- Phase 4: monthly_summary 더미 데이터 (3개월치)
-- SK렌터카, 현대렌탈케어, 롯데렌터카의 2025년 9월, 10월, 11월 데이터
-- (파일 내용 전체 복사하여 실행)
```

**데이터 확인**:
```sql
SELECT 
  c.cmny_nm,
  ms.year_month,
  ms.vehicle_count,
  ms.total_mileage_km,
  ms.accident_count
FROM public.monthly_summary ms
JOIN public.companies c ON ms.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, ms.year_month;
```

---

## 🎨 Step 2: 요약 페이지 UI

### 2.1 페이지 구조

```
/app/report/view/
├── page.tsx                          # 메인 페이지 (Server Component)
└── components/
    ├── ReportSummary.tsx             # 4×2 카드 그리드
    └── ServiceIntro.tsx              # 서비스 소개 섹션
```

### 2.2 주요 기능

#### ✅ 리포트 헤더
- **좌**: 고객사명 (요약 페이지에만 표시)
- **중앙**: Monthly Report - YY년MM월
- **우**: 서비스 제공업체 로고 (스마트링크)

#### ✅ 4×2 카드 그리드
8개의 지표 카드:
1. **대상 차량** (대)
2. **월 총 주행거리** (km)
3. **평균 가동률** (%)
4. **운행일지 생성대수** (대)
5. **평균 안전점수** (점)
6. **정비 현황** (건)
7. **사고 내역** (건)
8. **범칙금** (원)

각 카드에는:
- 아이콘
- 지표 이름
- 현재 값
- 전월 대비 증감 (▲/▼)
- 증감률 (%)

---

## 📐 Step 3: 수식 적용

### 3.1 평균 가동률 계산 (8시간 기준)

```typescript
const calculateUtilization = (drivingMinutes: number, vehicleCount: number) => {
  if (vehicleCount === 0) return 0;
  // 24시간 기준 가동률
  const utilization24h = (drivingMinutes / (vehicleCount * 24 * 60)) * 100;
  // 8시간 기준으로 환산 (×3)
  return utilization24h * 3;
};
```

**수식 설명**:
- PDF 정의: `(주행시간(분) / (차량수 × 24 × 60)) × 100 × 3`
- 24시간 기준 가동률을 8시간 기준으로 환산하기 위해 ×3

### 3.2 전월비 및 증감률 계산

```typescript
const calculateChange = (current: number, previous: number | null | undefined) => {
  if (!previous || previous === 0) return null;
  
  // 전월비 (절대값)
  const change = current - previous;
  
  // 증감률 (%)
  const changeRate = ((current - previous) / previous) * 100;
  
  return { change, changeRate };
};
```

**표시 규칙**:
- 증가(+): ▲ 녹색
- 감소(-): ▼ 빨간색

**예시**:
```
현재: 145,000 km
전월: 132,000 km
→ ▲ 13,000 km (+9.8%)
```

### 3.3 전월 계산

```typescript
function getPreviousYearMonth(yearMonth: string): string {
  const year = parseInt(yearMonth.substring(0, 4));
  const month = parseInt(yearMonth.substring(4, 6));

  if (month === 1) {
    return `${year - 1}12`; // 1월 → 전년 12월
  } else {
    return `${year}${String(month - 1).padStart(2, '0')}`;
  }
}
```

---

## 🎯 Step 4: 서비스 소개 섹션

### 4.1 위치 및 스타일
- **위치**: 요약 페이지 하단 (8개 카드 아래)
- **배경**: 그라데이션 (indigo-50 → blue-50)
- **내용**: 
  - 메인 카피
  - 3개의 주요 효과 카드
  - 문의 정보

### 4.2 주요 효과

1. **📊 실시간 모니터링**
   - 모든 차량의 운행 데이터를 실시간으로 확인하고 관리

2. **💰 비용 절감**
   - 데이터 기반 의사결정으로 차량 운영 비용 최적화

3. **🛡️ 안전 관리**
   - 안전운전 점수 분석을 통해 사고 사전 예방

### 4.3 반응형 디자인
- **PC 모드**: 3열 그리드
- **모바일 모드**: 1열 스택

---

## 🔗 Step 5: "웹화면 보기" 버튼 연결

### 5.1 URL 파라미터

```typescript
/report/view?cmny_id=1001&year_month=2025-11&view=pc
```

**파라미터**:
- `cmny_id`: 고객사 ID (필수)
- `year_month`: 조회 월 (YYYY-MM 형식, 필수)
- `view`: 화면 모드 (pc | mobile, 기본값: pc)

### 5.2 데이터 흐름

```
[리포트 선택 화면]
    ↓ 고객사 + 연월 선택
    ↓ "웹화면 보기" 클릭
[/report/view?cmny_id=...&year_month=...&view=...]
    ↓ Server Component
    ↓ 고객사 정보 조회
    ↓ monthly_summary 조회 (현재 월 + 전월)
    ↓ 데이터 존재 확인
[리포트 요약 페이지 렌더링]
    ↓ ReportSummary 컴포넌트
    ↓ 4×2 카드 표시
    ↓ ServiceIntro 컴포넌트
```

---

## 🧪 테스트 시나리오

### ✅ 시나리오 1: 정상 케이스

1. `/report` 접속
2. 고객사 검색: "SK렌터카"
3. 조회 월 선택: "2025년 11월"
4. 화면 모드: "PC용"
5. **"웹화면 보기"** 클릭
6. 리포트 요약 페이지 표시 확인:
   - 헤더: "SK렌터카 | Monthly Report - 25년 11월 | 스마트링크"
   - 8개 카드 표시
   - 각 카드에 전월비 (▲/▼) 표시
   - 하단 서비스 소개 섹션 표시

### ✅ 시나리오 2: 전월비 계산 확인

**SK렌터카 예시** (더미 데이터 기준):

| 지표 | 10월 | 11월 | 전월비 | 증감률 |
|------|------|------|--------|--------|
| 대상 차량 | 50대 | 52대 | ▲ 2대 | +4.0% |
| 월 총 주행거리 | 132,000km | 145,000km | ▲ 13,000km | +9.8% |
| 사고 내역 | 1건 | 1건 | - | 0% |
| 범칙금 | 220,000원 | 150,000원 | ▼ 70,000원 | -31.8% |

### ✅ 시나리오 3: 모바일 모드

1. 화면 모드: "모바일용" 선택
2. "웹화면 보기" 클릭
3. 반응형 레이아웃 확인:
   - 카드: 1~2열 그리드
   - 서비스 소개: 1열 스택

### ✅ 시나리오 4: 데이터 없음

1. 존재하지 않는 월 선택 (예: 2025년 12월)
2. "웹화면 보기" 클릭
3. "데이터 없음" 메시지 표시 확인
4. "리포트 선택 화면으로" 버튼 확인

### ✅ 시나리오 5: 전월 데이터 없음

1. 최초 월 선택 (예: 2025년 9월)
2. "웹화면 보기" 클릭
3. 카드에 전월비 표시 없음 확인 (전월 데이터 없음)

---

## 📊 데이터 모델

### monthly_summary 테이블

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| cmny_id | INTEGER | 고객사 ID | 1001 |
| year_month | CHAR(6) | 년월 (YYYYMM) | 202511 |
| vehicle_count | INTEGER | 대상 차량 수 | 52 |
| total_mileage_km | NUMERIC(12,2) | 총 주행거리 (km) | 145000.00 |
| total_driving_minutes | INTEGER | 총 주행시간 (분) | 195000 |
| trip_log_vehicle_count | INTEGER | 운행일지 생성 대수 | 50 |
| avg_safe_score | NUMERIC(5,2) | 평균 안전점수 | 88.50 |
| maintenance_completed_count | INTEGER | 정비 완료 건수 | 8 |
| accident_count | INTEGER | 사고 건수 | 1 |
| violation_count | INTEGER | 범칙금 건수 | 2 |
| violation_amount | NUMERIC(12,2) | 범칙금 총액 (원) | 150000.00 |

---

## 🎨 UI 스타일 가이드

### 색상 팔레트

- **주요 색상**: Indigo (indigo-600)
- **긍정 (▲)**: Green (green-600)
- **부정 (▼)**: Red (red-600)
- **배경**: Gray-50
- **카드**: White

### 타이포그래피

- **제목**: 3xl, font-bold
- **카드 제목**: sm, font-medium
- **지표 값**: 3xl, font-bold
- **단위**: lg, font-medium
- **전월비**: sm, font-medium

### 간격 및 레이아웃

- **카드 간격**: gap-4
- **카드 패딩**: p-6
- **섹션 간격**: mt-12
- **최대 너비 (PC)**: max-w-[1200px]

---

## ✅ Phase 4 완료 체크리스트

- [x] monthly_summary 테이블 생성
- [x] 더미 데이터 삽입 (3개월 × 3개 고객사)
- [x] 리포트 조회 페이지 생성 (`/report/view`)
- [x] ReportSummary 컴포넌트 (4×2 카드)
- [x] 평균 가동률 수식 적용 (8시간 기준)
- [x] 전월비 및 증감률 계산
- [x] ▲/▼ 아이콘 및 색상 표시
- [x] ServiceIntro 컴포넌트
- [x] "웹화면 보기" 버튼 연결
- [x] 파라미터 검증 및 리다이렉트
- [x] 데이터 없음 처리
- [x] 반응형 디자인 (PC/모바일 모드)
- [ ] 전체 테스트 완료

---

## 🐛 알려진 이슈

없음

---

## 💡 개선 아이디어 (향후)

1. **그래프 추가**
   - 각 지표의 3개월/6개월 추이 그래프
   - recharts 또는 chart.js 사용

2. **인쇄 최적화**
   - CSS @media print 스타일
   - 브라우저 인쇄 기능 최적화

3. **캐시 전략**
   - 리포트 데이터 클라이언트 캐싱
   - React Query 또는 SWR 도입

4. **애니메이션**
   - 카드 진입 애니메이션
   - 숫자 카운트업 효과

---

**Phase 4 구현 완료!** 🎉

다음 명령어로 테스트를 시작하세요:

```bash
# 1. DB 마이그레이션 실행 (Supabase SQL Editor)
# - 007_monthly_summary_table.sql
# - 003_monthly_summary_data.sql

# 2. 개발 서버 실행
npm run dev

# 3. 테스트
# http://localhost:3000/report
```

---

## 🔜 다음 단계 (Phase 5)

Phase 4 완료 후 Phase 5에서 구현할 내용:

1. **상세 페이지 7개**
   - 가동률 TOP 5
   - 주행거리 상세
   - 운행일지 현황
   - 안전점수 분석
   - 정비 내역
   - 사고 내역 (마스킹)
   - 범칙금 내역 (마스킹)

2. **추가 테이블**
   - `utilization_vehicle` (차량별 가동률)
   - `accidents` (사고 리스트)
   - `violations` (범칙금 리스트)

3. **그래프 옵션**
   - 그래프 표시 on/off 토글
   - recharts 라이브러리 통합

