import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 현황 파악을 위한 데이터 조회
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: companyCount } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true });

  const { data: recentUploads } = await supabase
    .from("raw_uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { name: "전체 사용자", value: userCount || 0, icon: "👥", href: "/admin/users" },
    { name: "등록 고객사", value: companyCount || 0, icon: "🏢", href: "/report" },
    { name: "최근 데이터 업로드", value: recentUploads?.length || 0, icon: "📤", href: "/admin/upload" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">관리자 대시보드</h2>
        <p className="text-sm text-gray-600 mt-1">시스템 현황 및 서비스 요약 정보입니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className="text-3xl grayscale opacity-50">{item.icon}</div>
            </div>
            <div className="mt-4 text-xs text-blue-600 font-medium flex items-center">
              자세히 보기 <span className="ml-1">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 업로드 현황 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">최근 데이터 업로드</h3>
            <Link href="/admin/upload" className="text-xs text-blue-600 hover:underline">
              전체보기
            </Link>
          </div>
          <div className="p-0">
            {recentUploads && recentUploads.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {recentUploads.map((upload) => (
                  <li key={upload.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{upload.filename}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{upload.table_name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          upload.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {upload.status === 'success' ? '성공' : '실패'}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 italic text-sm">
                업로드 내역이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 빠른 작업 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">빠른 작업</h3>
          <div className="space-y-3">
            <Link
              href="/admin/upload"
              className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xl mr-3 group-hover:scale-110 transition-transform">📤</span>
              <div>
                <p className="text-sm font-bold text-gray-800">새 데이터 업로드</p>
                <p className="text-xs text-gray-500">CSV 파일을 이용해 리포트 데이터를 업데이트합니다.</p>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xl mr-3 group-hover:scale-110 transition-transform">👥</span>
              <div>
                <p className="text-sm font-bold text-gray-800">사용자 승인 관리</p>
                <p className="text-xs text-gray-500">가입 신청한 사용자들을 검토하고 승인합니다.</p>
              </div>
            </Link>
            <Link
              href="/report"
              className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <span className="text-xl mr-3 group-hover:scale-110 transition-transform">📄</span>
              <div>
                <p className="text-sm font-bold text-gray-800">리포트 목록 조회</p>
                <p className="text-xs text-gray-500">고객사별 생성된 리포트를 확인하고 관리합니다.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
