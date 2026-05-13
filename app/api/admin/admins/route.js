import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { logAdminAction } from "@/lib/admin/audit";

/**
 * GET /api/admin/admins
 * Liste les admins (super_admin only).
 *
 * POST /api/admin/admins
 * Body : { email: string, role: "admin" | "super_admin" }
 * Crée un admin pour un user existant (par email) — super_admin only.
 */

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  if (guard.role !== "super_admin") {
    return NextResponse.json({ error: "Super-admin requis" }, { status: 403 });
  }

  const { data, error } = await guard.service
    .from("admin_users")
    .select("id, user_id, email, role, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data || [] });
}

export async function POST(request) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  if (guard.role !== "super_admin") {
    return NextResponse.json({ error: "Super-admin requis" }, { status: 403 });
  }

  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = String(body?.email || "").trim().toLowerCase();
  const role = body?.role === "super_admin" ? "super_admin" : "admin";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // Cherche le user existant dans auth.users
  const { service } = guard;
  const { data: list, error: listErr } = await service.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });
  const target = list?.users?.find((u) => u.email === email);
  if (!target) {
    return NextResponse.json(
      {
        error:
          "Aucun compte Supabase ne correspond à cet email. Le futur admin doit s'être connecté au moins une fois (création auth) avant d'être promu.",
      },
      { status: 404 }
    );
  }

  const { data, error } = await service
    .from("admin_users")
    .insert({ user_id: target.id, email, role })
    .select("id, user_id, email, role")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAdminAction({
    service,
    admin: { id: guard.user.id, email: guard.user.email },
    action: "admin.add",
    targetType: "admin_user",
    targetId: data.id,
    targetLabel: email,
    metadata: { role },
  });

  return NextResponse.json({ admin: data }, { status: 201 });
}
