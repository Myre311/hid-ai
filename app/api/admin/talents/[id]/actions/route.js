import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";

/**
 * POST /api/admin/talents/[id]/actions
 * Body : { action: "suspend" | "reactivate" | "reset_session" | "activate_manual" | "resend_email" }
 *
 *  - suspend         : account_status='suspended', clôt la session active
 *  - reactivate      : account_status='active'
 *  - reset_session   : supprime la session active + tous les test_results
 *                      → le candidat repassera tout
 *  - activate_manual : force session.status='activated' avec ai_native_score recalculé
 *  - resend_email    : déclenche /api/email/send-activation pour cette session
 */
export async function POST(request, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { service, user } = guard;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const action = body?.action;
  const allowed = ["suspend", "reactivate", "reset_session", "activate_manual", "resend_email"];
  if (!allowed.includes(action)) {
    return NextResponse.json({ error: "action invalide" }, { status: 400 });
  }

  const { data: talent } = await service
    .from("inscriptions_talents")
    .select("id, email, prenom, nom")
    .eq("id", params.id)
    .maybeSingle();

  if (!talent) {
    return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
  }

  const targetLabel = `${talent.prenom} ${talent.nom} (${talent.email})`;
  const auditBase = {
    service,
    admin: { id: user.id, email: user.email },
    targetType: "talent",
    targetId: talent.id,
    targetLabel,
  };

  // Trouve la session active liée à l'inscription
  const { data: session } = await service
    .from("evaluation_sessions")
    .select("*")
    .eq("inscription_talent_id", talent.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  try {
    if (action === "suspend") {
      await service
        .from("inscriptions_talents")
        .update({ account_status: "suspended" })
        .eq("id", talent.id);
      await logAdminAction({ ...auditBase, action: "talent.account.suspend" });
      return NextResponse.json({ ok: true, account_status: "suspended" });
    }

    if (action === "reactivate") {
      await service
        .from("inscriptions_talents")
        .update({ account_status: "active" })
        .eq("id", talent.id);
      await logAdminAction({ ...auditBase, action: "talent.account.reactivate" });
      return NextResponse.json({ ok: true, account_status: "active" });
    }

    if (action === "reset_session") {
      if (!session) {
        return NextResponse.json({ error: "Pas de session à reset" }, { status: 404 });
      }
      // DELETE test_results + session
      await service.from("test_results").delete().eq("session_id", session.id);
      await service.from("evaluation_sessions").delete().eq("id", session.id);
      await logAdminAction({
        ...auditBase,
        action: "talent.session.reset",
        metadata: { previous_session_id: session.id },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "activate_manual") {
      if (!session) {
        return NextResponse.json({ error: "Pas de session à activer" }, { status: 404 });
      }
      // Recalcule le score AI-Native depuis les tests existants
      const { data: tests } = await service
        .from("test_results")
        .select("*")
        .eq("session_id", session.id);
      const { calculateAiNativeScore } = await import("@/lib/evaluation/aiNativeScore");
      const aiNativeScore = calculateAiNativeScore(tests || []);

      await service
        .from("evaluation_sessions")
        .update({
          status: "activated",
          ai_native_score: aiNativeScore,
          activated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      await logAdminAction({
        ...auditBase,
        action: "talent.activate.manual",
        metadata: { ai_native_score: aiNativeScore, tests_count: tests?.length || 0 },
      });
      return NextResponse.json({ ok: true, ai_native_score: aiNativeScore });
    }

    if (action === "resend_email") {
      if (!session) {
        return NextResponse.json({ error: "Pas de session" }, { status: 404 });
      }
      // Appelle /api/email/send-activation en interne
      const base = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      let sendResult = { ok: false };
      try {
        const r = await fetch(`${base}/api/email/send-activation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: session.user_id, session_id: session.id }),
        });
        sendResult = { ok: r.ok, status: r.status };
      } catch (err) {
        sendResult = { ok: false, error: err?.message };
      }
      await logAdminAction({
        ...auditBase,
        action: "talent.email.resend",
        metadata: sendResult,
      });
      return NextResponse.json({ ok: sendResult.ok, result: sendResult });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Action échouée" },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Action non gérée" }, { status: 400 });
}
