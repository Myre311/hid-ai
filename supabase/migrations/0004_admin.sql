-- =============================================================================
-- Migration 0004 — Dashboard admin
-- Table admin_users : whitelist d'emails autorisés à accéder à /admin/*.
-- =============================================================================

create table if not exists public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text not null unique,
  role        text not null default 'admin'
                check (role in ('admin', 'super_admin')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_admin_users_user_id on public.admin_users (user_id);

alter table public.admin_users enable row level security;

-- Un admin peut se voir lui-même
drop policy if exists "admin_select_self" on public.admin_users;
create policy "admin_select_self"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- Un super_admin peut tout voir/modifier
drop policy if exists "super_admin_all" on public.admin_users;
create policy "super_admin_all"
  on public.admin_users for all
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid() and role = 'super_admin'
    )
  );

-- Bootstrap : pas d'admin inséré par défaut. Pour ajouter Lucien après son 1er login :
--   INSERT INTO public.admin_users (user_id, email, role)
--   VALUES ('<uuid-de-lucien>', 'lucien@hidea-solution.fr', 'super_admin');
-- (Récupérer l'uuid via auth.users après que Lucien se soit connecté au moins une fois.)
