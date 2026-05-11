-- =============================================================================
-- Migration 0002 — Inscriptions B2B + Talents
-- Tables, RLS policies, storage bucket for KYC documents.
-- =============================================================================

-- ------------------------------------------------------------------ Helpers
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ B2B
create table if not exists public.inscriptions_b2b (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  reference             text not null unique,
  status                text not null default 'new'
                          check (status in ('new','contacted','demo_scheduled','won','lost')),

  -- Étape 1 — Identification & KYB
  raison_sociale        text not null,
  immatriculation       text not null,
  pays                  text not null,
  secteur               text not null,
  secteur_autre         text,
  site_web              text,
  signataire_prenom     text not null,
  signataire_nom        text not null,
  signataire_fonction   text not null,
  signataire_email      text not null,
  signataire_tel        text not null,

  -- Étape 2 — Spécifications projet
  prestations           text[] not null default '{}',
  prestation_autre      text,
  typologies            text[] not null default '{}',
  volume                text not null,
  frequence             text not null,
  brief                 text,

  -- Étape 3 — Audit
  creneau_date          date,
  creneau_time          text,
  mode_rdv              text,
  langue                text,

  -- Étape 4 — Consentements
  consent_rgpd          boolean not null default false,
  consent_news          boolean not null default false
);

create index if not exists idx_inscriptions_b2b_created_at
  on public.inscriptions_b2b (created_at desc);
create index if not exists idx_inscriptions_b2b_status
  on public.inscriptions_b2b (status);
create index if not exists idx_inscriptions_b2b_email
  on public.inscriptions_b2b (signataire_email);

alter table public.inscriptions_b2b enable row level security;

-- Aucune policy publique : seul le service-role peut lire/écrire
-- (le service-role bypass RLS par défaut). Un dashboard admin futur ajoutera ses policies.

-- ------------------------------------------------------------------ Talents
create table if not exists public.inscriptions_talents (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  reference             text not null unique,
  status                text not null default 'new'
                          check (status in
                            ('new','kyc_pending','training_done','test_scheduled','validated','rejected')),

  -- Étape 1 — Identification
  prenom                text not null,
  nom                   text not null,
  email                 text not null,
  telephone             text not null,
  date_naissance        date not null,
  pays                  text not null,
  ville                 text not null,
  metier                text not null check (metier in ('specialist','engineer')),
  niveau_etudes         text not null,
  competences           text[] not null default '{}',

  -- Étape 2 — KYC
  doc_type              text not null check (doc_type in ('cni','passeport','permis')),
  doc_recto_path        text not null,
  doc_verso_path        text,
  selfie_path           text not null,
  antecedents           text,

  -- Étape 3 — Modules pré-qualification
  modules_validated     jsonb not null default '{}'::jsonb,

  -- Étape 4 — Évaluation technique
  domaine               text,
  creneau_test_date     date,
  creneau_test_time     text,
  prerequis_confirmed   text[] not null default '{}',

  -- Étape 5 — Consentements
  consent_cgu           boolean not null default false,
  consent_rgpd          boolean not null default false,
  consent_ethique       boolean not null default false,
  consent_news          boolean not null default false
);

create index if not exists idx_inscriptions_talents_created_at
  on public.inscriptions_talents (created_at desc);
create index if not exists idx_inscriptions_talents_status
  on public.inscriptions_talents (status);
create index if not exists idx_inscriptions_talents_email
  on public.inscriptions_talents (email);
create index if not exists idx_inscriptions_talents_metier
  on public.inscriptions_talents (metier);

alter table public.inscriptions_talents enable row level security;

-- ------------------------------------------------------------------ Storage bucket
-- Bucket privé pour les pièces d'identité (recto/verso/selfie).
-- Uniquement accessible via service-role, et plus tard via signed URLs côté admin.
insert into storage.buckets (id, name, public)
  values ('kyc-documents', 'kyc-documents', false)
  on conflict (id) do nothing;
