-- =============================================================================
-- Migration 0008 — OTP par e-mail
-- Bascule l'authentification du téléphone (Twilio SMS) vers l'e-mail (Resend).
-- Ajoute la colonne `email` à otp_codes, rend `phone` nullable (plus utilisé),
-- et indexe les codes actifs par email.
-- =============================================================================

alter table public.otp_codes
  add column if not exists email text;

-- `phone` n'est plus alimenté : on retire la contrainte NOT NULL pour ne pas
-- bloquer les insertions email-only.
alter table public.otp_codes
  alter column phone drop not null;

create index if not exists idx_otp_email_active
  on public.otp_codes(email, consumed_at)
  where consumed_at is null;

-- Purge des anciens codes téléphone (éphémères, TTL 5 min — aucun impact).
delete from public.otp_codes where email is null;
