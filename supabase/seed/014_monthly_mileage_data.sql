-- Phase 5: monthly_mileage 샘플 데이터 (가동률 샘플 차량과 일치)

-- SK렌터카 (cmny_id = 153) - 2025년 11월 (15대)
INSERT INTO public.monthly_mileage (cmny_id, year_month, vehicle_no, vehicle_model, monthly_trip_count, monthly_driving_days, monthly_total_mileage_km) VALUES
  (153, '202511', '223허5990', 'K8', 54, 21, 314.5),
  (153, '202511', '223허5988', 'K8', 52, 21, 312.5),
  (153, '202511', '223허5975', 'K8', 52, 21, 304.6),
  (153, '202511', '223허5978', 'K8', 48, 21, 299.4),
  (153, '202511', '223허3005', 'K8', 47, 21, 295.4),
  (153, '202511', '23누7436', '아이오닉 6', 47, 20, 286.5),
  (153, '202511', '190허5645', 'G80', 40, 20, 276.4),
  (153, '202511', '223허5990', 'K8', 39, 20, 265.6),
  (153, '202511', '223허5991', 'K8', 39, 19, 234.5),
  (153, '202511', '223허5982', 'K8', 38, 19, 224.5),
  (153, '202511', '27누1848', '아이오닉 6', 37, 19, 222.5),
  (153, '202511', '223허3015', 'K8', 37, 19, 221.6),
  (153, '202511', '191허2189', 'QM6', 36, 18, 190.1),
  (153, '202511', '223허3001', 'K8', 33, 18, 180.4),
  (153, '202511', '92나7850', '통고', 32, 17, 179.5);

-- SK하이닉스 (cmny_id = 10) - 2025년 11월 (5대)
INSERT INTO public.monthly_mileage (cmny_id, year_month, vehicle_no, vehicle_model, monthly_trip_count, monthly_driving_days, monthly_total_mileage_km) VALUES
  (10, '202511', '67하8901', 'K5', 45, 20, 280.3),
  (10, '202511', '78하9012', 'G70', 38, 18, 245.8),
  (10, '202511', '89하0123', '쏘렌토', 42, 19, 268.5),
  (10, '202511', '90호1234', 'K8', 48, 21, 295.7),
  (10, '202511', '01호2345', '아이오닉 5', 35, 17, 215.4);

-- 주식회사 락앤락 (cmny_id = 13) - 2025년 11월 (5대)
INSERT INTO public.monthly_mileage (cmny_id, year_month, vehicle_no, vehicle_model, monthly_trip_count, monthly_driving_days, monthly_total_mileage_km) VALUES
  (13, '202511', '11허3456', '그랜저', 50, 22, 325.8),
  (13, '202511', '22허4567', 'K7', 46, 21, 298.4),
  (13, '202511', '33하5678', 'SM6', 42, 20, 275.6),
  (13, '202511', '44하6789', '카니발', 40, 19, 255.3),
  (13, '202511', '55하7890', 'K5', 36, 18, 230.7);

-- SK텔레콤 (cmny_id = 14) - 2025년 11월 (4대)
INSERT INTO public.monthly_mileage (cmny_id, year_month, vehicle_no, vehicle_model, monthly_trip_count, monthly_driving_days, monthly_total_mileage_km) VALUES
  (14, '202511', '55가7890', 'G90', 52, 22, 340.5),
  (14, '202511', '66나8901', 'K9', 48, 21, 310.8),
  (14, '202511', '77다9012', 'EV6', 44, 20, 285.3),
  (14, '202511', '88라0123', '팰리세이드', 41, 19, 268.9);

-- 다인정공 (cmny_id = 21) - 2025년 11월 (2대)
INSERT INTO public.monthly_mileage (cmny_id, year_month, vehicle_no, vehicle_model, monthly_trip_count, monthly_driving_days, monthly_total_mileage_km) VALUES
  (21, '202511', '99마1234', '스타렉스', 38, 19, 245.6),
  (21, '202511', '00바2345', '봉고', 35, 18, 228.3);

-- 데이터 확인
SELECT 
  c.cmny_nm,
  mm.vehicle_no,
  mm.vehicle_model,
  mm.monthly_trip_count AS "월 운행건수",
  mm.monthly_driving_days AS "월 운행일수",
  mm.monthly_total_mileage_km AS "월 누적주행거리(km)"
FROM public.monthly_mileage mm
JOIN public.companies c ON mm.cmny_id = c.cmny_id
WHERE mm.year_month = '202511'
ORDER BY c.cmny_nm, mm.monthly_total_mileage_km DESC;

-- 전체 건수 확인
SELECT COUNT(*) as total_count FROM public.monthly_mileage;
-- 예상: 31건 (15 + 5 + 5 + 4 + 2)

