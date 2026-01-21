-- Phase 5: maintenance_records 테이블 재구성 (정비현황)
-- 기존 테이블 및 뷰 삭제
DROP VIEW IF EXISTS public.maintenance_records_summary;
DROP TABLE IF EXISTS public.maintenance_records CASCADE;

-- 1) 정비현황 테이블 생성
CREATE TABLE public.maintenance_records (
  maintenance_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  maintenance_type TEXT NOT NULL, -- 구분 (필수 입력)
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT NOT NULL, -- 차종
  current_mileage INTEGER, -- 주행거리 (NULL 가능)
  
  -- 정비 정보
  check_in_date DATE NOT NULL, -- 입고일자
  check_out_date DATE, -- 출고일자 (NULL 가능)
  service_product TEXT, -- 정비상품 (NULL 가능)
  service_center TEXT NOT NULL, -- 정비소명
  center_phone TEXT, -- 정비소연락처 (NULL 가능)
  technician_name TEXT, -- 정비담당자 (NULL 가능)
  status TEXT, -- 완료상태 (NULL 가능)
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT maintenance_records_unique_entry UNIQUE (cmny_id, vehicle_no, check_in_date, service_center, maintenance_type)
);

-- 2) 인덱스 생성
CREATE INDEX maintenance_records_cmny_year_idx ON public.maintenance_records(cmny_id, year_month);
CREATE INDEX maintenance_records_vehicle_idx ON public.maintenance_records(vehicle_no, check_in_date DESC);
CREATE INDEX maintenance_records_status_idx ON public.maintenance_records(status);
CREATE INDEX maintenance_records_type_idx ON public.maintenance_records(maintenance_type);

-- 3) RLS 활성화
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- 4) RLS 정책: 승인된 사용자는 모든 정비 기록 조회 가능
CREATE POLICY "Approved users can view maintenance records"
  ON public.maintenance_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND is_approved = TRUE
    )
  );

-- 5) RLS 정책: Admin만 생성/수정/삭제 가능
CREATE POLICY "Admins can insert maintenance records"
  ON public.maintenance_records
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update maintenance records"
  ON public.maintenance_records
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete maintenance records"
  ON public.maintenance_records
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- 6) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_maintenance_records_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7) 데이터 확인용 뷰 생성
CREATE VIEW public.maintenance_records_summary AS
SELECT 
  mr.maintenance_id,
  mr.cmny_id,
  c.cmny_nm,
  mr.year_month,
  mr.maintenance_type,
  mr.vehicle_no,
  mr.vehicle_model,
  mr.current_mileage,
  mr.check_in_date,
  mr.check_out_date,
  mr.service_product,
  mr.service_center,
  mr.center_phone,
  mr.technician_name,
  mr.status,
  RANK() OVER (PARTITION BY mr.cmny_id, mr.year_month ORDER BY mr.check_in_date DESC) as rank
FROM public.maintenance_records mr
JOIN public.companies c ON mr.cmny_id = c.cmny_id;
