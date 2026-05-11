import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/evaluation/get-session
 * Retourne la session active du user connecté + les 8 test_results
 * triés par test_order. 404 si aucune session.
 */
export async function GET() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const service = createServiceClient();

  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "No session" }, { status: 404 });
  }

  const { data: tests, error } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session, tests });
}
