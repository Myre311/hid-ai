-- =============================================================================
-- Migration 0007 — Actions admin
--   Ajoute le support pour :
--   1. Validation KYC des inscriptions Talent
--   2. Suspension / réactivation de comptes Talent
--   3. Réponse aux messages contact
--   4. Audit log des actions admin
-- =============================================================================

-- ────────────────────────────────────────────────────────────────────────
-- 1. Inscriptions Talents : statut KYC + statut compte
-- ────────────────────────────────────────────────────────────────────────

alter table public.inscriptions_talents
  add column if not exists kyc_status text not null default 'pending'
    check (kyc_status in ('pending', 'approved', 'rejected')),
  add column if not exists kyc_reviewed_at timestamptz,
  add column if not exists kyc_reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists kyc_rejection_reason text,
  add column if not exists account_status text not null default 'active'
    check (account_status in ('active', 'suspended'));

create index if not exists idx_talents_kyc_status on public.inscriptions_talents (kyc_status);
create index if not exists idx_talents_account_status on public.inscriptions_talents (account_status);

-- ────────────────────────────────────────────────────────────────────────
-- 2. Contact messages : réponse admin
-- ────────────────────────────────────────────────────────────────────────

alter table public.contact_messages
  add column if not exists reply_message text,
  add column if not exists replied_at timestamptz,
  add column if not exists replied_by uuid references auth.users(id) on delete set null;

-- ────────────────────────────────────────────────────────────────────────
-- 3. Audit log des actions admin
-- ────────────────────────────────────────────────────────────────────────

create table if not exists public.admin_audit_log (
  id              uuid primary key default gen_random_uuid(),
  admin_user_id   uuid references auth.users(id) on delete set null,
  admin_email     text,
  action          text not null,
  target_type     text,
  target_id       uuid,
  target_label    text,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_audit_created on public.admin_audit_log (created_at desc);
create index if not exists idx_audit_target on public.admin_audit_log (target_type, target_id);
create index if not exists idx_audit_admin on public.admin_audit_log (admin_user_id);

alter table public.admin_audit_log enable row level security;
-- Service-role only (les API routes ; pas d'accès client direct)
