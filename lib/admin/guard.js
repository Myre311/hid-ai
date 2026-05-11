import { createClient, createServiceClient } from "@/lib/supabase/server";

/**
 * Vérifie que l'utilisateur courant est dans admin_users.
 * Renvoie { ok: true, user, role } ou { ok: false, status, error }.
 */
export async function requireAdmin() {
  const userClient = createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "Not authenticated" };

  const service = createServiceClient();
  const { data: adminRow } = await service
    .from("admin_users")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return { ok: false, status: 403, error: "Admin required" };

  return { ok: true, user, role: adminRow.role, service };
}
