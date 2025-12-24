import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "./components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // profiles 테이블에서 role 확인 (디버깅 로그 추가)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_approved, display_name, department")
    .eq("user_id", user.id)
    .single();

  // 오류 로깅
  if (profileError) {
    console.error("Admin Layout - Profile 조회 오류:", profileError);
    console.log("User ID:", user.id);
  }

  // admin이 아니거나 프로필이 없으면 접근 불가
  if (!profile || profile.role !== "admin") {
    console.log("Admin 접근 거부:", { profile, userId: user.id });
    redirect("/waiting-approval");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                스마트링크 월간 리포트 - 관리자
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.display_name || user.email}
                {profile?.department && ` · ${profile.department}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 */}
      <AdminNav />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
