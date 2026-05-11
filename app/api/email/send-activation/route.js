import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getResend, RESEND_FROM } from "@/lib/email/resend";
import { evaluationCompletedTemplate } from "@/lib/email/templates/evaluation-completed";

/**
 * POST /api/email/send-activation
 * Body : { user_id, session_id }
 *
 * Cette route est appelée par /api/evaluation/finalize en fire-and-forget.
 * Elle est aussi appelable manuellement (debug) ou en re-trigger.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_id, session_id } = body || {};
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const service = createServiceClient();

  // Récupère la session + tests
  const { data: session } = session_id
    ? await service
        .from("evaluation_sessions")
        .select("*")
        .eq("id", session_id)
        .maybeSingle()
    : await service
        .from("evaluation_sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: tests } = await service
    .from("test_results")
    .select("*")
    .eq("session_id", session.id)
    .order("test_order");

  // Inscription liée pour récupérer prénom + email + métier
  let inscription = null;
  if (session.inscription_talent_id) {
    const { data } = await service
      .from("inscriptions_talents")
      .select("prenom, nom, email, metier, reference")
      .eq("id", session.inscription_talent_id)
      .maybeSingle();
    inscription = data;
  }

  // Fallback : récupérer email depuis auth.users si pas d'inscription liée
  let toEmail = inscription?.email;
  if (!toEmail) {
    const { data: authUser } = await service.auth.admin.getUserById(user_id);
    toEmail = authUser?.user?.email;
  }

  if (!toEmail) {
    return NextResponse.json(
      { error: "No email found for user" },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://hid-ai.vercel.app";

  const { subject, html, text } = evaluationCompletedTemplate({
    firstName: inscription?.prenom || "Talent",
    metier: inscription?.metier || "specialist",
    aiNativeScore: session.ai_native_score ?? 0,
    testResults: tests || [],
    dashboardUrl: `${baseUrl}/dashboard`,
    reference: inscription?.reference || session.id.slice(0, 8),
  });

  let resendResult;
  try {
    const resend = getResend();
    resendResult = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      html,
      text,
    });
  } catch (err) {
    // Log dans email_logs et renvoie l'erreur sans planter la finalisation
    await service.from("email_logs").insert({
      user_id,
      session_id: session.id,
      template: "evaluation-completed",
      to_email: toEmail,
      status: "failed",
      error: String(err?.message || err),
    });
    return NextResponse.json(
      { error: "Email send failed", details: String(err?.message || err) },
      { status: 500 }
    );
  }

  await service.from("email_logs").insert({
    user_id,
    session_id: session.id,
    template: "evaluation-completed",
    to_email: toEmail,
    resend_id: resendResult?.data?.id || null,
    status: "sent",
  });

  return NextResponse.json({
    ok: true,
    to: toEmail,
    resend_id: resendResult?.data?.id || null,
  });
}
