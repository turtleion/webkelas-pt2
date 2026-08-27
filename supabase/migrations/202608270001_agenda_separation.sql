-- ============================================================================
-- Migrasi 0007: Dedicated Agenda table (separate Agenda from Tasks)
-- ----------------------------------------------------------------------------
-- Agenda and Tasks are different features. `agenda_items` is now the TASKS
-- table (/tugas). This creates a dedicated `agenda` table for events/activities
-- shown on /agenda.
--
-- Non-destructive: does NOT touch `agenda_items` (task data preserved).
-- Existing `/tugas` data continues to work unchanged.
-- ============================================================================

create table if not exists public.agenda (
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
  on public.agenda (date desc);

drop trigger if exists set_agenda_updated_at on public.agenda;
create trigger set_agenda_updated_at
  before update on public.agenda
  for each row execute function public.set_updated_at();

alter table public.agenda enable row level security;

drop policy if exists "agenda_public_read" on public.agenda;
create policy "agenda_public_read"
  on public.agenda for select
  using (true);

drop policy if exists "agenda_admin_insert" on public.agenda;
create policy "agenda_admin_insert"
  on public.agenda for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "agenda_admin_update" on public.agenda;
create policy "agenda_admin_update"
  on public.agenda for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "agenda_admin_delete" on public.agenda;
create policy "agenda_admin_delete"
  on public.agenda for delete
  to authenticated
  using (public.is_admin_or_owner());
