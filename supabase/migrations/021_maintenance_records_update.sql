-- Phase 5: maintenance_records 테이블 재구성 (정비현황)

-- 1) ENUM 타입 생성 (정비 상태)
DO $$ BEGIN
  CREATE TYPE public.maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2) 기존 테이블 삭제
DROP TABLE IF EXISTS public.maintenance_records CASCADE;

-- 3) 정비현황 테이블 생성
CREATE TABLE public.maintenance_records (
  maintenance_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  
  -- 차량 정보
  vehicle_no TEXT NOT NULL, -- 차량번호
  vehicle_model TEXT, -- 모델 (차종)
  mileage_km NUMERIC(10,2) NOT NULL DEFAULT 0, -- 주행거리 (km)
  
  -- 정비 정보
  maintenance_type TEXT NOT NULL, -- 구분 (정비 유형: 기타정비, 정기점검, 긴급정비 등)
  check_in_date DATE NOT NULL, -- 입고일자
  check_out_date DATE, -- 출고일자
  
  -- 정비 상세
  service_product TEXT, -- 정비상품 (예: 스마트프리미엄(겨울), 표준정비상품, 온하정비 등)
  service_center TEXT, -- 정비소명 (예: CLS타이어(화성), (정비)가성점포 등)
  status TEXT NOT NULL DEFAULT '완료', -- 완료상태 (완료, 진행중, 예정, 취소)
  
  cost INTEGER DEFAULT 0, -- 비용 (원) - 선택 필드
  description TEXT, -- 정비 내용 상세 - 선택 필드
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) 인덱스 생성
CREATE INDEX maintenance_records_cmny_year_idx ON public.maintenance_records(cmny_id, year_month);
CREATE INDEX maintenance_records_vehicle_idx ON public.maintenance_records(vehicle_no, check_in_date DESC);
CREATE INDEX maintenance_records_type_idx ON public.maintenance_records(maintenance_type);
CREATE INDEX maintenance_records_status_idx ON public.maintenance_records(status);
CREATE INDEX maintenance_records_date_idx ON public.maintenance_records(check_in_date DESC);

-- 5) RLS 활성화
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- 6) RLS 정책: 승인된 사용자는 모든 정비 기록 조회 가능
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

-- 7) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 8) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_maintenance_records_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 9) 데이터 확인용 뷰 생성 (Top 20)
DROP VIEW IF EXISTS public.maintenance_records_top20;

CREATE VIEW public.maintenance_records_top20 AS
SELECT 
  mr.maintenance_id,
  mr.cmny_id,
  c.cmny_nm,
  mr.year_month,
  mr.maintenance_type,
  mr.vehicle_no,
  mr.vehicle_model,
  mr.mileage_km,
  mr.check_in_date,
  mr.check_out_date,
  mr.service_product,
  mr.service_center,
  mr.status,
  mr.created_at,
  mr.updated_at,
  RANK() OVER (PARTITION BY mr.cmny_id, mr.year_month ORDER BY mr.check_in_date DESC) as rank
FROM public.maintenance_records mr
JOIN public.companies c ON mr.cmny_id = c.cmny_id;

