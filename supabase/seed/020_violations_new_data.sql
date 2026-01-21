-- Phase 5: 벌칙금 샘플 데이터
-- 신규 스키마 반영

-- 기존 데이터 삭제
DELETE FROM public.violations;

-- SK렌터카 (cmny_id = 153) - 2025년 12월
INSERT INTO public.violations 
  (cmny_id, year_month, department, driver_name, vehicle_no,
   violation_date_time, notice_type, fine_amount, detail_info,
   authority, location, payment_due_date,
   is_transferred, transfer_date, is_paid, payment_date) 
VALUES
  (153, '202512', '영업1팀', '김민수', '190허5374', 
   '2025-12-19 15:20:00', '위반사실통지서', 32000, '[SK렌터카] 주정차위반 과태료',
   '부산광역시 해운대구', '슈노벨오피스텔삼거리', '2026-01-12',
   'N', NULL, 'N', NULL),
  
  (153, '202512', '영업2팀', '이영희', '191허2184', 
   '2025-12-24 16:46:00', '위반사실통지서', 32000, '[SK렌터카] 주정차위반 과태료',
   '경기도 김포시', '고촌읍 한양수자인 후문', '2026-01-22',
   'N', NULL, 'N', NULL),
  
  (153, '202512', '물류팀', '박지훈', '191허6256', 
   '2025-12-24 13:55:00', '위반사실통지서', 32000, '[SK렌터카] 1속도위반 (20km/H이하)',
   '신안경찰서', '인천광역시 중구 하늘로 (운서동) 인근', '2026-02-01',
   'N', NULL, 'N', NULL),
  
  (153, '202512', '기획팀', '최수진', '191허9957', 
   '2025-12-07 07:21:00', '위반사실통지서', 2700, '[SK렌터카] 미납통행료',
   '서울터널(신월여의지하도로)', '서울터널', NULL,
   'N', NULL, 'N', NULL),
  
  (153, '202512', '영업3팀', '정민호', '223허3005', 
   '2025-12-05 10:30:00', '과태료납부통지서', 60000, '[SK렌터카] 신호위반 과태료',
   '수원시 영통구', '영통대로 광교사거리', '2026-01-05',
   'N', NULL, 'Y', '2025-12-28');

-- 데이터 확인
SELECT 
  c.cmny_nm as "고객사명",
  v.department as "소속",
  v.driver_name as "운전자명",
  v.vehicle_no as "차량번호",
  TO_CHAR(v.violation_date_time, 'YYYY-MM-DD HH24:MI') as "위반일시",
  v.notice_type as "고지서유형",
  v.fine_amount as "벌칙금",
  v.detail_info as "세부내용",
  v.authority as "관할관청",
  v.location as "위반장소",
  v.payment_due_date as "납부기한",
  v.is_transferred as "이관여부",
  v.transfer_date as "이관일",
  v.is_paid as "납부여부",
  v.payment_date as "납부일"
FROM public.violations v
JOIN public.companies c ON v.cmny_id = c.cmny_id
WHERE v.year_month = '202512'
ORDER BY v.violation_date_time DESC;
