'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Profile = {
  role: string;
  is_approved: boolean;
  display_name: string | null;
  department: string | null;
  email: string | null;
};

export default function ReportNav({ profile }: { profile: Profile | null }) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* 좌측: 로고/타이틀 */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">스마트링크 월간리포트</h1>
          </div>

          {/* 우측: 사용자 정보 + 로그아웃 */}
          <div className="flex items-center space-x-4">
            {/* 사용자 정보 */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {profile?.display_name || '사용자'}
              </p>
              {profile?.department && (
                <p className="text-xs text-gray-500">{profile.department}</p>
              )}
            </div>

            {/* Admin 링크 */}
            {profile?.role === 'admin' && (
              <a
                href="/admin/users"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                관리자
              </a>
            )}

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}



