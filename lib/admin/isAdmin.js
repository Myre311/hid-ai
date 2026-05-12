/**
 * Helper de vérification admin — réutilisable côté server components et API routes.
 *
 * Utilise un client service-role pour bypass RLS. La policy `admin_select_self`
 * de la table admin_users n'autorise que la lecture de SA propre ligne via
 * auth.uid() — donc avec un user-client on aurait quand même le résultat,
 * mais le service-role évite un round-trip de session côté SSR.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} serviceClient
 * @param {string|null|undefined} userId
 * @returns {Promise<{ isAdmin: boolean, role: 'admin'|'super_admin'|null }>}
 */
export async function getAdminStatus(serviceClient, userId) {
  if (!userId) return { isAdmin: false, role: null };
  const { data } = await serviceClient
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  return { isAdmin: Boolean(data), role: data?.role ?? null };
}

/** Helper raccourci si on n'a besoin que du booléen. */
export async function userIsAdmin(serviceClient, userId) {
  const { isAdmin } = await getAdminStatus(serviceClient, userId);
  return isAdmin;
}
