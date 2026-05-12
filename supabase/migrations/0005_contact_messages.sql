-- =============================================================================
-- Migration 0005 — Messages de contact entrants
-- Persiste tous les messages envoyés via /api/contact AVANT l'appel Resend,
-- pour ne jamais perdre une sollicitation B2B / presse / carrière en cas de
-- panne email.
-- =============================================================================

create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  type          text not null
                  check (type in ('talent','b2b','press','career','other')),
  prenom        text not null,
  nom           text not null,
  email         text not null,
  telephone     text,
  sujet         text not null,
  message       text not null,
  -- Statut d'envoi email
  email_status  text not null default 'pending'
                  check (email_status in ('pending','sent','failed','skipped')),
  email_sent_at timestamptz,
  resend_id     text,
  error         text,
  -- Statut de traitement côté équipe
  status        text not null default 'new'
                  check (status in ('new','in_progress','answered','spam','archived')),
  -- Traçabilité
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);
create index if not exists idx_contact_messages_type
  on public.contact_messages (type);
create index if not exists idx_contact_messages_status
  on public.contact_messages (status);
create index if not exists idx_contact_messages_email_status
  on public.contact_messages (email_status);

drop trigger if exists trg_contact_messages_updated_at on public.contact_messages;
create trigger trg_contact_messages_updated_at
  before update on public.contact_messages
  for each row execute procedure set_updated_at();

-- RLS : service-role uniquement (les API routes Next.js).
-- Le formulaire /contact est public mais l'INSERT passe par le service-role,
-- la table n'expose aucune policy publique.
alter table public.contact_messages enable row level security;
-- (pas de policy create — seul le service-role peut lire/écrire)
