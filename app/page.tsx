import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 경우 로그인 페이지로
  if (!user) {
    redirect('/login');
  }

  // 프로필 조회 (디버깅 로그 추가)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_approved')
    .eq('user_id', user.id)
    .single();

  // 오류 로깅 (개발 환경에서만)
  if (profileError) {
    console.error('Profile 조회 오류:', profileError);
    console.log('User ID:', user.id);
  }

  // 프로필이 없으면 대기 화면으로 (트리거 실패 케이스)
  if (!profile) {
    console.warn('Profile이 존재하지 않습니다. 대기 화면으로 이동');
    redirect('/waiting-approval');
  }

  // Admin인 경우 승인 여부와 관계없이 Admin 페이지로
  if (profile.role === 'admin') {
    redirect('/admin/users');
  }

  // 일반 사용자: 승인되지 않은 경우 승인 대기 화면으로
  if (!profile.is_approved) {
    redirect('/waiting-approval');
  }

  // 승인된 일반 사용자는 리포트 선택 화면으로 (Phase 3+에서 구현)
  redirect('/report');
}
