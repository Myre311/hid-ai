import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";

/**
 * DELETE /api/admin/admins/[id]
 * Retire un admin (super_admin only). Empêche de se retirer soi-même.
 */
export async function DELETE(request, { params }) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  if (guard.role !== "super_admin") {
    return NextResponse.json({ error: "Super-admin requis" }, { status: 403 });
  }

  const { service, user } = guard;

  const { data: target } = await service
    .from("admin_users")
    .select("id, user_id, email, role")
    .eq("id", params.id)
    .maybeSingle();
  if (!target) {
    return NextResponse.json({ error: "Admin introuvable" }, { status: 404 });
  }
  if (target.user_id === user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas vous retirer vous-même." },
      { status: 400 }
    );
  }

  const { error } = await service.from("admin_users").delete().eq("id", target.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction({
    service,
    admin: { id: user.id, email: user.email },
    action: "admin.remove",
    targetType: "admin_user",
    targetId: target.id,
    targetLabel: target.email,
    metadata: { role: target.role },
  });

  return NextResponse.json({ ok: true });
}
