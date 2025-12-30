-- Phase 7: report_files 테이블 생성 (PDF 캐시 관리)

-- 1) report_files 테이블 생성
CREATE TABLE IF NOT EXISTS public.report_files (
  file_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  file_type TEXT NOT NULL DEFAULT 'pdf', -- pdf, excel 등
  file_name TEXT NOT NULL, -- 파일명 (예: SK렌터카_202511_report.pdf)
  storage_path TEXT NOT NULL, -- Storage 경로
  file_size BIGINT, -- 파일 크기 (bytes)
  
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- 생성 일시
  expires_at TIMESTAMPTZ, -- 만료 일시 (캐시 유효기간)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(cmny_id, year_month, file_type)
);

-- 2) 인덱스 생성
CREATE INDEX report_files_cmny_year_idx ON public.report_files(cmny_id, year_month);
CREATE INDEX report_files_expires_idx ON public.report_files(expires_at);

-- 3) RLS 활성화
ALTER TABLE public.report_files ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 리포트 파일 조회 가능
CREATE POLICY "Approved users can view report files"
  ON public.report_files
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert report files"
  ON public.report_files
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update report files"
  ON public.report_files
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete report files"
  ON public.report_files
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS set_report_files_updated_at ON public.report_files;
CREATE TRIGGER set_report_files_updated_at
  BEFORE UPDATE ON public.report_files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7) 만료된 파일 정리 함수
CREATE OR REPLACE FUNCTION public.cleanup_expired_report_files()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.report_files
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 8) 데이터 확인
SELECT 
  file_id,
  cmny_id,
  year_month,
  file_type,
  file_name,
  file_size,
  generated_at,
  expires_at
FROM public.report_files
ORDER BY generated_at DESC
LIMIT 10;

