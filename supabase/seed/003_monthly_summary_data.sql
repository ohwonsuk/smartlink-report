-- Phase 4: monthly_summary 더미 데이터 (3개월치)

-- SK렌터카 (cmny_id = 1001) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (
  cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes,
  trip_log_vehicle_count, avg_safe_score, maintenance_completed_count,
  accident_count, violation_count, violation_amount
) VALUES
  -- 2025년 9월
  (1001, '202509', 50, 125000.00, 180000, 48, 85.5, 12, 2, 5, 350000),
  -- 2025년 10월
  (1001, '202510', 50, 132000.00, 185000, 49, 87.2, 10, 1, 3, 220000),
  -- 2025년 11월
  (1001, '202511', 52, 145000.00, 195000, 50, 88.5, 8, 1, 2, 150000);

-- 현대렌탈케어 (cmny_id = 1002) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (
  cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes,
  trip_log_vehicle_count, avg_safe_score, maintenance_completed_count,
  accident_count, violation_count, violation_amount
) VALUES
  -- 2025년 9월
  (1002, '202509', 30, 75000.00, 108000, 28, 82.3, 8, 3, 4, 280000),
  -- 2025년 10월
  (1002, '202510', 30, 78000.00, 112000, 29, 83.8, 7, 2, 3, 200000),
  -- 2025년 11월
  (1002, '202511', 32, 82000.00, 118000, 30, 85.1, 6, 1, 2, 140000);

-- 롯데렌터카 (cmny_id = 1003) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (
  cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes,
  trip_log_vehicle_count, avg_safe_score, maintenance_completed_count,
  accident_count, violation_count, violation_amount
) VALUES
  -- 2025년 9월
  (1003, '202509', 40, 95000.00, 144000, 38, 84.7, 10, 2, 6, 420000),
  -- 2025년 10월
  (1003, '202510', 40, 102000.00, 150000, 39, 86.3, 9, 1, 4, 280000),
  -- 2025년 11월
  (1003, '202511', 42, 108000.00, 156000, 40, 87.9, 7, 1, 3, 190000);

-- 성공적으로 더미 데이터 삽입 확인
SELECT 
  c.cmny_nm,
  ms.year_month,
  ms.vehicle_count,
  ms.total_mileage_km,
  ms.accident_count
FROM public.monthly_summary ms
JOIN public.companies c ON ms.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, ms.year_month;

