-- Phase 5: 샘플 데이터 - utilization_vehicle 업데이트

-- 기존 데이터 삭제
DELETE FROM public.utilization_vehicle WHERE cmny_id IN (1001, 1002, 1003);

-- SK하이닉스 (153) - 2025년 11월 (Top 5)
INSERT INTO public.utilization_vehicle (cmny_id, year_month, vehicle_no, driving_minutes, utilization_pct) VALUES
  (153, '202511', '12가3456', 5800, 80.56),
  (153, '202511', '23나4567', 5500, 76.39),
  (153, '202511', '34다5678', 5200, 72.22),
  (153, '202511', '45라6789', 4900, 68.06),
  (153, '202511', '56마7890', 4600, 63.89);

-- SK렌터카 (10) - 2025년 11월 (Top 5)
INSERT INTO public.utilization_vehicle (cmny_id, year_month, vehicle_no, driving_minutes, utilization_pct) VALUES
  (10, '202511', '67바8901', 5200, 72.22),
  (10, '202511', '78사9012', 4900, 68.06),
  (10, '202511', '89아0123', 4600, 63.89),
  (10, '202511', '90자1234', 4300, 59.72),
  (10, '202511', '01차2345', 4000, 55.56);

-- 주식회사 락앤락 (13) - 2025년 11월 (Top 4)
INSERT INTO public.utilization_vehicle (cmny_id, year_month, vehicle_no, driving_minutes, utilization_pct) VALUES
  (13, '202511', '11카3456', 5600, 77.78),
  (13, '202511', '22타4567', 5300, 73.61),
  (13, '202511', '33파5678', 5000, 69.44),
  (13, '202511', '44하6789', 4700, 65.28);

-- SK텔레콤 (14) - 2025년 11월 (Top 4)
INSERT INTO public.utilization_vehicle (cmny_id, year_month, vehicle_no, driving_minutes, utilization_pct) VALUES
  (14, '202511', '55가7890', 5400, 75.00),
  (14, '202511', '66나8901', 5100, 70.83),
  (14, '202511', '77다9012', 4800, 66.67),
  (14, '202511', '88라0123', 4500, 62.50);

-- 다인정공 (21) - 2025년 11월 (Top 2)
INSERT INTO public.utilization_vehicle (cmny_id, year_month, vehicle_no, driving_minutes, utilization_pct) VALUES
  (21, '202511', '99마1234', 5000, 69.44),
  (21, '202511', '00바2345', 4700, 65.28);

-- 데이터 확인
SELECT 
  c.cmny_nm,
  uv.vehicle_no,
  uv.utilization_pct,
  (uv.utilization_pct * 3) as utilization_8h
FROM public.utilization_vehicle uv
JOIN public.companies c ON uv.cmny_id = c.cmny_id
WHERE uv.year_month = '202511'
ORDER BY c.cmny_nm, uv.utilization_pct DESC;

