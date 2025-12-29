-- Phase 5: 사고내역 샘플 데이터

-- 기존 데이터 삭제
DELETE FROM public.accidents;

-- SK렌터카 (cmny_id = 153) - 2025년 11월
-- 이미지 데이터 참조
INSERT INTO public.accidents 
  (cmny_id, year_month, department, driver_name, vehicle_no, vehicle_model,
   accident_category, accident_type, accident_datetime, accident_location,
   report_date, report_number, status, close_date, deductible, damage_cost, description) 
VALUES
  -- 이미지 데이터
  (153, '202511', '영업1팀', '김민수', '223허5990', '아반떼', '기타', '차대차', 
   '2025-11-04 15:00:00', NULL, '2025-11-05', 'A1234', '처리중', NULL, 0, 580000, 
   '교차로 좌회전 중 직진차량과 측면 충돌'),
  
  -- 추가 사고 데이터
  (153, '202511', '영업2팀', '이영희', '223허3005', 'K8', '자손', '단독', 
   '2025-11-08 09:30:00', '본사 지하주차장', '2025-11-08', 'A1235', '완료', '2025-11-10', 
   50000, 280000, '주차 중 기둥 접촉으로 사이드미러 파손'),
  
  (153, '202511', '물류팀', '박지훈', '23누7436', '아이오닉 6', '대물', '차대차', 
   '2025-11-12 14:20:00', '경부고속도로 서울TG', '2025-11-12', 'A1236', '완료', '2025-11-15', 
   0, 950000, '고속도로 정체구간 후미 추돌'),
  
  (153, '202511', '기획팀', '최수진', '223허5978', 'K8', '기타', '차대물', 
   '2025-11-15 16:45:00', '강남구 테헤란로', '2025-11-16', 'A1237', '처리중', NULL, 
   0, 420000, '좁은 골목 진입 중 벽면 스크래치'),
  
  (153, '202511', '영업3팀', '정민호', '190허5645', 'G80', '대물', '차대차', 
   '2025-11-18 11:10:00', '수원시 영통구', '2025-11-18', 'A1238', '완료', '2025-11-20', 
   0, 1150000, '신호대기 중 후방 추돌 당함'),
  
  (153, '202511', '물류팀', '강서연', '223허5990', 'K8', '자손', '단독', 
   '2025-11-20 08:30:00', '이천 물류센터', '2025-11-20', 'A1239', '종결', '2025-11-22', 
   30000, 180000, '적재작업 중 지게차와 접촉'),
  
  (153, '202511', '영업1팀', '윤태호', '27누1848', '아이오닉 6', '기타', '차대차', 
   '2025-11-22 13:50:00', '인천 서구 가좌동', '2025-11-23', 'A1240', '처리중', NULL, 
   0, 680000, '교차로 우회전 중 직진차량과 충돌'),
  
  (153, '202511', '기획팀', '한지우', '223허3015', 'K8', '대물', '차대물', 
   '2025-11-25 10:15:00', '분당구 판교역로', '2025-11-25', 'A1241', '완료', '2025-11-27', 
   0, 520000, '후진 중 주차된 차량 범퍼 손상'),
  
  (153, '202511', '영업2팀', '임도현', '191허2189', 'QM6', '자손', '단독', 
   '2025-11-27 15:20:00', '본사 주차장', '2025-11-27', 'A1242', '접수', NULL, 
   50000, 220000, '출차 중 기둥 충돌로 헤드라이트 파손'),
  
  (153, '202511', '물류팀', '서민지', '223허5982', 'K8', '기타', '차대차', 
   '2025-11-28 17:30:00', '안양시 동안구', '2025-11-29', 'A1243', '처리중', NULL, 
   0, 780000, '급정거로 인한 추돌사고');

-- SK하이닉스 (cmny_id = 10) - 2025년 11월
INSERT INTO public.accidents 
  (cmny_id, year_month, department, driver_name, vehicle_no, vehicle_model,
   accident_category, accident_type, accident_datetime, accident_location,
   report_date, report_number, status, close_date, deductible, damage_cost, description) 
VALUES
  (10, '202511', '생산1팀', '김철수', '67하8901', 'K5', '대물', '차대차', 
   '2025-11-03 10:15:00', '이천공장 진입로', '2025-11-03', 'H1001', '완료', '2025-11-06', 
   0, 850000, '교차로 진입 중 좌회전 차량과 충돌'),
  
  (10, '202511', '생산2팀', '박지훈', '78하9012', 'G70', '자손', '단독', 
   '2025-11-10 14:30:00', '청주공장 주차장', '2025-11-10', 'H1002', '완료', '2025-11-12', 
   50000, 320000, '주차 중 기둥 접촉'),
  
  (10, '202511', '품질팀', '이민수', '89하0123', '쏘렌토', '기타', '차대물', 
   '2025-11-17 09:40:00', '수원사업장', '2025-11-17', 'H1003', '처리중', NULL, 
   0, 480000, '후진 중 화물 적재대 충돌'),
  
  (10, '202511', '생산3팀', '최영희', '90호1234', 'K8', '대물', '차대차', 
   '2025-11-22 13:20:00', '영동고속도로 원주IC', '2025-11-22', 'H1004', '완료', '2025-11-25', 
   0, 1100000, '고속도로 차선변경 중 충돌'),
  
  (10, '202511', '품질팀', '정수진', '01호2345', '아이오닉 5', '자손', '단독', 
   '2025-11-28 17:05:00', '천안사업장', '2025-11-28', 'H1005', '접수', NULL, 
   30000, 280000, '빗길 미끄러짐으로 가드레일 충돌');

-- 주식회사 락앤락 (cmny_id = 13) - 2025년 11월
INSERT INTO public.accidents 
  (cmny_id, year_month, department, driver_name, vehicle_no, vehicle_model,
   accident_category, accident_type, accident_datetime, accident_location,
   report_date, report_number, status, close_date, deductible, damage_cost, description) 
VALUES
  (13, '202511', '물류1팀', '최민수', '11허3456', '그랜저', '자손', '단독', 
   '2025-11-05 11:25:00', '김포 물류센터', '2025-11-05', 'L3001', '완료', '2025-11-08', 
   50000, 220000, '적재작업 중 지게차와 접촉'),
  
  (13, '202511', '영업팀', '이상호', '22허4567', 'K7', '대물', '차대차', 
   '2025-11-12 14:50:00', '평택시 포승읍', '2025-11-12', 'L3002', '완료', '2025-11-15', 
   0, 780000, '급정거로 인한 추돌사고'),
  
  (13, '202511', '물류2팀', '김영미', '33하5678', 'SM6', '자손', '단독', 
   '2025-11-19 08:30:00', '본사 주차장', '2025-11-19', 'L3003', '종결', '2025-11-21', 
   30000, 150000, '출차 중 기둥 접촉'),
  
  (13, '202511', '수출팀', '박준영', '44하6789', '카니발', '기타', '차대물', 
   '2025-11-26 16:15:00', '인천항 제3부두', '2025-11-26', 'L3004', '처리중', NULL, 
   0, 890000, '컨테이너 작업 중 차량 손상');

-- SK텔레콤 (cmny_id = 14) - 2025년 11월
INSERT INTO public.accidents 
  (cmny_id, year_month, department, driver_name, vehicle_no, vehicle_model,
   accident_category, accident_type, accident_datetime, accident_location,
   report_date, report_number, status, close_date, deductible, damage_cost, description) 
VALUES
  (14, '202511', 'IT운영팀', '정상훈', '55가7890', 'G90', '대물', '차대차', 
   '2025-11-04 10:40:00', '분당구 판교역로', '2025-11-04', 'T4001', '완료', '2025-11-07', 
   0, 1050000, '교차로 진입 중 우회전 차량과 충돌'),
  
  (14, '202511', '고객서비스팀', '김태영', '66나8901', 'K9', '자손', '단독', 
   '2025-11-11 13:55:00', '강남지사 주차장', '2025-11-11', 'T4002', '완료', '2025-11-13', 
   50000, 380000, '주차 중 기둥 충돌'),
  
  (14, '202511', '시스템팀', '이재현', '77다9012', 'EV6', '대물', '차대차', 
   '2025-11-18 15:20:00', '대전 유성구', '2025-11-18', 'T4003', '완료', '2025-11-21', 
   0, 920000, '급제동으로 인한 추돌'),
  
  (14, '202511', '기획팀', '박서연', '88라0123', '팰리세이드', '자손', '단독', 
   '2025-11-24 09:10:00', '판교 사옥 지하주차장', '2025-11-24', 'T4004', '종결', '2025-11-26', 
   30000, 260000, '출차 중 벽면 스크래치');

-- 다인정공 (cmny_id = 21) - 2025년 11월
INSERT INTO public.accidents 
  (cmny_id, year_month, department, driver_name, vehicle_no, vehicle_model,
   accident_category, accident_type, accident_datetime, accident_location,
   report_date, report_number, status, close_date, deductible, damage_cost, description) 
VALUES
  (21, '202511', '생산팀', '강동원', '99마1234', '스타렉스', '대물', '차대차', 
   '2025-11-07 14:30:00', '안산시 단원구', '2025-11-07', 'D5001', '완료', '2025-11-10', 
   0, 720000, '후진 중 후방 차량과 충돌'),
  
  (21, '202511', '자재팀', '이준호', '00바2345', '봉고', '자손', '단독', 
   '2025-11-21 10:50:00', '시흥 물류센터', '2025-11-21', 'D5002', '완료', '2025-11-23', 
   50000, 340000, '적재작업 중 차량 손상');

-- 데이터 확인 (사고내역)
SELECT 
  c.cmny_nm as "고객사명",
  a.department as "소속",
  a.driver_name as "운전자명",
  a.vehicle_no as "차량번호",
  a.vehicle_model as "차종",
  a.accident_category as "사고구분",
  a.accident_type as "사고분류",
  TO_CHAR(a.accident_datetime, 'YYYY-MM-DD HH24:MI') as "사고일시",
  a.report_date as "접수일자",
  a.report_number as "접수번호",
  a.status as "처리상태",
  a.close_date as "종결일자",
  a.deductible as "면책금",
  COALESCE(a.accident_location, '') as "사고장소"
FROM public.accidents a
JOIN public.companies c ON a.cmny_id = c.cmny_id
WHERE a.year_month = '202511'
ORDER BY a.accident_datetime DESC;

-- SK렌터카 사고내역 확인
SELECT 
  department as "소속",
  driver_name as "운전자명",
  vehicle_no as "차량번호",
  vehicle_model as "차종",
  accident_category as "사고구분",
  accident_type as "사고분류",
  TO_CHAR(accident_datetime, 'YYYY-MM-DD HH24:MI') as "사고일시",
  report_date as "접수일자",
  report_number as "접수번호",
  status as "처리상태",
  close_date as "종결일자",
  deductible as "면책금",
  COALESCE(accident_location, '') as "사고장소"
FROM public.accidents
WHERE cmny_id = 153 
  AND year_month = '202511'
ORDER BY accident_datetime DESC;

