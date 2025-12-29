-- Phase 5: utilization_vehicle 테이블에 주행거리 데이터 추가

-- SK렌터카 (cmny_id = 153) - 주행거리 업데이트
UPDATE public.utilization_vehicle 
SET mileage_km = CASE vehicle_no
  -- 2025년 9월
  WHEN '223허3005' AND year_month = '202509' THEN 1850.5
  WHEN '23누7436' AND year_month = '202509' THEN 1420.3
  WHEN '223허5978' AND year_month = '202509' THEN 1165.8
  WHEN '190허5645' AND year_month = '202509' THEN 1890.2
  WHEN '223허5990' AND year_month = '202509' THEN 2250.7
  WHEN '223허5991' AND year_month = '202509' THEN 2015.4
  WHEN '223허5982' AND year_month = '202509' THEN 1680.9
  WHEN '223허5973' AND year_month = '202509' THEN 1260.5
  WHEN '223허5975' AND year_month = '202509' THEN 840.2
  WHEN '223허5977' AND year_month = '202509' THEN 2350.8
  WHEN '27누1848' AND year_month = '202509' THEN 1175.6
  WHEN '223허3015' AND year_month = '202509' THEN 840.3
  WHEN '191허2189' AND year_month = '202509' THEN 2520.4
  WHEN '223허3001' AND year_month = '202509' THEN 1930.5
  WHEN '92나7850' AND year_month = '202509' THEN 1680.6
  
  -- 2025년 10월
  WHEN '223허3005' AND year_month = '202510' THEN 1880.7
  WHEN '23누7436' AND year_month = '202510' THEN 1465.8
  WHEN '223허5978' AND year_month = '202510' THEN 1195.2
  WHEN '190허5645' AND year_month = '202510' THEN 1955.3
  WHEN '223허5990' AND year_month = '202510' THEN 2315.9
  WHEN '223허5991' AND year_month = '202510' THEN 2055.6
  WHEN '223허5982' AND year_month = '202510' THEN 1730.4
  WHEN '223허5973' AND year_month = '202510' THEN 1305.7
  WHEN '223허5975' AND year_month = '202510' THEN 883.5
  WHEN '223허5977' AND year_month = '202510' THEN 2388.9
  WHEN '27누1848' AND year_month = '202510' THEN 1208.2
  WHEN '223허3015' AND year_month = '202510' THEN 875.4
  WHEN '191허2189' AND year_month = '202510' THEN 2555.8
  WHEN '223허3001' AND year_month = '202510' THEN 1968.7
  WHEN '92나7850' AND year_month = '202510' THEN 1723.5
  
  -- 2025년 11월
  WHEN '223허3005' AND year_month = '202511' THEN 227.0  -- 이미지 데이터 (30341 - 30114)
  WHEN '23누7436' AND year_month = '202511' THEN 378.0   -- 15378 - 15000
  WHEN '223허5978' AND year_month = '202511' THEN 425.0  -- 28425 - 28000
  WHEN '190허5645' AND year_month = '202511' THEN 1970.5
  WHEN '223허5990' AND year_month = '202511' THEN 2370.8
  WHEN '223허5991' AND year_month = '202511' THEN 2100.3
  WHEN '223허5982' AND year_month = '202511' THEN 1785.6
  WHEN '223허5973' AND year_month = '202511' THEN 1347.8
  WHEN '223허5975' AND year_month = '202511' THEN 927.4
  WHEN '223허5977' AND year_month = '202511' THEN 2432.5
  WHEN '27누1848' AND year_month = '202511' THEN 1242.7
  WHEN '223허3015' AND year_month = '202511' THEN 910.2
  WHEN '191허2189' AND year_month = '202511' THEN 2590.4
  WHEN '223허3001' AND year_month = '202511' THEN 2003.8
  WHEN '92나7850' AND year_month = '202511' THEN 1767.9
  ELSE mileage_km
END
WHERE cmny_id = 153;

-- SK하이닉스 (cmny_id = 10) - 주행거리 업데이트
UPDATE public.utilization_vehicle 
SET mileage_km = CASE 
  -- 2025년 9월
  WHEN vehicle_no = '67하8901' AND year_month = '202509' THEN 3200.5
  WHEN vehicle_no = '78하9012' AND year_month = '202509' THEN 3150.8
  WHEN vehicle_no = '89하0123' AND year_month = '202509' THEN 2980.3
  WHEN vehicle_no = '90호1234' AND year_month = '202509' THEN 2750.6
  WHEN vehicle_no = '01호2345' AND year_month = '202509' THEN 2520.4
  
  -- 2025년 10월
  WHEN vehicle_no = '67하8901' AND year_month = '202510' THEN 3350.7
  WHEN vehicle_no = '78하9012' AND year_month = '202510' THEN 3280.9
  WHEN vehicle_no = '89하0123' AND year_month = '202510' THEN 3120.5
  WHEN vehicle_no = '90호1234' AND year_month = '202510' THEN 2890.8
  WHEN vehicle_no = '01호2345' AND year_month = '202510' THEN 2650.6
  
  -- 2025년 11월
  WHEN vehicle_no = '67하8901' AND year_month = '202511' THEN 825.0  -- 42825 - 42000 (7일 운행)
  WHEN vehicle_no = '78하9012' AND year_month = '202511' THEN 3420.4
  WHEN vehicle_no = '89하0123' AND year_month = '202511' THEN 3260.7
  WHEN vehicle_no = '90호1234' AND year_month = '202511' THEN 3030.5
  WHEN vehicle_no = '01호2345' AND year_month = '202511' THEN 2780.8
  ELSE mileage_km
END
WHERE cmny_id = 10;

-- 주식회사 락앤락 (cmny_id = 13) - 주행거리 업데이트
UPDATE public.utilization_vehicle 
SET mileage_km = CASE 
  -- 2025년 9월
  WHEN vehicle_no = '11허3456' AND year_month = '202509' THEN 3680.5
  WHEN vehicle_no = '22허4567' AND year_month = '202509' THEN 3450.8
  WHEN vehicle_no = '33하5678' AND year_month = '202509' THEN 3220.3
  WHEN vehicle_no = '44하6789' AND year_month = '202509' THEN 2990.6
  WHEN vehicle_no = '55하7890' AND year_month = '202509' THEN 2760.4
  
  -- 2025년 10월
  WHEN vehicle_no = '11허3456' AND year_month = '202510' THEN 3820.7
  WHEN vehicle_no = '22허4567' AND year_month = '202510' THEN 3590.9
  WHEN vehicle_no = '33하5678' AND year_month = '202510' THEN 3360.5
  WHEN vehicle_no = '44하6789' AND year_month = '202510' THEN 3130.8
  WHEN vehicle_no = '55하7890' AND year_month = '202510' THEN 2900.6
  
  -- 2025년 11월
  WHEN vehicle_no = '11허3456' AND year_month = '202511' THEN 780.0  -- 35780 - 35000 (7일 운행)
  WHEN vehicle_no = '22허4567' AND year_month = '202511' THEN 3730.4
  WHEN vehicle_no = '33하5678' AND year_month = '202511' THEN 3500.7
  WHEN vehicle_no = '44하6789' AND year_month = '202511' THEN 3270.5
  WHEN vehicle_no = '55하7890' AND year_month = '202511' THEN 3040.8
  ELSE mileage_km
END
WHERE cmny_id = 13;

-- SK텔레콤 (cmny_id = 14) - 주행거리 업데이트
UPDATE public.utilization_vehicle 
SET mileage_km = CASE 
  -- 2025년 9월
  WHEN vehicle_no = '55가7890' AND year_month = '202509' THEN 3820.5
  WHEN vehicle_no = '66나8901' AND year_month = '202509' THEN 3590.8
  WHEN vehicle_no = '77다9012' AND year_month = '202509' THEN 3360.3
  WHEN vehicle_no = '88라0123' AND year_month = '202509' THEN 3130.6
  
  -- 2025년 10월
  WHEN vehicle_no = '55가7890' AND year_month = '202510' THEN 3960.7
  WHEN vehicle_no = '66나8901' AND year_month = '202510' THEN 3730.9
  WHEN vehicle_no = '77다9012' AND year_month = '202510' THEN 3500.5
  WHEN vehicle_no = '88라0123' AND year_month = '202510' THEN 3270.8
  
  -- 2025년 11월
  WHEN vehicle_no = '55가7890' AND year_month = '202511' THEN 840.0  -- 58840 - 58000 (6일 운행)
  WHEN vehicle_no = '66나8901' AND year_month = '202511' THEN 3870.4
  WHEN vehicle_no = '77다9012' AND year_month = '202511' THEN 3640.7
  WHEN vehicle_no = '88라0123' AND year_month = '202511' THEN 3410.5
  ELSE mileage_km
END
WHERE cmny_id = 14;

-- 다인정공 (cmny_id = 21) - 주행거리 업데이트
UPDATE public.utilization_vehicle 
SET mileage_km = CASE 
  -- 2025년 9월
  WHEN vehicle_no = '99마1234' AND year_month = '202509' THEN 3540.5
  WHEN vehicle_no = '00바2345' AND year_month = '202509' THEN 3310.8
  
  -- 2025년 10월
  WHEN vehicle_no = '99마1234' AND year_month = '202510' THEN 3680.7
  WHEN vehicle_no = '00바2345' AND year_month = '202510' THEN 3450.9
  
  -- 2025년 11월
  WHEN vehicle_no = '99마1234' AND year_month = '202511' THEN 650.0  -- 72650 - 72000 (7일 운행)
  WHEN vehicle_no = '00바2345' AND year_month = '202511' THEN 3590.4
  ELSE mileage_km
END
WHERE cmny_id = 21;

-- 데이터 확인 (2025년 11월, 주행거리 Top 5)
SELECT 
  c.cmny_nm as "고객사명",
  uv.vehicle_no as "차량번호",
  uv.vehicle_model as "차종",
  uv.mileage_km as "주행거리(km)",
  uv.utilization_pct as "가동률(%)",
  uv.driving_minutes as "주행시간(분)"
FROM public.utilization_vehicle uv
JOIN public.companies c ON uv.cmny_id = c.cmny_id
WHERE uv.year_month = '202511'
ORDER BY uv.cmny_id, uv.mileage_km DESC;

-- 주행거리 기준 최고 차량 확인
SELECT 
  c.cmny_nm as "고객사명",
  uv.vehicle_no as "차량번호",
  uv.vehicle_model as "차종",
  uv.mileage_km as "주행거리(km)"
FROM public.utilization_vehicle uv
JOIN public.companies c ON uv.cmny_id = c.cmny_id
WHERE uv.year_month = '202511'
  AND uv.cmny_id IN (153, 10, 13, 14, 21)
ORDER BY uv.mileage_km DESC
LIMIT 10;

