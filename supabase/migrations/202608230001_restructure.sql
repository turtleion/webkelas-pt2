-- ============================================================================
-- Migrasi 0006: Articles, Task Calendar enhancements, MBG & Piket schedules
-- Jalankan di Supabase Dashboard → SQL Editor.
-- ============================================================================

-- 1) Articles (new table — replaces pengumuman concept for front-end) ----------
create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text not null,
  content      text not null,
  cover_url    text not null default '',
  is_pinned    boolean not null default false,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id) on delete set null
);

create index if not exists idx_articles_slug
  on public.articles (slug);

create index if not exists idx_articles_published
  on public.articles (published, is_pinned desc, published_at desc);

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
  on public.articles for select
  using (published = true or public.is_admin_or_owner());

drop policy if exists "articles_admin_insert" on public.articles;
create policy "articles_admin_insert"
  on public.articles for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "articles_admin_update" on public.articles;
create policy "articles_admin_update"
  on public.articles for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "articles_admin_delete" on public.articles;
create policy "articles_admin_delete"
  on public.articles for delete
  to authenticated
  using (public.is_admin_or_owner());

-- 2) Agenda items: add subject + completed columns for task calendar ---------
alter table public.agenda_items
  add column if not exists subject text not null default 'Umum';

alter table public.agenda_items
  add column if not exists completed boolean not null default false;

-- 3) MBG Schedule (Makan Bergizi Gratis) -------------------------------------
create table if not exists public.mbg_schedule (
  id         uuid primary key default gen_random_uuid(),
  day        text not null check (day in ('Senin','Selasa','Rabu','Kamis','Jumat')),
  date       date not null,
  menu       text not null,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_mbg_date
  on public.mbg_schedule (date desc);

drop trigger if exists set_mbg_updated_at on public.mbg_schedule;
create trigger set_mbg_updated_at
  before update on public.mbg_schedule
  for each row execute function public.set_updated_at();

alter table public.mbg_schedule enable row level security;

drop policy if exists "mbg_public_read" on public.mbg_schedule;
create policy "mbg_public_read"
  on public.mbg_schedule for select
  using (true);

drop policy if exists "mbg_admin_insert" on public.mbg_schedule;
create policy "mbg_admin_insert"
  on public.mbg_schedule for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "mbg_admin_update" on public.mbg_schedule;
create policy "mbg_admin_update"
  on public.mbg_schedule for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "mbg_admin_delete" on public.mbg_schedule;
create policy "mbg_admin_delete"
  on public.mbg_schedule for delete
  to authenticated
  using (public.is_admin_or_owner());

-- 4) Duty/Piket Schedule -----------------------------------------------------
create table if not exists public.duty_schedule (
  id         uuid primary key default gen_random_uuid(),
  day        text not null check (day in ('Senin','Selasa','Rabu','Kamis','Jumat')),
  date       date not null,
  group_name text not null,
  members    text[] not null default '{}',
  area       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_duty_date
  on public.duty_schedule (date desc);

drop trigger if exists set_duty_updated_at on public.duty_schedule;
create trigger set_duty_updated_at
  before update on public.duty_schedule
  for each row execute function public.set_updated_at();

alter table public.duty_schedule enable row level security;

drop policy if exists "duty_public_read" on public.duty_schedule;
create policy "duty_public_read"
  on public.duty_schedule for select
  using (true);

drop policy if exists "duty_admin_insert" on public.duty_schedule;
create policy "duty_admin_insert"
  on public.duty_schedule for insert
  to authenticated
  with check (public.is_admin_or_owner());

drop policy if exists "duty_admin_update" on public.duty_schedule;
create policy "duty_admin_update"
  on public.duty_schedule for update
  to authenticated
  using (public.is_admin_or_owner())
  with check (public.is_admin_or_owner());

drop policy if exists "duty_admin_delete" on public.duty_schedule;
create policy "duty_admin_delete"
  on public.duty_schedule for delete
  to authenticated
  using (public.is_admin_or_owner());
