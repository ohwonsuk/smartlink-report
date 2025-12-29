-- Phase 5: 샘플 데이터 - monthly_summary 업데이트

-- 기존 데이터 삭제
DELETE FROM public.monthly_summary WHERE cmny_id IN (1001, 1002, 1003);

-- SK렌터카 (153) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes, trip_log_vehicle_count, avg_safe_score, maintenance_completed_count, accident_count, violation_count, violation_amount) VALUES
  (153, '202509', 50, 125000, 540000, 45, 87.5, 12, 5, 3, 280000),
  (153, '202510', 51, 132000, 550800, 50, 88.2, 10, 4, 2, 200000),
  (153, '202511', 52, 145000, 562560, 48, 88.5, 8, 3, 1, 140000);

-- SK하이닉스 (10) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes, trip_log_vehicle_count, avg_safe_score, maintenance_completed_count, accident_count, violation_count, violation_amount) VALUES
  (10, '202509', 30, 75000, 324000, 28, 85.0, 8, 3, 2, 180000),
  (10, '202510', 30, 78000, 330000, 29, 85.5, 7, 2, 2, 150000),
  (10, '202511', 30, 82000, 336000, 30, 86.0, 6, 1, 1, 100000);

-- 주식회사 락앤락 (13) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes, trip_log_vehicle_count, avg_safe_score, maintenance_completed_count, accident_count, violation_count, violation_amount) VALUES
  (13, '202509', 20, 50000, 216000, 18, 90.0, 5, 1, 1, 80000),
  (13, '202510', 20, 52000, 220800, 19, 90.5, 4, 1, 0, 50000),
  (13, '202511', 20, 54000, 225600, 20, 91.0, 3, 0, 1, 60000);

-- SK텔레콤 (14) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes, trip_log_vehicle_count, avg_safe_score, maintenance_completed_count, accident_count, violation_count, violation_amount) VALUES
  (14, '202509', 40, 100000, 432000, 38, 88.0, 10, 4, 3, 250000),
  (14, '202510', 40, 105000, 441600, 39, 88.5, 9, 3, 2, 200000),
  (14, '202511', 40, 110000, 451200, 40, 89.0, 7, 2, 1, 150000);

-- 다인정공 (21) - 2025년 9월, 10월, 11월
INSERT INTO public.monthly_summary (cmny_id, year_month, vehicle_count, total_mileage_km, total_driving_minutes, trip_log_vehicle_count, avg_safe_score, maintenance_completed_count, accident_count, violation_count, violation_amount) VALUES
  (21, '202509', 10, 25000, 108000, 9, 82.0, 3, 2, 1, 120000),
  (21, '202510', 10, 26000, 111600, 10, 83.0, 2, 1, 1, 100000),
  (21, '202511', 10, 27000, 115200, 10, 84.0, 2, 1, 0, 80000);

-- 데이터 확인
SELECT 
  c.cmny_nm,
  ms.year_month,
  ms.vehicle_count,
  ms.total_mileage_km,
  ms.accident_count,
  ms.violation_amount
FROM public.monthly_summary ms
JOIN public.companies c ON ms.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, ms.year_month;

