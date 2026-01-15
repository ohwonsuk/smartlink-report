-- Phase 5: CSV 업로드 시 UPSERT 정합성을 위한 유니크 제약 조건 추가

-- 기존 중복 데이터 정리 (중복 데이터가 있으면 제약 조건 추가가 실패함)

-- 1) driving_logs 중복 제거 (odometer_start 포함)
DELETE FROM public.driving_logs a
USING public.driving_logs b
WHERE a.log_id < b.log_id
  AND a.cmny_id = b.cmny_id
  AND a.vehicle_no = b.vehicle_no
  AND a.log_date = b.log_date
  AND a.odometer_start = b.odometer_start;

ALTER TABLE public.driving_logs 
ADD CONSTRAINT driving_logs_unique_key UNIQUE (cmny_id, vehicle_no, log_date, odometer_start);


-- 2) maintenance_records 중복 제거
DELETE FROM public.maintenance_records a
USING public.maintenance_records b
WHERE a.maintenance_id < b.maintenance_id
  AND a.cmny_id = b.cmny_id
  AND a.vehicle_no = b.vehicle_no
  AND a.check_in_date = b.check_in_date
  AND a.maintenance_type = b.maintenance_type;

ALTER TABLE public.maintenance_records 
ADD CONSTRAINT maintenance_records_unique_key UNIQUE (cmny_id, vehicle_no, check_in_date, maintenance_type);

-- 3) accidents 중복 제거
DELETE FROM public.accidents a
USING public.accidents b
WHERE a.accident_id < b.accident_id
  AND a.cmny_id = b.cmny_id
  AND a.vehicle_no = b.vehicle_no
  AND a.accident_datetime = b.accident_datetime;

ALTER TABLE public.accidents 
ADD CONSTRAINT accidents_unique_key UNIQUE (cmny_id, vehicle_no, accident_datetime);

-- 4) violations 중복 제거
DELETE FROM public.violations a
USING public.violations b
WHERE a.violation_id < b.violation_id
  AND a.cmny_id = b.cmny_id
  AND a.vehicle_no = b.vehicle_no
  AND a.violation_datetime = b.violation_datetime;

ALTER TABLE public.violations 
ADD CONSTRAINT violations_unique_key UNIQUE (cmny_id, vehicle_no, violation_datetime);

