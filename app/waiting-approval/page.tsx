'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Profile = {
  display_name: string | null;
  email: string | null;
  department: string | null;
  is_approved: boolean;
  role: string;
};

export default function WaitingApprovalPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 프로필 조회
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, email, department, is_approved, role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('프로필 조회 오류:', error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);

      // 승인되었으면 리다이렉트
      if (data?.is_approved) {
        if (data.role === 'admin') {
          router.push('/admin/users');
        } else {
          router.push('/report');
        }
      }
    };

    checkProfile();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* 경고 아이콘 */}
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6">
            <svg
              className="h-12 w-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            관리자 승인 대기 중
          </h2>
          <p className="text-sm text-gray-600">
            계정이 관리자의 승인을 기다리고 있습니다. 승인 후 리포트에 접근할 수 있습니다.
          </p>
        </div>

        {/* 로그인 정보 */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-3">
          <h3 className="text-sm font-semibold text-blue-900">로그인 정보</h3>
          <div className="space-y-2 text-sm">
            {profile?.email && (
              <div className="flex items-start">
                <span className="font-medium text-blue-900 min-w-[60px]">이메일:</span>
                <span className="text-blue-700">{profile.email}</span>
              </div>
            )}
            {profile?.display_name && (
              <div className="flex items-start">
                <span className="font-medium text-blue-900 min-w-[60px]">이름:</span>
                <span className="text-blue-700">{profile.display_name}</span>
              </div>
            )}
            {profile?.department && (
              <div className="flex items-start">
                <span className="font-medium text-blue-900 min-w-[60px]">부서:</span>
                <span className="text-blue-700">{profile.department}</span>
              </div>
            )}
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">다음 단계</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>관리자에게 계정 승인을 요청하세요</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>승인 후 리포트 조회 기능을 이용하실 수 있습니다</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-full group relative flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          로그아웃
        </button>

        <p className="text-center text-xs text-gray-500">
          승인 관련 문의는 시스템 관리자에게 연락해주세요
        </p>
      </div>
    </div>
  );
}
