import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { calculateAiNativeScore } from "@/lib/evaluation/aiNativeScore";

/**
 * POST /api/evaluation/finalize
 *
 * Calcule le score AI-Native final à partir des 8 résultats, met à jour
 * la session (status=activated, ai_native_score), puis déclenche l'envoi
 * de l'email Resend en arrière-plan (non bloquant pour le candidat).
 *
 * Pré-condition : la session doit avoir tous ses 8 tests `completed` et
 * status = "completed" (mis en place par submit-test sur le dernier test).
 */
export async function POST() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const service = createServiceClient();

  // Charge la session
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

  if (session.status === "activated") {
    return NextResponse.json({
      message: "Already activated",
      session,
    });
  }

  // Charge les 8 tests
  const { data: tests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  const allCompleted =
    tests &&
    tests.length === 8 &&
    tests.every((t) => t.status === "completed");

  if (!allCompleted) {
    return NextResponse.json(
      { error: "All 8 tests must be completed before finalization" },
      { status: 400 }
    );
  }

  const aiNativeScore = calculateAiNativeScore(tests);

  await service
    .from("evaluation_sessions")
    .update({
      status: "activated",
      ai_native_score: aiNativeScore,
      activated_at: new Date().toISOString(),
    })
    .eq("id", session.id);

  // Déclenche l'email de confirmation en arrière-plan (non bloquant).
  // On utilise une URL absolue pour que le serverless puisse appeler son
  // propre endpoint /api/email/send-activation.
  // En cas d'absence de RESEND_API_KEY ou d'erreur, l'envoi se logge sans
  // faire échouer la finalisation.
  try {
    const base =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    // Fire-and-forget — on n'attend pas le résultat.
    fetch(`${base}/api/email/send-activation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, session_id: session.id }),
    }).catch(() => {});
  } catch {}

  return NextResponse.json({
    ai_native_score: aiNativeScore,
    session: { ...session, ai_native_score: aiNativeScore, status: "activated" },
  });
}
