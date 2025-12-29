-- Phase 5: 벌칙금 샘플 데이터

-- 기존 데이터 삭제
DELETE FROM public.violations;

-- SK렌터카 (cmny_id = 153) - 2025년 11월
-- 이미지 데이터 참조
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_datetime, notice_type, fine_amount, detail_info,
   authority, violation_location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date,
   penalty_points, violation_type) 
VALUES
  -- 이미지 데이터 (6건)
  (153, '202511', '영업1팀', '김민수', '190허5374', 
   '2025-11-19 15:20:00', '위반사실통지서', 32000, '[SK렌터카] 주정차위반 과태료',
   '부산광역시 해운대구', '슈노벨오피스텔삼거리', '2025-12-12',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (153, '202511', '영업2팀', '이영희', '191허2184', 
   '2025-11-24 16:46:00', '위반사실통지서', 32000, '[SK렌터카] 주정차위반 과태료',
   '경기도 김포시', '고촌읍 한양수자인 후문', '2025-12-22',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (153, '202511', '물류팀', '박지훈', '191허6256', 
   '2025-11-24 13:55:00', '위반사실통지서', 32000, '[SK렌터카] 1속도위반 (20km/H이하)',
   '신안경찰서', '인천광역시 중구 하늘로 (운서동) 인근', '2026-01-01',
   FALSE, NULL, FALSE, NULL, 0, '속도위반'),
  
  (153, '202511', '기획팀', '최수진', '191허9957', 
   '2025-11-07 07:21:00', '위반사실통지서', 2700, '[SK렌터카] 미납통행료',
   '서울터널(신월여의지하도로)', '서울터널', NULL,
   FALSE, NULL, FALSE, NULL, 0, '미납통행료'),
  
  (153, '202511', '기획팀', '최수진', '191허9957', 
   '2025-11-14 15:13:00', '위반사실통지서', 900, '[SK렌터카] 미납통행료',
   '한국도로공사', '덕소삼패', NULL,
   FALSE, NULL, FALSE, NULL, 0, '미납통행료'),
  
  (153, '202511', '기획팀', '최수진', '191허9957', 
   '2025-11-14 15:09:00', '위반사실통지서', 900, '[SK렌터카] 미납통행료',
   '한국도로공사', '덕소삼패', NULL,
   FALSE, NULL, FALSE, NULL, 0, '미납통행료'),
  
  -- 추가 위반 데이터
  (153, '202511', '영업3팀', '정민호', '223허3005', 
   '2025-11-05 10:30:00', '과태료납부통지서', 60000, '[SK렌터카] 신호위반 과태료',
   '수원시 영통구', '영통대로 광교사거리', '2025-12-05',
   FALSE, NULL, TRUE, '2025-11-28', 15, '신호위반'),
  
  (153, '202511', '물류팀', '강서연', '23누7436', 
   '2025-11-12 14:25:00', '과태료납부통지서', 80000, '[SK렌터카] 속도위반 과태료 (20km/H초과)',
   '경기도경찰청', '경부고속도로 서울TG', '2025-12-12',
   FALSE, NULL, TRUE, '2025-12-05', 30, '속도위반'),
  
  (153, '202511', '영업1팀', '윤태호', '223허5978', 
   '2025-11-18 16:15:00', '위반사실통지서', 40000, '[SK렌터카] 주정차위반 과태료',
   '서울특별시 강남구', '테헤란로 선릉역 인근', '2025-12-18',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (153, '202511', '기획팀', '한지우', '190허5645', 
   '2025-11-22 09:50:00', '위반사실통지서', 60000, '[SK렌터카] 신호위반 과태료',
   '인천광역시 서구', '가좌동 사거리', '2025-12-22',
   FALSE, NULL, FALSE, NULL, 15, '신호위반');

-- SK하이닉스 (cmny_id = 10) - 2025년 11월
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_datetime, notice_type, fine_amount, detail_info,
   authority, violation_location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date,
   penalty_points, violation_type) 
VALUES
  (10, '202511', '생산1팀', '김철수', '67하8901', 
   '2025-11-03 11:20:00', '과태료납부통지서', 60000, '신호위반 과태료',
   '이천시', '이천공장 진입로 사거리', '2025-12-03',
   FALSE, NULL, TRUE, '2025-11-25', 15, '신호위반'),
  
  (10, '202511', '생산2팀', '박지훈', '78하9012', 
   '2025-11-10 15:45:00', '위반사실통지서', 40000, '주정차위반 과태료',
   '청주시 흥덕구', '청주공장 앞 도로', '2025-12-10',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (10, '202511', '품질팀', '이민수', '89하0123', 
   '2025-11-17 10:30:00', '과태료납부통지서', 80000, '속도위반 과태료 (20km/H초과)',
   '경기도경찰청', '영동고속도로 원주IC', '2025-12-17',
   FALSE, NULL, TRUE, '2025-12-10', 30, '속도위반'),
  
  (10, '202511', '생산3팀', '최영희', '90호1234', 
   '2025-11-24 13:55:00', '위반사실통지서', 32000, '주정차위반 과태료',
   '수원시 팔달구', '수원사업장 인근', '2025-12-24',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (10, '202511', '품질팀', '정수진', '01호2345', 
   '2025-11-28 09:15:00', '위반사실통지서', 1200, '미납통행료',
   '한국도로공사', '천안논산고속도로 천안IC', NULL,
   FALSE, NULL, FALSE, NULL, 0, '미납통행료');

-- 주식회사 락앤락 (cmny_id = 13) - 2025년 11월
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_datetime, notice_type, fine_amount, detail_info,
   authority, violation_location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date,
   penalty_points, violation_type) 
VALUES
  (13, '202511', '물류1팀', '최민수', '11허3456', 
   '2025-11-05 14:40:00', '과태료납부통지서', 60000, '신호위반 과태료',
   '김포시', '김포대로 사거리', '2025-12-05',
   FALSE, NULL, TRUE, '2025-11-28', 15, '신호위반'),
  
  (13, '202511', '영업팀', '이상호', '22허4567', 
   '2025-11-12 10:25:00', '위반사실통지서', 40000, '주정차위반 과태료',
   '평택시', '포승읍 삼성로', '2025-12-12',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (13, '202511', '물류2팀', '김영미', '33하5678', 
   '2025-11-19 16:15:00', '과태료납부통지서', 100000, '속도위반 과태료 (40km/H초과)',
   '인천광역시경찰청', '서해안고속도로 134km', '2025-12-19',
   FALSE, NULL, TRUE, '2025-12-12', 60, '속도위반'),
  
  (13, '202511', '수출팀', '박준영', '44하6789', 
   '2025-11-26 11:50:00', '위반사실통지서', 32000, '주정차위반 과태료',
   '인천광역시 중구', '인천항 제3부두', '2025-12-26',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반');

-- SK텔레콤 (cmny_id = 14) - 2025년 11월
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_datetime, notice_type, fine_amount, detail_info,
   authority, violation_location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date,
   penalty_points, violation_type) 
VALUES
  (14, '202511', 'IT운영팀', '정상훈', '55가7890', 
   '2025-11-04 10:20:00', '과태료납부통지서', 80000, '속도위반 과태료 (20km/H초과)',
   '경기도경찰청', '경부고속도로 178km', '2025-12-04',
   FALSE, NULL, TRUE, '2025-11-27', 30, '속도위반'),
  
  (14, '202511', '고객서비스팀', '김태영', '66나8901', 
   '2025-11-11 13:35:00', '위반사실통지서', 40000, '주정차위반 과태료',
   '성남시 분당구', '판교역로', '2025-12-11',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반'),
  
  (14, '202511', '시스템팀', '이재현', '77다9012', 
   '2025-11-18 15:40:00', '과태료납부통지서', 60000, '신호위반 과태료',
   '대전광역시 유성구', '대학로 사거리', '2025-12-18',
   FALSE, NULL, TRUE, '2025-12-11', 15, '신호위반'),
  
  (14, '202511', '기획팀', '박서연', '88라0123', 
   '2025-11-25 09:25:00', '과태료납부통지서', 100000, '속도위반 과태료 (40km/H초과)',
   '강원도경찰청', '영동고속도로 267km', '2025-12-25',
   FALSE, NULL, TRUE, '2025-12-18', 60, '속도위반');

-- 다인정공 (cmny_id = 21) - 2025년 11월
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_datetime, notice_type, fine_amount, detail_info,
   authority, violation_location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date,
   penalty_points, violation_type) 
VALUES
  (21, '202511', '생산팀', '강동원', '99마1234', 
   '2025-11-07 14:15:00', '과태료납부통지서', 60000, '속도위반 과태료 (20km/H이하)',
   '경기도경찰청', '제3경인고속도로 45km', '2025-12-07',
   FALSE, NULL, TRUE, '2025-11-30', 15, '속도위반'),
  
  (21, '202511', '자재팀', '이준호', '00바2345', 
   '2025-11-21 11:30:00', '위반사실통지서', 40000, '주정차위반 과태료',
   '시흥시', '정왕동', '2025-12-21',
   FALSE, NULL, FALSE, NULL, 0, '주정차위반');

-- 데이터 확인 (벌칙금)
SELECT 
  c.cmny_nm as "고객사명",
  v.department as "소속",
  v.driver_name as "운전자명",
  v.vehicle_no as "차량번호",
  TO_CHAR(v.violation_datetime, 'YYYY-MM-DD HH24:MI') as "위반일시",
  v.notice_type as "고지서유형",
  v.fine_amount as "벌칙금",
  COALESCE(v.detail_info, '') as "세부내용",
  v.authority as "관할관청",
  COALESCE(v.violation_location, '') as "위반장소",
  TO_CHAR(v.payment_due_date, 'YYYY-MM-DD') as "납부기한",
  CASE WHEN v.is_transferred THEN 'Y' ELSE 'N' END as "이관여부",
  COALESCE(TO_CHAR(v.transfer_date, 'YYYY-MM-DD'), 'N') as "이관일",
  CASE WHEN v.is_paid THEN 'Y' ELSE 'N' END as "납부여부",
  COALESCE(TO_CHAR(v.payment_date, 'YYYY-MM-DD'), 'N') as "납부일"
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id
WHERE v.year_month = '202511'
ORDER BY v.violation_datetime DESC;

-- SK렌터카 벌칙금 확인
SELECT 
  department as "소속",
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  TO_CHAR(violation_datetime, 'YYYY-MM-DD HH24:MI:SS') as "위반일시",
  notice_type as "고지서유형",
  fine_amount as "벌칙금",
  COALESCE(detail_info, '') as "세부내용",
  authority as "관할관청",
  COALESCE(violation_location, '') as "위반장소",
  TO_CHAR(payment_due_date, 'YYYY-MM-DD') as "납부기한",
  CASE WHEN is_transferred THEN 'Y' ELSE 'N' END as "이관여부",
  COALESCE(TO_CHAR(transfer_date, 'YYYY-MM-DD'), '') as "이관일",
  CASE WHEN is_paid THEN 'Y' ELSE 'N' END as "납부여부",
  COALESCE(TO_CHAR(payment_date, 'YYYY-MM-DD'), '') as "납부일"
FROM public.violations
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY violation_datetime DESC;

-- 벌칙금 합계
SELECT 
  c.cmny_nm as "고객사명",
  COUNT(*) as "건수",
  SUM(fine_amount) as "벌칙금 합계",
  SUM(CASE WHEN is_paid THEN fine_amount ELSE 0 END) as "납부금액",
  SUM(CASE WHEN NOT is_paid THEN fine_amount ELSE 0 END) as "미납금액"
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id
WHERE v.year_month = '202511'
GROUP BY c.cmny_nm
ORDER BY c.cmny_nm;

