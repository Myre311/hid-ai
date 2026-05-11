-- =============================================================================
-- Migration 0003 — Plateforme d'évaluation post-inscription des talents
-- 8 tests linéaires, scoring AI-Native, sessions persistantes.
-- =============================================================================

-- ------------------------------------------------------------------ Sessions
create table if not exists public.evaluation_sessions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  inscription_talent_id uuid references public.inscriptions_talents(id),
  status                text not null default 'pending'
                          check (status in ('pending','in_progress','completed','activated')),
  current_test_index    int not null default 0
                          check (current_test_index between 0 and 7),
  ai_native_score       int check (ai_native_score between 0 and 1000),
  started_at            timestamptz default now(),
  completed_at          timestamptz,
  activated_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create unique index if not exists uniq_evaluation_sessions_user_active
  on public.evaluation_sessions (user_id)
  where status in ('pending','in_progress','completed');

create index if not exists idx_evaluation_sessions_user_id
  on public.evaluation_sessions (user_id);
create index if not exists idx_evaluation_sessions_status
  on public.evaluation_sessions (status);

drop trigger if exists trg_evaluation_sessions_updated_at on public.evaluation_sessions;
create trigger trg_evaluation_sessions_updated_at
  before update on public.evaluation_sessions
  for each row execute procedure set_updated_at();

-- ------------------------------------------------------------------ Test results (1 par test passé)
create table if not exists public.test_results (
  id                    uuid primary key default gen_random_uuid(),
  session_id            uuid not null references public.evaluation_sessions(id) on delete cascade,
  test_slug             text not null
                          check (test_slug in (
                            'computer-vision','nlp-sentiment','rlhf','data-cleaning',
                            'nlp-finetuning','vision-edge','mlops','rag'
                          )),
  test_category         text not null check (test_category in ('specialist','engineer')),
  test_order            int not null check (test_order between 0 and 7),
  status                text not null default 'locked'
                          check (status in ('locked','available','in_progress','completed')),
  raw_answers           jsonb,
  score                 int check (score between 0 and 100),
  precision_rate        numeric(5,4) check (precision_rate >= 0 and precision_rate <= 1),
  time_spent_seconds    int check (time_spent_seconds >= 0),
  cases_processed       int check (cases_processed >= 0),
  started_at            timestamptz,
  completed_at          timestamptz,
  created_at            timestamptz not null default now(),
  unique (session_id, test_slug)
);

create index if not exists idx_test_results_session_id
  on public.test_results (session_id);
create index if not exists idx_test_results_status
  on public.test_results (status);
create index if not exists idx_test_results_session_order
  on public.test_results (session_id, test_order);

-- ------------------------------------------------------------------ RLS
alter table public.evaluation_sessions enable row level security;
alter table public.test_results enable row level security;

-- Un candidat connecté ne voit que SES sessions
drop policy if exists "session_select_own" on public.evaluation_sessions;
create policy "session_select_own"
  on public.evaluation_sessions for select
  using (auth.uid() = user_id);

-- Insertion/mise à jour : service-role uniquement (les API routes Next.js).
-- Pas de policy publique → seul le service-role (qui bypasse RLS) écrit.

-- Un candidat connecté ne voit que ses propres résultats de test
drop policy if exists "test_results_select_own" on public.test_results;
create policy "test_results_select_own"
  on public.test_results for select
  using (
    auth.uid() = (
      select user_id from public.evaluation_sessions where id = session_id
    )
  );

-- ------------------------------------------------------------------ Email logs (optionnel — pour traçabilité)
create table if not exists public.email_logs (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users(id) on delete set null,
  session_id            uuid references public.evaluation_sessions(id) on delete set null,
  template              text not null,
  to_email              text not null,
  resend_id             text,
  status                text not null default 'sent' check (status in ('sent','failed')),
  error                 text,
  sent_at               timestamptz not null default now()
);

create index if not exists idx_email_logs_user_id on public.email_logs (user_id);
create index if not exists idx_email_logs_sent_at on public.email_logs (sent_at desc);

alter table public.email_logs enable row level security;
-- Pas de policy publique : seul service-role lit/écrit.
