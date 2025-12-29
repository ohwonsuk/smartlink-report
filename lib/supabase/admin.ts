// Admin용 Supabase 클라이언트 (service_role 사용)
// RLS를 우회하여 모든 데이터에 접근 가능

import { createClient } from "@supabase/supabase-js";

/**
 * Admin 전용 Supabase 클라이언트
 *
 * 주의: 이 클라이언트는 RLS를 우회하므로 서버 사이드에서만 사용해야 합니다.
 * 절대 브라우저에 노출되어서는 안 됩니다!
 *
 * 사용 예:
 * - Admin이 모든 사용자 프로필 조회
 * - Admin이 사용자 승인/권한 변경
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


