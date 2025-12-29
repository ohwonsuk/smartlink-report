-- Phase 5: 샘플 데이터 - violations (범칙금) - 마스킹 대상

-- SK하이닉스 (153) - 11월 (5건)
INSERT INTO public.violations (cmny_id, year_month, vehicle_no, violation_date, violation_time, violation_type, location, driver_name, department, fine_amount, penalty_points, payment_status) VALUES
  (153, '202511', '12가3456', '2025-11-01', '14:25:00', '속도위반', '경부고속도로 147km', '김철수', '생산1팀', 60000, 15, 'paid'),
  (153, '202511', '23나4567', '2025-11-05', '08:50:00', '신호위반', '이천시 중리동 사거리', '이영희', '영업2팀', 60000, 15, 'paid'),
  (153, '202511', '34다5678', '2025-11-12', '17:30:00', '주정차위반', '수원시 영통구 봉영로', '박민수', '연구개발팀', 40000, 0, 'unpaid'),
  (153, '202511', '45라6789', '2025-11-18', '09:15:00', '속도위반', '영동고속도로 213km', '최정미', '구매팀', 80000, 30, 'paid'),
  (153, '202511', '56마7890', '2025-11-24', '16:40:00', '주정차위반', '청주시 흥덕구 가경로', '정현우', '생산2팀', 40000, 0, 'unpaid');

-- SK렌터카 (10) - 11월 (5건)
INSERT INTO public.violations (cmny_id, year_month, vehicle_no, violation_date, violation_time, violation_type, location, driver_name, department, fine_amount, penalty_points, payment_status) VALUES
  (10, '202511', '67바8901', '2025-11-02', '11:20:00', '속도위반', '서울외곽순환도로 78km', '강민호', '영업1팀', 60000, 15, 'paid'),
  (10, '202511', '78사9012', '2025-11-08', '15:45:00', '주정차위반', '인천 서구 백범로', '윤서연', '고객지원팀', 40000, 0, 'paid'),
  (10, '202511', '89아0123', '2025-11-14', '10:30:00', '신호위반', '부천시 원미구 중동대로', '송지훈', '관리팀', 60000, 15, 'unpaid'),
  (10, '202511', '90자1234', '2025-11-21', '13:55:00', '속도위반', '제2경인고속도로 23km', '한지우', '영업2팀', 80000, 30, 'paid'),
  (10, '202511', '01차2345', '2025-11-27', '17:10:00', '주정차위반', '강남구 테헤란로', '권수진', '마케팅팀', 80000, 0, 'overdue');

-- 주식회사 락앤락 (13) - 11월 (4건)
INSERT INTO public.violations (cmny_id, year_month, vehicle_no, violation_date, violation_time, violation_type, location, driver_name, department, fine_amount, penalty_points, payment_status) VALUES
  (13, '202511', '11카3456', '2025-11-04', '09:40:00', '속도위반', '서해안고속도로 134km', '조민준', '물류1팀', 60000, 15, 'paid'),
  (13, '202511', '22타4567', '2025-11-11', '14:25:00', '주정차위반', '평택시 포승읍', '배수아', '생산관리팀', 40000, 0, 'paid'),
  (13, '202511', '33파5678', '2025-11-17', '11:15:00', '신호위반', '김포시 김포대로', '임도현', '품질관리팀', 60000, 15, 'unpaid'),
  (13, '202511', '44하6789', '2025-11-23', '16:50:00', '속도위반', '인천 서구 봉수대로', '서하은', '수출팀', 100000, 60, 'paid');

-- SK텔레콤 (14) - 11월 (4건)
INSERT INTO public.violations (cmny_id, year_month, vehicle_no, violation_date, violation_time, violation_type, location, driver_name, department, fine_amount, penalty_points, payment_status) VALUES
  (14, '202511', '55가7890', '2025-11-03', '10:20:00', '속도위반', '경부고속도로 178km', '김태영', '네트워크운영팀', 80000, 30, 'paid'),
  (14, '202511', '66나8901', '2025-11-10', '13:35:00', '주정차위반', '분당구 판교역로', '이소영', '고객서비스팀', 40000, 0, 'paid'),
  (14, '202511', '77다9012', '2025-11-16', '15:40:00', '신호위반', '대전 유성구 대학로', '박준혁', '시스템관리팀', 60000, 15, 'unpaid'),
  (14, '202511', '88라0123', '2025-11-22', '09:25:00', '속도위반', '영동고속도로 267km', '최유진', '기획팀', 100000, 60, 'paid');

-- 다인정공 (21) - 11월 (2건)
INSERT INTO public.violations (cmny_id, year_month, vehicle_no, violation_date, violation_time, violation_type, location, driver_name, department, fine_amount, penalty_points, payment_status) VALUES
  (21, '202511', '99마1234', '2025-11-06', '14:15:00', '속도위반', '제3경인고속도로 45km', '오세훈', '생산팀', 60000, 15, 'paid'),
  (21, '202511', '00바2345', '2025-11-20', '11:30:00', '주정차위반', '시흥시 정왕동', '장민지', '자재팀', 40000, 0, 'unpaid');

-- 데이터 확인 (총 20건)
SELECT 
  c.cmny_nm,
  v.vehicle_no,
  v.violation_date,
  v.violation_type,
  v.driver_name,
  v.department,
  v.fine_amount,
  v.payment_status
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id
ORDER BY c.cmny_nm, v.violation_date DESC;

