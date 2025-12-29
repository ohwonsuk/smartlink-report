-- Phase 2: 테스트용 고객사 데이터 seed

-- 테스트용 고객사 생성
-- cmny_id는 INTEGER로 수기 입력
INSERT INTO public.companies (cmny_id, cmny_nm, biz_no) VALUES
  (10, 'SK하이닉스', '135-81-00000'),
  (13, '주식회사 락앤락', '211-81-00000'),
  (14, 'SK텔레콤', '101-81-00000'),
  (21, '다인정공', '312-81-00000'),
  (153, 'SK렌터카', '110-81-12345'),
  (154, '현대렌터카', '110-81-23456'),
  (155, '롯데렌터카', '110-81-34567'),
  (156, '에이비카', '110-81-45678'),
  (157, '그린카', '110-81-56789')
ON CONFLICT (cmny_id) DO NOTHING;

-- 생성된 고객사 확인
SELECT cmny_id, cmny_nm, biz_no, created_at 
FROM public.companies 
ORDER BY cmny_id ASC;

