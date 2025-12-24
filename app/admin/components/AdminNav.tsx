"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "사용자 관리", href: "/admin/users", icon: "👥" },
  { name: "CSV 업로드", href: "/admin/upload", icon: "📤", disabled: true },
  { name: "대시보드", href: "/admin", icon: "📊", disabled: true },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isDisabled = item.disabled;

              return (
                <Link
                  key={item.href}
                  href={isDisabled ? "#" : item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={(e) => {
                    if (isDisabled) e.preventDefault();
                  }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                  {isDisabled && (
                    <span className="ml-2 text-xs text-gray-400">
                      (Phase 6+)
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
