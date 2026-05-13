-- =============================================================================
-- Migration 0006 — Table OTP (correctif)
-- Rattrape la table `otp_codes` qui aurait dû être créée par 0001_init.sql
-- mais qui était absente de la prod. Sans elle, /api/auth/send-otp renvoie 500
-- ("Could not find the table 'public.otp_codes' in the schema cache") et aucun
-- SMS n'est envoyé via Twilio.
-- =============================================================================

create table if not exists public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_otp_phone_active
  on public.otp_codes(phone, consumed_at)
  where consumed_at is null;

alter table public.otp_codes enable row level security;

-- Service-role uniquement (les API routes Next.js). Aucun accès client.
drop policy if exists "no client access to otp" on public.otp_codes;
create policy "no client access to otp" on public.otp_codes
  for all using (false) with check (false);
