# Phase 7: PDF 다운로드 기능 설치 가이드

## 📦 1. 패키지 설치

```bash
npm install puppeteer date-fns
```

## 🗄️ 2. 데이터베이스 마이그레이션

### Supabase SQL Editor에서 실행:

```sql
-- 1. report_files 테이블 생성
-- supabase/migrations/024_report_files_table.sql 전체 실행
```

## 📁 3. Storage 버킷 생성

### 방법 1: SQL로 생성 (권장)

```sql
-- supabase/storage/buckets.sql 전체 실행
```

### 방법 2: Supabase Dashboard

1. Supabase Dashboard → Storage
2. "New bucket" 클릭
3. 설정:
   - Name: `reports`
   - Public: `OFF` (비공개)
   - File size limit: `10 MB`
   - Allowed MIME types: `application/pdf`
4. "Create bucket" 클릭

## ⚙️ 4. 환경 변수 설정

`.env.local` 파일에 추가:

```bash
# 기존 Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# PDF 생성용 앱 URL (추가)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**프로덕션 환경**:
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 5. 개발 서버 실행

```bash
npm run dev
```

## ✅ 6. 동작 확인

### 6-1. 테이블 확인

```sql
-- report_files 테이블 확인
SELECT * FROM report_files;

-- 결과: 빈 테이블 (정상)
```

### 6-2. Storage 버킷 확인

```sql
-- reports 버킷 확인
SELECT * FROM storage.buckets WHERE id = 'reports';

-- 결과: reports 버킷 1개 (정상)
```

### 6-3. PDF 생성 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 로그인
3. 리포트 선택 (예: SK렌터카 2025년 11월)
4. "PDF 다운로드" 버튼 클릭
5. "PDF 생성 중..." 메시지 확인
6. 약 5-10초 후 PDF 다운로드 시작

### 6-4. 캐시 테스트

1. 동일 리포트에서 다시 "PDF 다운로드" 클릭
2. 즉시 다운로드 시작 (1-2초)
3. "캐시된 PDF를 다운로드합니다." 알림

## 🐛 7. 트러블슈팅

### 문제 1: Puppeteer 설치 오류

**증상**:
```
Error: Failed to download chromium
```

**해결**:
```bash
# macOS
brew install chromium

# Linux
sudo apt-get install -y chromium-browser

# 또는 환경 변수 설정
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### 문제 2: PDF 생성 실패

**증상**:
```
Error: Failed to launch the browser process
```

**해결**:
```bash
# Linux 서버에 필요한 의존성 설치
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### 문제 3: Storage 업로드 실패

**증상**:
```
Upload failed
```

**해결**:
1. Storage 버킷이 생성되었는지 확인
2. RLS 정책 확인:
```sql
-- Storage RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'objects';
```
3. 파일 크기 확인 (10MB 이하)

### 문제 4: 환경 변수 인식 안 됨

**증상**:
```
NEXT_PUBLIC_APP_URL is undefined
```

**해결**:
1. `.env.local` 파일 확인
2. 개발 서버 재시작:
```bash
# Ctrl+C로 중지 후
npm run dev
```

## 📊 8. 데이터 확인

### 생성된 PDF 확인

```sql
-- report_files 테이블 조회
SELECT 
  file_id,
  cmny_id,
  year_month,
  file_name,
  file_size,
  generated_at,
  expires_at
FROM report_files
ORDER BY generated_at DESC;
```

### Storage 파일 확인

```sql
-- Storage 파일 조회
SELECT 
  name,
  bucket_id,
  created_at,
  metadata->>'size' as size
FROM storage.objects
WHERE bucket_id = 'reports'
ORDER BY created_at DESC;
```

## 🎯 9. 성능 체크

### 첫 PDF 생성 시간
- 예상: 5-10초
- 실제: ___초

### 캐시된 PDF 다운로드 시간
- 예상: 1-2초
- 실제: ___초

### PDF 파일 크기
- 예상: 500KB - 2MB
- 실제: ___MB

## ✅ 10. 완료 체크리스트

- [ ] Puppeteer 설치 완료
- [ ] `report_files` 테이블 생성 확인
- [ ] `reports` Storage 버킷 생성 확인
- [ ] 환경 변수 설정 완료
- [ ] 개발 서버 실행 확인
- [ ] 첫 PDF 생성 테스트 성공
- [ ] 캐시된 PDF 다운로드 테스트 성공
- [ ] PDF 레이아웃 확인 (웹과 동일)

## 🚀 11. 다음 단계

Phase 7 완료 후:
- [ ] Phase 8: Excel 다운로드 (옵션)
- [ ] Phase 9: 이메일 전송 (옵션)
- [ ] Phase 10: 스케줄 자동 생성 (옵션)

---

## 📞 문의

문제 발생 시 `PHASE7_PDF_SETUP.md` 참조

