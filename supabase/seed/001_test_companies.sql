-- Phase 2: 테스트용 고객사 데이터 seed

-- 테스트용 고객사 5개 생성
-- cmny_id는 INTEGER로 수기 입력
INSERT INTO public.companies (cmny_id, cmny_nm, biz_no) VALUES
  (1, 'SK렌터카', '110-81-12345'),
  (2, '현대렌터카', '110-81-23456'),
  (3, '롯데렌터카', '110-81-34567'),
  (4, '에이비카', '110-81-45678'),
  (5, '그린카', '110-81-56789')
ON CONFLICT (cmny_id) DO NOTHING;

-- 생성된 고객사 확인
SELECT cmny_id, cmny_nm, biz_no, created_at 
FROM public.companies 
ORDER BY cmny_id ASC;

