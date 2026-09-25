-- 202609250001_app_updates.sql
-- Konfigurasi update APK: admin/owner bisa buat + aktifkan release baru
-- dari dashboard, tanpa nunggu GitHub API.
-- Endpoint publik fetch-update hanya mengembalikan baris is_active = true
-- dengan version_code tertinggi.

create table if not exists public.app_updates (
  id            bigint generated always as identity primary key,
  version_code  integer     not null unique,
  version_name  text        not null,
  apk_url       text        not null,
  notes         text,
  is_forced     boolean     not null default false,
  is_active     boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists set_app_updates_updated_at on public.app_updates;
create trigger set_app_updates_updated_at
  before update on public.app_updates
  for each row execute function public.set_updated_at();

alter table public.app_updates enable row level security;

-- Admin & owner: CRUD penuh lewat dashboard
drop policy if exists "app_updates_admin_all" on public.app_updates;
create policy "app_updates_admin_all"
  on public.app_updates for all
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

-- Baris aktif bisa dibaca anonim (dipakai Admin Dashboard / fallback)
drop policy if exists "app_updates_active_public_read" on public.app_updates;
create policy "app_updates_active_public_read"
  on public.app_updates for select
  to anon
  using (is_active = true);