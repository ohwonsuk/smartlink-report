-- Phase 5: 샘플 데이터 - driving_logs (운행일지)

-- SK하이닉스 (153) - 11월 1~2일 (5건)
INSERT INTO public.driving_logs (cmny_id, year_month, vehicle_no, log_date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose) VALUES
  (153, '202511', '12가3456', '2025-11-01', '08:30:00', '10:15:00', '본사', '이천공장', 85.5, '설비점검'),
  (153, '202511', '12가3456', '2025-11-01', '14:00:00', '16:30:00', '이천공장', '본사', 85.5, '업무복귀'),
  (153, '202511', '23나4567', '2025-11-01', '09:00:00', '11:20:00', '본사', '청주공장', 120.3, '자재운송'),
  (153, '202511', '23나4567', '2025-11-02', '13:30:00', '15:45:00', '청주공장', '본사', 118.7, '업무복귀'),
  (153, '202511', '34다5678', '2025-11-01', '07:45:00', '09:30:00', '본사', '수원사무소', 65.2, '회의참석');

-- SK렌터카 (10) - 11월 1~2일 (5건)
INSERT INTO public.driving_logs (cmny_id, year_month, vehicle_no, log_date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose) VALUES
  (10, '202511', '67바8901', '2025-11-01', '08:00:00', '10:00:00', '본사', '강남지점', 45.8, '영업미팅'),
  (10, '202511', '67바8901', '2025-11-01', '15:30:00', '17:00:00', '강남지점', '본사', 43.2, '업무복귀'),
  (10, '202511', '78사9012', '2025-11-01', '09:30:00', '11:15:00', '본사', '인천지점', 55.5, '차량점검'),
  (10, '202511', '78사9012', '2025-11-02', '14:00:00', '16:00:00', '인천지점', '본사', 57.3, '업무복귀'),
  (10, '202511', '89아0123', '2025-11-01', '10:00:00', '12:30:00', '본사', '부천지점', 38.9, '고객미팅');

-- 주식회사 락앤락 (13) - 11월 1~2일 (4건)
INSERT INTO public.driving_logs (cmny_id, year_month, vehicle_no, log_date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose) VALUES
  (13, '202511', '11카3456', '2025-11-01', '08:30:00', '10:45:00', '본사', '김포물류센터', 68.5, '재고확인'),
  (13, '202511', '11카3456', '2025-11-02', '09:00:00', '11:30:00', '본사', '평택공장', 95.8, '생산회의'),
  (13, '202511', '22타4567', '2025-11-01', '13:00:00', '15:00:00', '본사', '판교영업소', 42.3, '영업지원'),
  (13, '202511', '22타4567', '2025-11-02', '10:00:00', '12:00:00', '본사', '인천항', 55.7, '수출업무');

-- SK텔레콤 (14) - 11월 1~2일 (4건)
INSERT INTO public.driving_logs (cmny_id, year_month, vehicle_no, log_date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose) VALUES
  (14, '202511', '55가7890', '2025-11-01', '08:00:00', '10:30:00', '본사', '분당IDC', 78.4, '설비점검'),
  (14, '202511', '55가7890', '2025-11-02', '14:00:00', '16:30:00', '본사', '대전IDC', 135.6, '시스템점검'),
  (14, '202511', '66나8901', '2025-11-01', '09:30:00', '11:00:00', '본사', '강남지사', 32.8, '업무협의'),
  (14, '202511', '66나8901', '2025-11-02', '13:30:00', '15:45:00', '본사', '판교사옥', 48.9, '회의참석');

-- 다인정공 (21) - 11월 1~2일 (2건)
INSERT INTO public.driving_logs (cmny_id, year_month, vehicle_no, log_date, departure_time, arrival_time, departure_place, arrival_place, distance_km, purpose) VALUES
  (21, '202511', '99마1234', '2025-11-01', '07:30:00', '09:45:00', '본사', '안산공장', 65.8, '납품'),
  (21, '202511', '99마1234', '2025-11-02', '08:00:00', '10:30:00', '본사', '시흥물류센터', 52.4, '자재수령');

-- 데이터 확인 (총 20건)
SELECT 
  c.cmny_nm,
  dl.vehicle_no,
  dl.log_date,
  dl.departure_place,
  dl.arrival_place,
  dl.distance_km,
  dl.purpose
FROM public.driving_logs dl
JOIN public.companies c ON dl.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, dl.log_date, dl.departure_time;

