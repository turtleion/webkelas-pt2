-- ============================================================================
-- Migrasi awal Supabase — Arsip Kelas Digital
-- ----------------------------------------------------------------------------
-- Jalankan di Supabase Dashboard → SQL Editor (satu berkas utuh).
--
-- Migrasi dari Convex:
--   * Model lama (Convex schema.ts, tabel `users`) hanya berisi kolom auth
--     (name, image, email, emailVerificationTime, isAnonymous, role) dan
--     TIDAK ADA DATA DOMAIN. Tidak ada data aplikasi yang perlu dipindah.
--     Tabel `profiles` di bawah menggantikan tabel `users` itu.
--   * Peran `admin`/`user`/`member` (validator Convex) disederhanakan menjadi
--     `admin`/`member` sesuai keputusan: admin = pengurus, member = anggota.
--   * Mode tamu (guest) TIDAK disimpan di DB — hanya bendera di localStorage.
--
-- Catatan: `updated_at` dikelola trigger karena aplikasi frontend ini
-- tidak memakai PostgREST/Supabase SDK untuk UPDATE profile.
-- ============================================================================

-- 1) Tabel profil anggota ---------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  image      text,
  email      text,
  role       text not null default 'member'
             check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Auto-buat baris profil saat user baru mendaftar ------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, image, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Update timestamp otomatis ----------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 4) Keamanan tingkat baris (RLS) -------------------------------------------
alter table public.profiles enable row level security;

-- Pemilik boleh membaca barisnya sendiri; nama publik untuk yang sudah masuk.
create policy "profiles_select_owner"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_owner"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- `anonymized` tidak ada: mode tamu hanya frontend, tidak menulis ke DB.
-- Role tidak boleh diedit lewat API agar admin ditentukan di dashboard/DB.
