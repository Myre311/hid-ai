import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";

/**
 * POST /api/admin/talents/[id]/kyc
 * Body : { action: "approve" | "reject", reason?: string }
 *
 * Met à jour kyc_status + trace dans admin_audit_log.
 */
export async function POST(request, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { service, user, role } = guard;

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const action = body?.action;
  const reason = body?.reason?.toString().trim() || null;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action invalide" }, { status: 400 });
  }
  if (action === "reject" && (!reason || reason.length < 5)) {
    return NextResponse.json(
      { error: "Une raison de refus est requise (5 caractères minimum)." },
      { status: 400 }
    );
  }

  const newStatus = action === "approve" ? "approved" : "rejected";

  const { data: updated, error } = await service
    .from("inscriptions_talents")
    .update({
      kyc_status: newStatus,
      kyc_reviewed_at: new Date().toISOString(),
      kyc_reviewed_by: user.id,
      kyc_rejection_reason: action === "reject" ? reason : null,
    })
    .eq("id", params.id)
    .select("id, email, prenom, nom, kyc_status")
    .single();

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message || "Candidat introuvable" },
      { status: 404 }
    );
  }

  await logAdminAction({
    service,
    admin: { id: user.id, email: guard.user.email },
    action: `talent.kyc.${action}`,
    targetType: "talent",
    targetId: updated.id,
    targetLabel: `${updated.prenom} ${updated.nom} (${updated.email})`,
    metadata: action === "reject" ? { reason } : null,
  });

  return NextResponse.json({ ok: true, kyc_status: updated.kyc_status });
}
