"use client";

import { useState } from "react";

type Profile = {
  user_id: string;
  role: "admin" | "user";
  display_name: string | null;
  department: string | null;
  is_approved: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  initialProfiles: Profile[];
};

export default function UserManagementClient({ initialProfiles }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredProfiles = profiles.filter((profile) => {
    if (filter === "pending") return !profile.is_approved;
    if (filter === "approved") return profile.is_approved;
    return true;
  });

  const handleApprove = async (userId: string) => {
    try {
      setLoading(userId);

      // Admin API 호출
      const response = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          updates: { is_approved: true },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "승인 실패");
      }

      const { data } = await response.json();

      // 로컬 상태 업데이트
      setProfiles(
        profiles.map((p) =>
          p.user_id === userId
            ? { ...p, is_approved: true, approved_at: data.approved_at }
            : p,
        ),
      );

      alert("사용자가 승인되었습니다.");
    } catch (error) {
      console.error("승인 오류:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm("정말 승인을 취소하시겠습니까?")) return;

    try {
      setLoading(userId);

      // Admin API 호출
      const response = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          updates: { is_approved: false },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "승인 취소 실패");
      }

      setProfiles(
        profiles.map((p) =>
          p.user_id === userId
            ? { ...p, is_approved: false, approved_at: null }
            : p,
        ),
      );

      alert("승인이 취소되었습니다.");
    } catch (error) {
      console.error("승인 취소 오류:", error);
      alert("승인 취소 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "user",
  ) => {
    if (
      !confirm(
        `이 사용자의 권한을 ${newRole === "admin" ? "관리자" : "일반 사용자"}로 변경하시겠습니까?`,
      )
    )
      return;

    try {
      setLoading(userId);

      // Admin API 호출
      const response = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          updates: { role: newRole },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "권한 변경 실패");
      }

      setProfiles(
        profiles.map((p) =>
          p.user_id === userId ? { ...p, role: newRole } : p,
        ),
      );

      alert("권한이 변경되었습니다.");
    } catch (error) {
      console.error("권한 변경 오류:", error);
      alert("권한 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          전체 ({profiles.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          승인 대기 ({profiles.filter((p) => !p.is_approved).length})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "approved"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          승인됨 ({profiles.filter((p) => p.is_approved).length})
        </button>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                부서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                권한
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                승인 상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProfiles.map((profile) => (
              <tr key={profile.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {profile.display_name || "이름 없음"}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {profile.user_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {profile.department || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={profile.role}
                    onChange={(e) =>
                      handleRoleChange(
                        profile.user_id,
                        e.target.value as "admin" | "user",
                      )
                    }
                    disabled={loading === profile.user_id}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="user">일반 사용자</option>
                    <option value="admin">관리자</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {profile.is_approved ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      승인됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      대기중
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {profile.is_approved ? (
                    <button
                      onClick={() => handleReject(profile.user_id)}
                      disabled={loading === profile.user_id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      승인 취소
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(profile.user_id)}
                      disabled={loading === profile.user_id}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                    >
                      승인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">표시할 사용자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
