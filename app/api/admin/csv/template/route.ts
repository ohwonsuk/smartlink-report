import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TEMPLATE_CONFIG: Record<string, { headers: string[]; samples: string[][] }> = {
  monthly_summary: {
    headers: [
      'cmny_id',
      'year_month',
      'vehicle_count',
      'total_mileage_km',
      'total_driving_minutes',
      'trip_log_vehicle_count',
      'avg_safe_score',
      'maintenance_completed_count',
      'accident_count',
      'violation_count',
      'violation_amount',
    ],
    samples: [
      ['1', '202512', '50', '12500.5', '15000', '45', '85.5', '5', '1', '2', '120000'],
      ['1', '202511', '48', '11800.0', '14200', '42', '82.0', '4', '0', '1', '60000'],
    ],
  },
  utilization_vehicle: {
    headers: ['cmny_id', 'year_month', 'vehicle_no', 'vehicle_model', 'driving_minutes', 'utilization_pct'],
    samples: [
      ['1', '202512', '12가3456', '그랜저', '1200', '85.5'],
      ['1', '202512', '78나9012', '아반떼', '1100', '78.2'],
    ],
  },
  monthly_mileage: {
    headers: [
      'cmny_id',
      'year_month',
      'vehicle_no',
      'vehicle_model',
      'monthly_trip_count',
      'monthly_driving_days',
      'monthly_total_mileage_km',
    ],
    samples: [
      ['1', '202512', '12가3456', '그랜저', '45', '22', '1500.5'],
      ['1', '202512', '78나9012', '아반떼', '38', '20', '1200.0'],
    ],
  },
  driving_logs: {
    headers: [
      'cmny_id',
      'year_month',
      'vehicle_no',
      'vehicle_model',
      'log_date',
      'department',
      'driver_name',
      'odometer_start',
      'odometer_end',
      'commute_km',
      'business_km',
      'note',
    ],
    samples: [
      ['1', '202512', '12가3456', '그랜저', '2025-12-01', '영업부', '홍길동', '10000', '10050', '10', '40', '거래처 방문'],
      ['1', '202512', '12가3456', '그랜저', '2025-12-02', '영업부', '홍길동', '10050', '10120', '10', '60', '지점 출판'],
    ],
  },
  safety_scores: {
    headers: [
      'cmny_id',
      'year_month',
      'driver_name',
      'department',
      'employee_no',
      'trip_count',
      'total_distance_km',
      'total_driving_minutes',
      'sudden_accel_count',
      'sudden_decel_count',
      'avg_overspeed_rate',
      'avg_safety_score',
    ],
    samples: [
      ['1', '202512', '홍길동', '영업부', 'EMP001', '45', '1500.5', '1800', '2', '1', '5.5', '92.5'],
      ['1', '202512', '김철수', '관리부', 'EMP002', '38', '1200.0', '1500', '0', '0', '2.0', '98.0'],
    ],
  },
  maintenance_records: {
    headers: [
      'year_month',
      'cmny_id',
      'vehicle_no',
      'vehicle_model',
      'current_mileage',
      'check_in_date',
      'check_out_date',
      'service_product',
      'service_center',
      'center_phone',
      'technician_name',
      'status',
    ],
    samples: [
      [
        '202512',
        '1',
        '12가3456',
        '그랜저',
        '15000',
        '2025-12-05',
        '2025-12-05',
        '엔진오일 교환',
        'SK네트웍스',
        '010-1234-5678',
        '홍길동',
        '완료',
      ],
    ],
  },
  accidents: {
    headers: [
      'year_month',
      'cmny_id',
      'department',
      'driver_name',
      'vehicle_no',
      'vehicle_model',
      'accident_type',
      'accident_category',
      'accident_date_time',
      'reception_date',
      'reception_no',
      'status',
      'completion_date',
      'deductible',
      'location',
    ],
    samples: [
      [
        '202512',
        '1',
        '영업부',
        '홍길동',
        '12가3456',
        '그랜저',
        '자차',
        '차대차',
        '2025-12-15 14:30:00',
        '2025-12-15',
        'ACC-2025-001',
        '사고접수',
        '2025-12-20',
        '300000',
        '서울 용산구',
      ],
    ],
  },
  violations: {
    headers: [
      'year_month',
      'cmny_id',
      'department',
      'driver_name',
      'vehicle_no',
      'violation_date_time',
      'notice_type',
      'fine_amount',
      'detail_info',
      'authority',
      'location',
      'payment_due_date',
      'is_transferred',
      'transfer_date',
      'is_paid',
      'payment_date',
    ],
    samples: [
      [
        '202512',
        '1',
        '영업부',
        '홍길동',
        '12가3456',
        '2025-12-10 10:20:00',
        '과태료납부통지서',
        '60000',
        '속도위반',
        '경찰청',
        '서울 종로구',
        '2026-01-10',
        'N',
        '',
        'Y',
        '2025-12-28',
      ],
    ],
  },
  companies: {
    headers: ['cmny_id', 'cmny_nm', 'biz_no'],
    samples: [
      ['153', 'SK렌터카', '1138132864'],
      ['10', 'SK하이닉스', '1268103725'],
      ['14', 'SK텔레콤', '1048137225'],
      ['13', '주식회사 락액락', '2148534765'],
      ['21', '다인정공', '1128136590'],
    ],
  },
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Admin 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const tableName = searchParams.get('tableName');

  if (!tableName || !TEMPLATE_CONFIG[tableName]) {
    return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
  }

  const { headers, samples } = TEMPLATE_CONFIG[tableName];

  // CSV 생성
  const csvContent = [
    headers.join(','),
    ...samples.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF';
  const response = new NextResponse(BOM + csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=template_${tableName}_sample.csv`,
    },
  });

  return response;
}
