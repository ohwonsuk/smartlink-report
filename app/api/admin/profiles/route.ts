// Admin API: 프로필 업데이트 (service_role 사용)

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // 현재 사용자 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin 권한 확인
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { user_id, updates } = body;

    if (!user_id || !updates) {
      return NextResponse.json({ error: "Missing user_id or updates" }, { status: 400 });
    }

    // Admin 클라이언트로 업데이트 (RLS 우회)
    const adminClient = createAdminClient();

    // approved_by 추가
    if (updates.is_approved === true) {
      updates.approved_by = user.id;
      updates.approved_at = new Date().toISOString();
    } else if (updates.is_approved === false) {
      updates.approved_by = null;
      updates.approved_at = null;
    }

    const { data, error } = await adminClient
      .from("profiles")
      .update(updates)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      console.error("프로필 업데이트 오류:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


