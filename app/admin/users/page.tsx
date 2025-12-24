import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import UserManagementClient from "./UserManagementClient";

export default async function AdminUsersPage() {
  // 현재 사용자 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 현재 사용자가 admin인지 확인
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (currentUserProfile?.role !== "admin") {
    return <div>접근 권한이 없습니다.</div>;
  }

  // Admin이므로 service_role로 모든 프로필 조회
  const adminClient = createAdminClient();
  const { data: profiles, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("프로필 조회 오류:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
          <p className="text-sm text-gray-600 mt-1">
            사용자 승인 및 권한 관리를 할 수 있습니다
          </p>
        </div>
        <div className="text-sm text-gray-500">
          총{" "}
          <span className="font-semibold text-gray-900">
            {profiles?.length || 0}
          </span>
          명
        </div>
      </div>

      <UserManagementClient initialProfiles={profiles || []} />
    </div>
  );
}
