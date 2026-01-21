-- Phase 5: 정비현황 샘플 데이터
-- 신규 스키마 반영 (구분 필드 추가)

-- 기존 데이터 삭제
DELETE FROM public.maintenance_records;

-- SK렌터카 (cmny_id = 153) - 2025년 12월
INSERT INTO public.maintenance_records 
  (cmny_id, year_month, maintenance_type, vehicle_no, vehicle_model, current_mileage, 
   check_in_date, check_out_date, service_product, service_center, 
   center_phone, technician_name, status) 
VALUES
  (153, '202512', '기타정비', '192허9352', '카니발', 53639, '2025-12-25', '2025-12-25', '엔진오일 교환', '온하정비', '010-1111-2222', '김철수', '완료'),
  (153, '202512', '기타정비', '223허3008', 'K8', 6748, '2025-12-23', '2025-12-25', '스마트프리미엄(겨울)', 'CLS타이어(화성)', '031-123-4567', '이영희', '완료'),
  (153, '202512', '기타정비', '305러7602', '그랜저', 5320, '2025-12-18', '2025-12-18', '표준정비상품', 'CLS타이어(화성)', '031-123-4567', '박민수', '완료'),
  (153, '202512', '기타정비', '190허6895', '이퀴녹스', 16344, '2025-12-10', '2025-12-10', '브레이크 패드', 'CLS타이어(화성)', '031-123-4567', '최지훈', '완료'),
  (153, '202512', '기타정비', '191허6079', 'QM6', 44945, '2025-12-28', '2025-12-28', '와이퍼 교체', '서부점', '02-999-8888', '강동원', '완료'),
  (153, '202512', '기타정비', '230호7178', '쏘나타', 4725, '2025-12-26', '2025-12-26', '스마트프리미엄(분기)', '(정비)가성점포', '010-5555-6666', '한지민', '완료');

-- 데이터 확인
SELECT 
  c.cmny_nm as "고객사명",
  mr.maintenance_type as "구분",
  mr.vehicle_no as "차량번호",
  mr.vehicle_model as "차종",
  mr.current_mileage as "주행거리",
  mr.check_in_date as "입고일자",
  mr.check_out_date as "출고일자",
  mr.service_product as "정비상품",
  mr.service_center as "정비소명",
  mr.center_phone as "정비소연락처",
  mr.technician_name as "정비담당자",
  mr.status as "완료상태"
FROM public.maintenance_records mr
JOIN public.companies c ON mr.cmny_id = c.cmny_id
WHERE mr.year_month = '202512'
ORDER BY mr.check_in_date DESC;
