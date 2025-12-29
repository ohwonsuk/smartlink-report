-- Phase 5: 샘플 데이터 - safety_scores (차량별 안전점수)

-- SK하이닉스 (153) - 11월 1~3일 (5건)
INSERT INTO public.safety_scores (cmny_id, year_month, vehicle_no, record_date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count) VALUES
  (153, '202511', '12가3456', '2025-11-01', 92.5, 1, 2, 0),
  (153, '202511', '12가3456', '2025-11-02', 91.8, 2, 1, 1),
  (153, '202511', '23나4567', '2025-11-01', 88.3, 3, 3, 1),
  (153, '202511', '34다5678', '2025-11-01', 95.2, 0, 1, 0),
  (153, '202511', '34다5678', '2025-11-02', 94.7, 1, 0, 0);

-- SK렌터카 (10) - 11월 1~3일 (5건)
INSERT INTO public.safety_scores (cmny_id, year_month, vehicle_no, record_date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count) VALUES
  (10, '202511', '67바8901', '2025-11-01', 89.5, 2, 2, 1),
  (10, '202511', '67바8901', '2025-11-02', 90.2, 1, 2, 0),
  (10, '202511', '78사9012', '2025-11-01', 87.6, 3, 4, 2),
  (10, '202511', '89아0123', '2025-11-01', 91.8, 1, 1, 1),
  (10, '202511', '89아0123', '2025-11-02', 90.5, 2, 2, 0);

-- 주식회사 락앤락 (13) - 11월 1~2일 (4건)
INSERT INTO public.safety_scores (cmny_id, year_month, vehicle_no, record_date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count) VALUES
  (13, '202511', '11카3456', '2025-11-01', 93.8, 1, 1, 0),
  (13, '202511', '11카3456', '2025-11-02', 94.2, 0, 1, 0),
  (13, '202511', '22타4567', '2025-11-01', 92.5, 1, 2, 0),
  (13, '202511', '33파5678', '2025-11-01', 90.7, 2, 2, 1);

-- SK텔레콤 (14) - 11월 1~2일 (4건)
INSERT INTO public.safety_scores (cmny_id, year_month, vehicle_no, record_date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count) VALUES
  (14, '202511', '55가7890', '2025-11-01', 91.3, 2, 1, 1),
  (14, '202511', '55가7890', '2025-11-02', 92.0, 1, 2, 0),
  (14, '202511', '66나8901', '2025-11-01', 88.9, 3, 3, 1),
  (14, '202511', '77다9012', '2025-11-01', 90.5, 2, 2, 0);

-- 다인정공 (21) - 11월 1~2일 (2건)
INSERT INTO public.safety_scores (cmny_id, year_month, vehicle_no, record_date, safe_score, sudden_accel_count, sudden_brake_count, overspeed_count) VALUES
  (21, '202511', '99마1234', '2025-11-01', 85.4, 4, 5, 2),
  (21, '202511', '00바2345', '2025-11-01', 87.2, 3, 3, 1);

-- 데이터 확인 (총 20건)
SELECT 
  c.cmny_nm,
  ss.vehicle_no,
  ss.record_date,
  ss.safe_score,
  ss.sudden_accel_count,
  ss.sudden_brake_count,
  ss.overspeed_count
FROM public.safety_scores ss
JOIN public.companies c ON ss.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, ss.safe_score DESC;

