-- ==============================================================================
-- 202608180002_personalization_rls.sql
-- Row Level Security (RLS) policies for Personalization & Organization Settings
-- ==============================================================================

-- 1. Enable RLS on target tables
alter table public.profiles enable row level security;
alter table public.organization_settings enable row level security;

-- 2. Helper function to check if current user is admin or owner
create or replace function public.is_admin_or_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'owner')
  );
$$;

-- 3. Policies for public.profiles
drop policy if exists "Users can read all profiles" on public.profiles;
create policy "Users can read all profiles"
  on public.profiles
  for select
  using (true);

drop policy if exists "Users can update own profile settings" on public.profiles;
create policy "Users can update own profile settings"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Policies for public.organization_settings
drop policy if exists "Anyone can read organization settings" on public.organization_settings;
create policy "Anyone can read organization settings"
  on public.organization_settings
  for select
  using (true);

drop policy if exists "Admins and owners can modify organization settings" on public.organization_settings;
create policy "Admins and owners can modify organization settings"
  on public.organization_settings
  for all
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());
