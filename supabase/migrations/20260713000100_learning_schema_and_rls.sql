begin;

-- The project already contains this event-trigger function. It must not be exposed as RPC.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;
grant execute on function public.rls_auto_enable() to postgres;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to postgres, service_role;

create table if not exists public.accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.family_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  profile_role text not null default 'child' check (profile_role in ('child', 'parent', 'guardian')),
  avatar_key text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, owner_id)
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null,
  module text not null check (char_length(module) between 1 and 40),
  item_id text not null check (char_length(item_id) between 1 and 120),
  completed boolean not null default true,
  points integer not null default 0 check (points between 0 and 100000),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, module, item_id),
  foreign key (profile_id, owner_id)
    references public.family_profiles(id, owner_id)
    on delete cascade
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null,
  module text not null default 'hijaiyah' check (char_length(module) between 1 and 40),
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  reward_minutes integer not null default 0 check (reward_minutes between 0 and 240),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  check (score <= total_questions),
  unique (id, owner_id, profile_id),
  foreign key (profile_id, owner_id)
    references public.family_profiles(id, owner_id)
    on delete cascade
);

create table if not exists public.reward_entitlements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null,
  source_quiz_session_id uuid not null,
  reward_type text not null default 'gamezone' check (char_length(reward_type) between 1 and 40),
  minutes_granted integer not null check (minutes_granted between 0 and 240),
  minutes_used integer not null default 0 check (minutes_used >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (minutes_used <= minutes_granted),
  unique (source_quiz_session_id),
  foreign key (profile_id, owner_id)
    references public.family_profiles(id, owner_id)
    on delete cascade,
  foreign key (source_quiz_session_id, owner_id, profile_id)
    references public.quiz_sessions(id, owner_id, profile_id)
    on delete cascade
);

create index if not exists family_profiles_owner_id_idx
  on public.family_profiles(owner_id);
create index if not exists learning_progress_owner_profile_idx
  on public.learning_progress(owner_id, profile_id);
create index if not exists learning_progress_module_idx
  on public.learning_progress(profile_id, module);
create index if not exists quiz_sessions_owner_profile_idx
  on public.quiz_sessions(owner_id, profile_id, completed_at desc);
create index if not exists reward_entitlements_owner_profile_idx
  on public.reward_entitlements(owner_id, profile_id, created_at desc);

create or replace trigger accounts_set_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();

create or replace trigger family_profiles_set_updated_at
before update on public.family_profiles
for each row execute function public.set_updated_at();

create or replace trigger learning_progress_set_updated_at
before update on public.learning_progress
for each row execute function public.set_updated_at();

create or replace trigger reward_entitlements_set_updated_at
before update on public.reward_entitlements
for each row execute function public.set_updated_at();

alter table public.accounts enable row level security;
alter table public.family_profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.reward_entitlements enable row level security;

revoke all on table public.accounts from anon;
revoke all on table public.family_profiles from anon;
revoke all on table public.learning_progress from anon;
revoke all on table public.quiz_sessions from anon;
revoke all on table public.reward_entitlements from anon;

grant select, insert, update, delete on table public.accounts to authenticated;
grant select, insert, update, delete on table public.family_profiles to authenticated;
grant select, insert, update, delete on table public.learning_progress to authenticated;
grant select, insert, update, delete on table public.quiz_sessions to authenticated;
grant select, insert, update, delete on table public.reward_entitlements to authenticated;

create policy accounts_owner_access
on public.accounts
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy family_profiles_owner_access
on public.family_profiles
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy learning_progress_owner_access
on public.learning_progress
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy quiz_sessions_owner_access
on public.quiz_sessions
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy reward_entitlements_owner_access
on public.reward_entitlements
for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

commit;
