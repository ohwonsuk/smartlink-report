-- Phase 5: 고객사 샘플 데이터 업데이트

-- 기존 샘플 데이터 삭제
DELETE FROM public.companies WHERE cmny_id IN (1001, 1002, 1003);

-- 새 샘플 고객사 데이터 삽입
INSERT INTO public.companies (cmny_id, cmny_nm, biz_no, created_at, updated_at) VALUES
  (153, 'SK하이닉스', '119-81-24643', NOW(), NOW()),
  (10, 'SK렌터카', '211-86-19864', NOW(), NOW()),
  (13, '주식회사 락앤락', '138-81-52988', NOW(), NOW()),
  (14, 'SK텔레콤', '220-81-39938', NOW(), NOW()),
  (21, '다인정공', '124-81-12345', NOW(), NOW())
ON CONFLICT (cmny_id) 
DO UPDATE SET 
  cmny_nm = EXCLUDED.cmny_nm,
  biz_no = EXCLUDED.biz_no,
  updated_at = NOW();

-- 데이터 확인
SELECT cmny_id, cmny_nm, biz_no FROM public.companies ORDER BY cmny_id;

