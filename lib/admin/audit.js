/**
 * Audit log : trace toutes les actions admin avec qui/quoi/quand.
 * Toujours appelé après une mutation côté service-role.
 *
 * Sans-crash : si la table n'existe pas encore (migration 0007 pas
 * appliquée), on logge juste un warning au lieu de planter l'API.
 */

/**
 * @param {object} args
 * @param {import("@supabase/supabase-js").SupabaseClient} args.service - service-role client
 * @param {object} args.admin - { id, email } de l'admin connecté
 * @param {string} args.action - ex. "talent.kyc.approve"
 * @param {string|null} args.targetType - "talent" | "b2b" | "message" | "admin_user" | null
 * @param {string|null} args.targetId - UUID
 * @param {string|null} args.targetLabel - libellé lisible (email, raison sociale, etc.)
 * @param {object|null} args.metadata - infos additionnelles
 */
export async function logAdminAction({
  service,
  admin,
  action,
  targetType = null,
  targetId = null,
  targetLabel = null,
  metadata = null,
}) {
  try {
    const { error } = await service.from("admin_audit_log").insert({
      admin_user_id: admin?.id || null,
      admin_email: admin?.email || null,
      action,
      target_type: targetType,
      target_id: targetId,
      target_label: targetLabel,
      metadata: metadata || {},
    });
    if (error) {
      console.warn(`[audit] insert failed: ${error.message}`);
    }
  } catch (err) {
    console.warn("[audit] unexpected error:", err?.message || err);
  }
}
