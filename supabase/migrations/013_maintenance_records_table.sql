-- Phase 5: maintenance_records 테이블 생성 (정비 현황)

-- 1) ENUM 타입 생성 (정비 상태)
DO $$ BEGIN
  CREATE TYPE public.maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2) 테이블 생성
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  maintenance_id BIGSERIAL PRIMARY KEY,
  cmny_id INTEGER NOT NULL REFERENCES public.companies(cmny_id) ON DELETE CASCADE,
  year_month CHAR(6) NOT NULL, -- 'YYYYMM' 형식
  vehicle_no TEXT NOT NULL, -- 차량번호
  
  maintenance_date DATE NOT NULL, -- 정비 일자
  maintenance_type TEXT NOT NULL, -- 정비 유형 (정기점검, 엔진오일, 타이어교체, 브레이크, 기타)
  description TEXT, -- 정비 내용
  cost INTEGER NOT NULL DEFAULT 0, -- 비용 (원)
  status maintenance_status NOT NULL DEFAULT 'completed', -- 상태
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) 인덱스 생성
CREATE INDEX maintenance_records_cmny_year_idx ON public.maintenance_records(cmny_id, year_month);
CREATE INDEX maintenance_records_vehicle_idx ON public.maintenance_records(vehicle_no, maintenance_date DESC);
CREATE INDEX maintenance_records_type_idx ON public.maintenance_records(maintenance_type);

-- 4) RLS 활성화
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

-- 5) RLS 정책: 승인된 사용자는 모든 정비 기록 조회 가능
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

-- 6) RLS 정책: Admin만 생성/수정/삭제 가능
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

-- 7) updated_at 자동 업데이트 트리거
CREATE TRIGGER set_maintenance_records_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

