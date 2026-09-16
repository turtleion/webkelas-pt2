-- ============================================================================
-- Migrasi 0011: Welcome onboarding, agreements & admin verification requests
-- ----------------------------------------------------------------------------
-- Jalankan di Supabase Dashboard → SQL Editor (satu berkas utuh).
--
-- Menambah:
--   * Kolom accepted_tos_at / accepted_privacy_at pada public.profiles
--     (timestamp persetujuan; null = belum setuju; versi kebijakan dilacak
--     lewat teks halaman statis — tidak perlu kolom versi terpisah).
--   * Tabel public.verification_requests — permintaan verifikasi manual
--     dari user Google baru yang TIDAK punya kode undangan.
--     Admin/owner menyetujui → user verified (tanpa kode undangan).
--   * RPC submit_verification_request() — aman, idempotent.
--   * RPC review_verification_request() — admin-only, menyetujui/menolak.
--   * RLS: user hanya bisa insert/membaca request miliknya sendiri; admin bisa
--     membaca semua; admin-only untuk accept/decline (lewat RPC security definer).
--
-- Aman untuk database existing. Idempoten (if not exists / drop if exists).
-- ============================================================================

-- 1) Kolom persetujuan pada profiles -----------------------------------------
alter table public.profiles
  add column if not exists accepted_tos_at timestamptz;
alter table public.profiles
  add column if not exists accepted_privacy_at timestamptz;

-- User boleh meng-update kolom persetujuannya sendiri (column grant),
-- tapi TIDAK boleh mengubah verified/role (sudah dicabut sebelumnya).
grant update (accepted_tos_at, accepted_privacy_at) on public.profiles to authenticated;

-- 2) Tabel verification_requests ---------------------------------------------
create table if not exists public.verification_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'pending'
              check (status in ('pending', 'accepted', 'declined')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz
);

-- Satu user hanya boleh punya SATU request pending (anti-spam).
-- Partial unique index: row pending lain diblokir, tapi riwayat accepted/declined tetap.
create unique index if not exists idx_verification_requests_one_pending
  on public.verification_requests (user_id)
  where status = 'pending';

create index if not exists idx_verification_requests_status_created
  on public.verification_requests (status, created_at desc);

-- Trigger updated_at
drop trigger if exists set_verif_req_updated_at on public.verification_requests;
create trigger set_verif_req_updated_at
  before update on public.verification_requests
  for each row execute function public.set_updated_at();

-- 3) RLS verification_requests ------------------------------------------------
alter table public.verification_requests enable row level security;

-- User melihat request miliknya sendiri; admin/owner melihat semua.
drop policy if exists "verification_requests_select" on public.verification_requests;
create policy "verification_requests_select"
  on public.verification_requests for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin_or_owner());

-- User membuat request miliknya sendiri (status default pending).
drop policy if exists "verification_requests_insert" on public.verification_requests;
create policy "verification_requests_insert"
  on public.verification_requests for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- TIDAK ADA policy update/delete lewat PostgREST — perubahan status hanya
-- lewat RPC security definer (review_verification_request) di bawah.
-- Ini mencegah user mengubah status request sendiri.

-- 4) RPC: submit_verification_request (idempotent) ---------------------------
--    Satu perintah SQL atomik: mencegah duplikat pending, aman race.
create or replace function public.submit_verification_request()
returns public.verification_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.verification_requests;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Sudah verified → tidak perlu request lagi.
  if exists (select 1 from public.profiles where id = auth.uid() and verified) then
    raise exception 'Already verified';
  end if;

  -- Sudah ada pending → kembalikan row yang ada, jangan buat duplikat.
  select * into v_row
    from public.verification_requests
   where user_id = auth.uid()
     and status = 'pending';
  if v_row.id is not null then
    return v_row;
  end if;

  insert into public.verification_requests (user_id)
  values (auth.uid())
  returning * into v_row;

  return v_row;
end;
$$;

-- 5) RPC: review_verification_request (admin/owner-only) ---------------------
--    accept=true  → verified + status accepted
--    accept=false → status declined
create or replace function public.review_verification_request(
  p_request_id uuid,
  p_accept boolean
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_row public.profiles;
begin
  if not public.is_admin_or_owner() then
    raise insufficient_privilege;
  end if;

  select user_id into v_user_id
    from public.verification_requests
   where id = p_request_id
     and status = 'pending'
   limit 1;

  if v_user_id is null then
    raise exception 'Request not found or already reviewed';
  end if;

  update public.verification_requests
     set status = case when p_accept then 'accepted' else 'declined' end,
         reviewed_by = auth.uid(),
         reviewed_at = now()
   where id = p_request_id;

  if p_accept then
    update public.profiles
       set verified = true
     where id = v_user_id
     returning * into v_row;
  else
    select * into v_row from public.profiles where id = v_user_id;
  end if;

  return v_row;
end;
$$;

-- 6) Grant execute ------------------------------------------------------------
grant execute on function public.submit_verification_request() to authenticated;
grant execute on function public.review_verification_request(uuid, boolean) to authenticated;