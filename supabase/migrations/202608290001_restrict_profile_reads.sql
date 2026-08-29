-- Tighten profile reads: an authenticated user may read only their own profile,
-- plus admins/owners may read everyone. Anonymous visitors see nothing.
-- Previously the SELECT policy was `using (true)`, exposing every member's
-- name/email/role/verified/settings to the public anon key.

drop policy if exists "Users can read all profiles" on public.profiles;
create policy "Users can read own profile or see all if admin"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id or public.is_admin_or_owner());

-- Preserve the self-update window (already correct; column grants revoke role/verified).
drop policy if exists "Users can update own profile settings" on public.profiles;
create policy "Users can update own profile settings"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);