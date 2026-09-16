-- ============================================================================
-- Migrasi 0011: Daily Overview — "Pemberitahuan Hari Esok"
-- ----------------------------------------------------------------------------
-- Lapisan ORKESTRASI, bukan duplikasi data. Yang disimpan di sini hanya
-- informasi yang memang belum punya rumah:
--   * pakaian     → apa yang dipakai besok
--   * bawaan      → apa yang dibawa besok
--   * catatan     → catatan tambahan pengurus
--
-- Jadwal pelajaran / piket / MBG tetap di tabel masing-masing (dicari lewat
-- kolom `day`), tugas tetap di public.tugas (dicari lewat kolom `date`).
--
-- Scheduler: pg_cron → public.generate_daily_overview()
--   15:00 WIB = 08:00 UTC, Senin–Jumat.
-- ============================================================================

-- 1) Tabel -------------------------------------------------------------------
-- target_date = identitas logis. Satu baris per tanggal sekolah.
create table if not exists public.daily_overview (
  target_date   date primary key,
  pakaian       text,
  bawaan        text,
  catatan       text,
  is_intervened boolean not null default false,
  notified_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_daily_overview_target
  on public.daily_overview (target_date desc);

drop trigger if exists set_daily_overview_updated_at on public.daily_overview;
create trigger set_daily_overview_updated_at
  before update on public.daily_overview
  for each row execute function public.set_updated_at();

-- 2) RLS ---------------------------------------------------------------------
alter table public.daily_overview enable row level security;

-- Publik boleh membaca (dipakai halaman /daily).
drop policy if exists "daily_overview_public_read" on public.daily_overview;
create policy "daily_overview_public_read"
  on public.daily_overview for select
  using (true);

-- Mutasi hanya admin/owner — diperiksa di server, bukan di frontend.
drop policy if exists "daily_overview_admin_insert" on public.daily_overview;
create policy "daily_overview_admin_insert"
  on public.daily_overview for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "daily_overview_admin_update" on public.daily_overview;
create policy "daily_overview_admin_update"
  on public.daily_overview for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "daily_overview_admin_delete" on public.daily_overview;
create policy "daily_overview_admin_delete"
  on public.daily_overview for delete
  to authenticated
  using (public.is_admin_or_owner());

-- 3) Hari sekolah berikutnya (eksplisit zona Asia/Jakarta) --------------------
-- Besok, kalau besok Senin–Jumat. Selain itu null:
--   Jumat  → null (besok Sabtu)
--   Sabtu  → null (besok Minggu)
--   Minggu → Senin
create or replace function public.next_school_day(p_now timestamptz default now())
returns date
language sql
stable
as $$
  with local as (
    select (p_now at time zone 'Asia/Jakarta')::date as hari_ini
  )
  select case
    when extract(isodow from (hari_ini + 1)) between 1 and 5
      then hari_ini + 1
    else null
  end
  from local;
$$;

-- 4) Generator harian (idempoten + menghormati intervensi admin) --------------
create or replace function public.generate_daily_overview()
returns date
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target date := public.next_school_day(now());
  v_created date;
begin
  -- Jumat / Sabtu / Minggu-dini-hari: tidak ada hari sekolah berikutnya.
  if v_target is null then
    return null;
  end if;

  -- Baris baru hanya dibuat kalau belum ada. Baris hasil intervensi admin
  -- (is_intervened = true) TIDAK PERNAH ditimpa di sini.
  insert into public.daily_overview (target_date)
  values (v_target)
  on conflict (target_date) do nothing
  returning target_date into v_created;

  -- Tandai notifikasi sudah dibuat — sekali saja per tanggal.
  update public.daily_overview
     set notified_at = now()
   where target_date = v_target
     and notified_at is null;

  -- Kirim push FCM (async via pg_net → Edge Function send-push).
  -- Hanya untuk baris yang BARU dibuat — intervensi admin yang sudah ada
  -- tidak memicu push ulang.
  if v_created is not null then
    perform net.http_get(
      url := 'https://xnykaajlwcznjbkjyyrf.supabase.co/functions/v1/send-push'
             || '?title=' || replace('Pemberitahuan Hari Esok', ' ', '%20')
             || '&body=' || replace('Pemberitahuan Hari Esok telah ada, yuk lihat!', ' ', '%20')
             || '&target_date=' || v_target::text,
      headers := jsonb_build_object(
        'Authorization', 'Bearer df0f2a9e6d853a1994ca550c8e36c806df838dbc12c6386c'
      )
    );
  end if;

  return v_target;
end;
$$;

-- Scheduler: pg_cron → select public.generate_daily_overview()
select cron.schedule(
  'daily-overview-15wib',
  '0 8 * * 1-5',                              -- 08:00 UTC = 15:00 WIB, Senin–Jumat
  $cron$select public.generate_daily_overview();$cron$
);
