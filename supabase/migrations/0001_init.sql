-- HID AI · initial schema
-- Tables: profiles, engineer_profiles, specialist_profiles, business_profiles, otp_codes
-- RLS enabled on every table; policies enforce per-user access.

create extension if not exists "pgcrypto";

create type branch_type as enum ('specialist', 'engineer', 'business');
create type kyb_status_type as enum ('pending', 'approved', 'rejected');

-- ── profiles (1-1 with auth.users) ──────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  branch branch_type not null,
  first_name text,
  last_name text,
  dob date,
  country text,
  city text,
  phone text unique,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_profiles_phone on profiles(phone);
create index idx_profiles_branch on profiles(branch);

-- ── engineer_profiles ───────────────────────────────────────────────────────
create table engineer_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  skills jsonb default '[]'::jsonb,
  languages jsonb default '[]'::jsonb,
  years_xp int,
  certified_score numeric,
  last_diploma text,
  institution text,
  graduation_year int,
  created_at timestamptz default now()
);

-- ── specialist_profiles ─────────────────────────────────────────────────────
create table specialist_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  last_diploma text,
  institution text,
  graduation_year int,
  current_level int default 1,
  created_at timestamptz default now()
);

-- ── business_profiles ───────────────────────────────────────────────────────
create table business_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  company_name text not null,
  registration_number text,
  sector text,
  country text,
  size text,
  service_types jsonb default '[]'::jsonb,
  kyb_status kyb_status_type default 'pending',
  created_at timestamptz default now()
);
create index idx_business_kyb_status on business_profiles(kyb_status);

-- ── otp_codes ───────────────────────────────────────────────────────────────
create table otp_codes (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts int default 0,
  created_at timestamptz default now()
);
create index idx_otp_phone_active on otp_codes(phone, consumed_at) where consumed_at is null;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table engineer_profiles enable row level security;
alter table specialist_profiles enable row level security;
alter table business_profiles enable row level security;
alter table otp_codes enable row level security;

create policy "users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "users insert own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "users read own engineer profile" on engineer_profiles
  for select using (auth.uid() = profile_id);
create policy "users write own engineer profile" on engineer_profiles
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "users read own specialist profile" on specialist_profiles
  for select using (auth.uid() = profile_id);
create policy "users write own specialist profile" on specialist_profiles
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "users read own business profile" on business_profiles
  for select using (auth.uid() = profile_id);
create policy "users write own business profile" on business_profiles
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- otp_codes is service-role only — clients hit the API, never the table directly.
create policy "no client access to otp" on otp_codes
  for all using (false) with check (false);

-- ── updated_at trigger on profiles ──────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();
