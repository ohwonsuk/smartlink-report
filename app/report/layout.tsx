import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReportNav from './components/ReportNav';

export default async function ReportLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_approved, display_name, department, email')
    .eq('user_id', user.id)
    .single();

  // 승인되지 않은 사용자는 접근 불가
  if (!profile?.is_approved && profile?.role !== 'admin') {
    redirect('/waiting-approval');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <ReportNav profile={profile} />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

