import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";

const ALLOWED_STATUSES = ["new", "contacted", "demo_scheduled", "won", "lost"];

/**
 * PATCH /api/admin/b2b/[id]
 * Body : { status }
 * Met à jour le statut d'une inscription B2B.
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

  const { error } = await guard.service
    .from("inscriptions_b2b")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
