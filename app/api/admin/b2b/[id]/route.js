import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";

const ALLOWED_STATUSES = ["new", "contacted", "demo_scheduled", "won", "lost"];

/**
 * PATCH /api/admin/b2b/[id]
 * Body : { status }
 * Met à jour le statut d'une inscription B2B + trace dans l'audit log.
 */
export async function PATCH(request, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { status } = body || {};
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // On lit la valeur AVANT pour pouvoir tracer (status précédent → nouveau)
  const { data: before } = await guard.service
    .from("inscriptions_b2b")
    .select("id, raison_sociale, status, reference")
    .eq("id", params.id)
    .maybeSingle();

  if (!before) {
    return NextResponse.json({ error: "Inscription B2B introuvable" }, { status: 404 });
  }

  const { error } = await guard.service
    .from("inscriptions_b2b")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    service: guard.service,
    admin: { id: guard.user.id, email: guard.user.email },
    action: "b2b.status.change",
    targetType: "b2b",
    targetId: before.id,
    targetLabel: `${before.raison_sociale} (${before.reference})`,
    metadata: { from: before.status, to: status },
  });

  return NextResponse.json({ ok: true });
}
