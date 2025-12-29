-- Phase 5: 샘플 데이터 - mileage_detail (차량별 주행거리)

-- SK하이닉스 (153) - 11월 1~5일 (차량 3대)
INSERT INTO public.mileage_detail (cmny_id, year_month, vehicle_no, record_date, daily_mileage_km, cumulative_mileage_km) VALUES
  (153, '202511', '12가3456', '2025-11-01', 245.5, 12450),
  (153, '202511', '12가3456', '2025-11-02', 280.3, 12730),
  (153, '202511', '12가3456', '2025-11-03', 195.8, 12926),
  (153, '202511', '23나4567', '2025-11-01', 310.2, 15240),
  (153, '202511', '23나4567', '2025-11-02', 265.7, 15506),
  (153, '202511', '34다5678', '2025-11-01', 180.5, 9850);

-- SK렌터카 (10) - 11월 1~5일 (차량 2대)
INSERT INTO public.mileage_detail (cmny_id, year_month, vehicle_no, record_date, daily_mileage_km, cumulative_mileage_km) VALUES
  (10, '202511', '67바8901', '2025-11-01', 220.4, 11200),
  (10, '202511', '67바8901', '2025-11-02', 195.8, 11396),
  (10, '202511', '78사9012', '2025-11-01', 175.3, 8750),
  (10, '202511', '78사9012', '2025-11-02', 210.6, 8961);

-- 주식회사 락앤락 (13) - 11월 1~3일 (차량 2대)
INSERT INTO public.mileage_detail (cmny_id, year_month, vehicle_no, record_date, daily_mileage_km, cumulative_mileage_km) VALUES
  (13, '202511', '11카3456', '2025-11-01', 190.5, 9500),
  (13, '202511', '11카3456', '2025-11-02', 165.8, 9666),
  (13, '202511', '22타4567', '2025-11-01', 145.2, 7260);

-- SK텔레콤 (14) - 11월 1~3일 (차량 2대)
INSERT INTO public.mileage_detail (cmny_id, year_month, vehicle_no, record_date, daily_mileage_km, cumulative_mileage_km) VALUES
  (14, '202511', '55가7890', '2025-11-01', 235.8, 11800),
  (14, '202511', '55가7890', '2025-11-02', 198.4, 11998),
  (14, '202511', '66나8901', '2025-11-01', 210.3, 10500);

-- 다인정공 (21) - 11월 1~2일 (차량 1대)
INSERT INTO public.mileage_detail (cmny_id, year_month, vehicle_no, record_date, daily_mileage_km, cumulative_mileage_km) VALUES
  (21, '202511', '99마1234', '2025-11-01', 155.6, 7780),
  (21, '202511', '99마1234', '2025-11-02', 178.9, 7959);

-- 데이터 확인 (총 20건)
SELECT 
  c.cmny_nm,
  md.vehicle_no,
  md.record_date,
  md.daily_mileage_km,
  md.cumulative_mileage_km
FROM public.mileage_detail md
JOIN public.companies c ON md.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, md.vehicle_no, md.record_date;

