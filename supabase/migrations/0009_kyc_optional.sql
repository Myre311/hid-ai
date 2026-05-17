-- =============================================================================
-- Migration 0009 — KYC déplacé vers le dashboard
-- Le dépôt des pièces d'identité ne se fait plus à l'inscription mais dans
-- le dashboard talent. Les colonnes KYC deviennent donc nullables : un
-- talent est créé sans pièces, en statut 'kyc_pending', et complète son
-- dossier plus tard (validation admin requise avant accès aux missions).
-- =============================================================================

alter table public.inscriptions_talents
  alter column doc_type       drop not null,
  alter column doc_recto_path drop not null,
  alter column selfie_path    drop not null;

-- 'kyc_pending' est déjà une valeur valide de l'enum status (migration 0002),
-- aucun changement de contrainte nécessaire.
