-- ============================================================================
-- Migrasi 0012: Push FCM (push_tokens) + pemicu notifikasi harian
-- ----------------------------------------------------------------------------
-- FCM = Firebase Cloud Messaging (WA/IG juga pakai jalur ini). Supabase
-- tidak punya jalan keluar ke OS Android selain melalui FCM, jadi token
-- perangkat disimpan di sini dan Edge Function `send-push` yang mengirim.
--
-- Alur:
--   1. App Android daftarkan token FCM ke tabel ini (RLS: pemilik token)
--   2. pg_cron tiap Senin–Jumat 15:00 WIB → INSERT daily_overview
--   3. Trigger notify_tomorrow → net http → supabase/functions/send-push
--   4. Edge Function kirim ke semua token via FCM HTTP v1
-- ============================================================================

-- 1) Tabel token FCM ---------------------------------------------------------
create table if not exists public.push_tokens (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  token       text not null unique,
  platform    text not null default 'android',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_push_tokens_user
  on public.push_tokens (user_id);

-- 2) RLS ---------------------------------------------------------------------
-- Pemilik token boleh baca/tulis tokennya sendiri.
alter table public.push_tokens enable row level security;

drop policy if exists "push_tokens_owner_select" on public.push_tokens;
create policy "push_tokens_owner_select"
  on public.push_tokens for select
  using (auth.uid() = user_id);

drop policy if exists "push_tokens_owner_insert" on public.push_tokens;
create policy "push_tokens_owner_insert"
  on public.push_tokens for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "push_tokens_owner_update" on public.push_tokens;
create policy "push_tokens_owner_update"
  on public.push_tokens for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "push_tokens_owner_delete" on public.push_tokens;
create policy "push_tokens_owner_delete"
  on public.push_tokens for delete
  to authenticated
  using (auth.uid() = user_id);

-- Admin butuh baca SEMUA token untuk kirim broadcast. is_admin_or_owner ada
-- di migrasi sebelumnya (fungsi security definer).
drop policy if exists "push_tokens_admin_select" on public.push_tokens;
create policy "push_tokens_admin_select"
  on public.push_tokens for select
  to authenticated
  using (public.is_admin_or_owner());