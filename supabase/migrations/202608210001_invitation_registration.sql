-- ============================================================================
-- Migrasi 0005: Invitation registration + verified state
-- ----------------------------------------------------------------------------
-- Jalankan di Supabase Dashboard → SQL Editor (satu berkas utuh).
--
-- Mengubah:
--   * Menambah kolom `verified boolean` ke public.profiles
--     (membedakan "akun Google terautentikasi" vs "anggota terdaftar").
--   * Menambah tabel public.invitation_codes (kode undangan sekali pakai).
--   * Mencegah pengguna mengubah verified/role sendiri lewat PostgREST
--     (column grant) dan memigrasikan peran ke RPC set_user_role.
--   * Backfill: pengguna yang SUDAH ada dianggap verified = true
--     (akun Google yang sudah terdaftar sebelum fitur ini adalah anggota sah).
--
-- Aman untuk database yang sudah ada data. Idempoten (if not exists / drop if exists).
-- ============================================================================

-- 1) Kolom verified pada profiles -------------------------------------------
alter table public.profiles
  add column if not exists verified boolean not null default false;

-- 2) Kunci kolom sensitif: revoke update penuh, beri grant per-kolom ---------
--    Sebelumnya policy "Users can update own profile settings" mengizinkan
--    update SEMUA kolom baris sendiri — termasuk role & (sekarang) verified.
--    Kita mencabut update penuh dan hanya mengizinkan kolom non-sensitif.
revoke update on public.profiles from authenticated, anon;
grant update (name, image, email, settings) on public.profiles to authenticated;

-- Catatan: RLS policy update sendiri tetap (auth.uid() = id); column grant
-- menjadi lapis kedua yang membatasi KOLOOM mana yang boleh diubah.

-- 3) Tabel invitation_codes -------------------------------------------------
create table if not exists public.invitation_codes (
  id          uuid primary key default gen_random_uuid(),
  code_hash   text not null unique,           -- sha256 hex; plaintext tidak disimpan
  code_prefix text not null,                  -- 4 char pertama, untuk identifikasi Owner
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,           -- created_at + 7 hari, diisi RPC
  used_at     timestamptz,
  used_by     uuid references public.profiles (id) on delete set null
);

create index if not exists idx_invitation_codes_created
  on public.invitation_codes (created_at desc);

-- 4) RLS invitation_codes ---------------------------------------------------
alter table public.invitation_codes enable row level security;

-- Hanya Owner boleh membaca daftar kode.
drop policy if exists "invitation_codes_owner_select" on public.invitation_codes;
create policy "invitation_codes_owner_select"
  on public.invitation_codes for select
  to authenticated
  using (public.is_owner());

-- TIDAK ADA policy insert/update/delete — tabel hanya bisa diubah lewat RPC
-- security definer di bawah, sehingga tidak ada jalur PostgREST langsung.
-- Ini menghalang admin/user mengubah expires_at, used_at, atau membuat kode.

-- 5) RPC: redeem_invitation_code (konsumsi atomik) --------------------------
--    Satu perintah SQL: validasi user + cek unused + cek expiry + tandai
--    terpakai + tandai verified. Race-safe karena UPDATE row lock serial.
create or replace function public.redeem_invitation_code(p_code_hash text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  -- Harus ada sesi autentikasi.
  if auth.uid() is null then
    return 'invalid';
  end if;

  -- Jangan izinkan register ulang.
  if exists (select 1 from public.profiles where id = auth.uid() and verified) then
    return 'already_verified';
  end if;

  -- Klaim atomik: hanya sukses bila belum dipakai DAN belum kedaluwarsa
  -- (waktu server, bukan jam klien).
  update public.invitation_codes
     set used_at = now(),
         used_by = auth.uid()
   where code_hash = p_code_hash
     and used_at is null
     and expires_at > now()
   returning id into v_id;

  if v_id is null then
    return coalesce(
      (select case
                when used_at is not null then 'used'
                else 'expired'
               end
         from public.invitation_codes
        where code_hash = p_code_hash),
      'invalid');
  end if;

  -- Tandai pengguna terverifikasi (member, default role — tidak elevasi).
  update public.profiles
     set verified = true
   where id = auth.uid()
     and not verified;

  return 'ok';
end;
$$;

-- 6) RPC: create_invitation_code (Owner-only) -------------------------------
create or replace function public.create_invitation_code(p_code_hash text, p_prefix text)
returns public.invitation_codes
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.invitation_codes;
begin
  if not public.is_owner() then
    raise insufficient_privilege;
  end if;

  insert into public.invitation_codes (code_hash, code_prefix, created_by, expires_at)
  values (p_code_hash, p_prefix, auth.uid(), now() + interval '7 days')
  returning * into v_row;

  return v_row;
end;
$$;

-- 7) RPC: list_invitation_codes (Owner-only, join ke profiles untuk used_by) -
create or replace function public.list_invitation_codes()
returns table (
  id          uuid,
  code_prefix text,
  created_by  uuid,
  created_at  timestamptz,
  expires_at  timestamptz,
  used_at     timestamptz,
  used_by     uuid,
  used_by_name  text,
  used_by_email text,
  server_now  timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise insufficient_privilege;
  end if;

  return query
    select ic.id,
           ic.code_prefix,
           ic.created_by,
           ic.created_at,
           ic.expires_at,
           ic.used_at,
           ic.used_by,
           p.name   as used_by_name,
           p.email  as used_by_email,
           now()    as server_now
      from public.invitation_codes ic
      left join public.profiles p on p.id = ic.used_by
     order by ic.created_at desc;
end;
$$;

-- 8) RPC: set_user_role (Owner-only, ganti update langsung) -----------------
create or replace function public.set_user_role(p_user uuid, p_role text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.profiles;
begin
  if not public.is_owner() then
    raise insufficient_privilege;
  end if;

  if p_role not in ('admin', 'member', 'owner') then
    raise exception 'Invalid role';
  end if;

  update public.profiles
     set role = p_role
   where id = p_user
   returning * into v_row;

  return v_row;
end;
$$;

-- 9) Backfill: pengguna yang sudah ada → verified = true --------------------
--    Akun yang sudah terdaftar di profiles sebelum fitur ini adalah anggota
--    sah kelas. Mereka TIDAK boleh dikunci keluar. Google account baru yang
--    mendaftar setelah ini tetap default false (lewat column default).
update public.profiles
   set verified = true
 where verified = false;

-- 10) Grant execute pada RPC ------------------------------------------------
grant execute on function public.redeem_invitation_code(text) to authenticated;
grant execute on function public.create_invitation_code(text, text) to authenticated;
grant execute on function public.list_invitation_codes() to authenticated;
grant execute on function public.set_user_role(uuid, text) to authenticated;
