-- Supabase Storage 버킷 생성: reports

-- 1) reports 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  FALSE, -- 비공개 (인증된 사용자만 접근)
  10485760, -- 10MB 제한
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- 2) Storage RLS 정책: 승인된 사용자는 리포트 다운로드 가능
CREATE POLICY "Approved users can download reports"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'reports'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 3) Storage RLS 정책: Admin만 리포트 업로드 가능
CREATE POLICY "Admins can upload reports"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'reports'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 4) Storage RLS 정책: Admin만 리포트 삭제 가능
CREATE POLICY "Admins can delete reports"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'reports'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 5) 버킷 확인
SELECT * FROM storage.buckets WHERE id = 'reports';

