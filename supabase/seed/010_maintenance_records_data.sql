-- Phase 5: 샘플 데이터 - maintenance_records (정비 현황)

-- SK하이닉스 (153) - 11월 (5건)
INSERT INTO public.maintenance_records (cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status) VALUES
  (153, '202511', '12가3456', '2025-11-05', '정기점검', '5만km 정기점검 및 오일교환', 350000, 'completed'),
  (153, '202511', '23나4567', '2025-11-08', '엔진오일', '엔진오일 및 필터 교체', 120000, 'completed'),
  (153, '202511', '34다5678', '2025-11-12', '타이어교체', '전륜 타이어 2개 교체', 480000, 'completed'),
  (153, '202511', '45라6789', '2025-11-15', '브레이크', '전륜 브레이크 패드 교체', 280000, 'completed'),
  (153, '202511', '56마7890', '2025-11-18', '기타', '에어컨 필터 교체', 85000, 'completed');

-- SK렌터카 (10) - 11월 (5건)
INSERT INTO public.maintenance_records (cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status) VALUES
  (10, '202511', '67바8901', '2025-11-03', '정기점검', '3만km 정기점검', 250000, 'completed'),
  (10, '202511', '78사9012', '2025-11-07', '엔진오일', '엔진오일 교환', 95000, 'completed'),
  (10, '202511', '89아0123', '2025-11-10', '타이어교체', '후륜 타이어 2개 교체', 460000, 'completed'),
  (10, '202511', '90자1234', '2025-11-14', '브레이크', '후륜 브레이크 패드 교체', 260000, 'completed'),
  (10, '202511', '01차2345', '2025-11-20', '기타', '배터리 교체', 180000, 'completed');

-- 주식회사 락앤락 (13) - 11월 (4건)
INSERT INTO public.maintenance_records (cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status) VALUES
  (13, '202511', '11카3456', '2025-11-06', '정기점검', '6만km 정기점검', 380000, 'completed'),
  (13, '202511', '22타4567', '2025-11-11', '엔진오일', '합성 엔진오일 교환', 150000, 'completed'),
  (13, '202511', '33파5678', '2025-11-16', '기타', '와이퍼 교체', 45000, 'completed'),
  (13, '202511', '44하6789', '2025-11-22', '정기점검', '1년 정기점검', 320000, 'in_progress');

-- SK텔레콤 (14) - 11월 (4건)
INSERT INTO public.maintenance_records (cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status) VALUES
  (14, '202511', '55가7890', '2025-11-04', '정기점검', '4만km 정기점검', 300000, 'completed'),
  (14, '202511', '66나8901', '2025-11-09', '타이어교체', '전체 타이어 4개 교체', 920000, 'completed'),
  (14, '202511', '77다9012', '2025-11-13', '브레이크', '전체 브레이크 패드 교체', 520000, 'completed'),
  (14, '202511', '88라0123', '2025-11-19', '기타', '헤드라이트 교체', 220000, 'completed');

-- 다인정공 (21) - 11월 (2건)
INSERT INTO public.maintenance_records (cmny_id, year_month, vehicle_no, maintenance_date, maintenance_type, description, cost, status) VALUES
  (21, '202511', '99마1234', '2025-11-10', '정기점검', '2만km 정기점검', 200000, 'completed'),
  (21, '202511', '00바2345', '2025-11-17', '엔진오일', '엔진오일 교환', 110000, 'completed');

-- 데이터 확인 (총 20건)
SELECT 
  c.cmny_nm,
  mr.vehicle_no,
  mr.maintenance_date,
  mr.maintenance_type,
  mr.cost,
  mr.status
FROM public.maintenance_records mr
JOIN public.companies c ON mr.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, mr.maintenance_date DESC;

