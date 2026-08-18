-- ============================================================================
-- Migrasi 0002: Core Content Tables, RBAC (Owner/Admin/Member), RLS & Storage
-- ----------------------------------------------------------------------------
-- Jalankan di Supabase Dashboard → SQL Editor.
-- ============================================================================

-- 1) Perbarui batasan role pada tabel profiles agar mendukung 'owner' --------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'member', 'owner'));

-- 2) Pengumuman (Announcements) ---------------------------------------------
create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  summary      text not null,
  body         text,
  category     text not null default 'Umum',
  published    boolean not null default false,
  published_at timestamptz default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id) on delete set null
);

create index if not exists idx_announcements_published
  on public.announcements (published, published_at desc);

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- 3) Agenda Kegiatan (Agenda Items) -----------------------------------------
create table if not exists public.agenda_items (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  title       text not null,
  description text,
  category    text not null default 'Kegiatan',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references public.profiles(id) on delete set null
);

create index if not exists idx_agenda_date
  on public.agenda_items (date desc);

drop trigger if exists set_agenda_updated_at on public.agenda_items;
create trigger set_agenda_updated_at
  before update on public.agenda_items
  for each row execute function public.set_updated_at();

-- 4) Jadwal Pelajaran (Schedules) -------------------------------------------
create table if not exists public.schedules (
  id          uuid primary key default gen_random_uuid(),
  day         text not null check (day in ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat')),
  time_start  text not null,
  time_end    text,
  subject     text not null,
  teacher     text,
  is_break    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_schedules_day
  on public.schedules (day, sort_order asc);

drop trigger if exists set_schedules_updated_at on public.schedules;
create trigger set_schedules_updated_at
  before update on public.schedules
  for each row execute function public.set_updated_at();

-- 5) Anggota Kelas (Members) ------------------------------------------------
create table if not exists public.members (
  id         uuid primary key default gen_random_uuid(),
  absen_no   integer not null unique,
  name       text not null,
  position   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_members_absen
  on public.members (absen_no asc);

drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
  before update on public.members
  for each row execute function public.set_updated_at();

-- 6) Galeri Foto & Supabase Storage Reference -------------------------------
create table if not exists public.gallery_photos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  category     text not null default 'Dokumentasi',
  date         date not null default current_date,
  image_url    text not null,
  storage_path text not null,
  aspect       text not null default '4 / 3',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id) on delete set null
);

create index if not exists idx_gallery_date
  on public.gallery_photos (date desc, created_at desc);

drop trigger if exists set_gallery_updated_at on public.gallery_photos;
create trigger set_gallery_updated_at
  before update on public.gallery_photos
  for each row execute function public.set_updated_at();

-- 7) Pengaturan Organisasi & Identitas Kelas (JSONB Key-Value) --------------
create table if not exists public.organization_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_org_settings_updated_at on public.organization_settings;
create trigger set_org_settings_updated_at
  before update on public.organization_settings
  for each row execute function public.set_updated_at();

-- 8) Helper Functions untuk RLS ---------------------------------------------
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

create or replace function public.is_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'owner'
  );
$$;

-- 9) Row Level Security (RLS) -----------------------------------------------

-- Profiles: Izinkan Admin & Owner membaca semua profil untuk manajemen user
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin_or_owner());

-- Profiles: Hanya Owner yang dapat mengubah role user lain
drop policy if exists "profiles_update_owner_role" on public.profiles;
create policy "profiles_update_owner_role"
  on public.profiles for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Announcements
alter table public.announcements enable row level security;

drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read"
  on public.announcements for select
  using (published = true or public.is_admin_or_owner());

drop policy if exists "announcements_admin_insert" on public.announcements;
create policy "announcements_admin_insert"
  on public.announcements for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "announcements_admin_update" on public.announcements;
create policy "announcements_admin_update"
  on public.announcements for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "announcements_admin_delete" on public.announcements;
create policy "announcements_admin_delete"
  on public.announcements for delete
  to authenticated
  using (public.is_admin_or_owner());

-- Agenda Items
alter table public.agenda_items enable row level security;

drop policy if exists "agenda_public_read" on public.agenda_items;
create policy "agenda_public_read"
  on public.agenda_items for select
  using (true);

drop policy if exists "agenda_admin_insert" on public.agenda_items;
create policy "agenda_admin_insert"
  on public.agenda_items for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "agenda_admin_update" on public.agenda_items;
create policy "agenda_admin_update"
  on public.agenda_items for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "agenda_admin_delete" on public.agenda_items;
create policy "agenda_admin_delete"
  on public.agenda_items for delete
  to authenticated
  using (public.is_admin_or_owner());

-- Schedules
alter table public.schedules enable row level security;

drop policy if exists "schedules_public_read" on public.schedules;
create policy "schedules_public_read"
  on public.schedules for select
  using (true);

drop policy if exists "schedules_admin_insert" on public.schedules;
create policy "schedules_admin_insert"
  on public.schedules for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "schedules_admin_update" on public.schedules;
create policy "schedules_admin_update"
  on public.schedules for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "schedules_admin_delete" on public.schedules;
create policy "schedules_admin_delete"
  on public.schedules for delete
  to authenticated
  using (public.is_admin_or_owner());

-- Members
alter table public.members enable row level security;

drop policy if exists "members_public_read" on public.members;
create policy "members_public_read"
  on public.members for select
  using (true);

drop policy if exists "members_admin_insert" on public.members;
create policy "members_admin_insert"
  on public.members for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "members_admin_update" on public.members;
create policy "members_admin_update"
  on public.members for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "members_admin_delete" on public.members;
create policy "members_admin_delete"
  on public.members for delete
  to authenticated
  using (public.is_admin_or_owner());

-- Gallery Photos
alter table public.gallery_photos enable row level security;

drop policy if exists "gallery_public_read" on public.gallery_photos;
create policy "gallery_public_read"
  on public.gallery_photos for select
  using (true);

drop policy if exists "gallery_admin_insert" on public.gallery_photos;
create policy "gallery_admin_insert"
  on public.gallery_photos for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "gallery_admin_update" on public.gallery_photos;
create policy "gallery_admin_update"
  on public.gallery_photos for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "gallery_admin_delete" on public.gallery_photos;
create policy "gallery_admin_delete"
  on public.gallery_photos for delete
  to authenticated
  using (public.is_admin_or_owner());

-- Organization Settings
alter table public.organization_settings enable row level security;

drop policy if exists "org_settings_public_read" on public.organization_settings;
create policy "org_settings_public_read"
  on public.organization_settings for select
  using (true);

drop policy if exists "org_settings_admin_all" on public.organization_settings;
create policy "org_settings_admin_all"
  on public.organization_settings for all
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

-- 10) Supabase Storage Bucket Policies (Bucket 'gallery') -------------------
-- Buat bucket 'gallery' secara otomatis jika belum ada
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Storage Policy: Publik membaca foto
drop policy if exists "gallery_storage_public_read" on storage.objects;
create policy "gallery_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Storage Policy: Admin & Owner mengunggah foto
drop policy if exists "gallery_storage_admin_insert" on storage.objects;
create policy "gallery_storage_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery' and public.is_admin_or_owner()
  );

-- Storage Policy: Admin & Owner menghapus foto
drop policy if exists "gallery_storage_admin_delete" on storage.objects;
create policy "gallery_storage_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'gallery' and public.is_admin_or_owner()
  );
