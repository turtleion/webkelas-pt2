-- ============================================================================
-- Migrasi 0008: Rename task table `agenda_items` → `tugas`
-- ----------------------------------------------------------------------------
-- /tugas should read/write from the `tugas` table (previously `agenda_items`).
-- Agenda uses the separate `agenda` table created in 0007.
--
-- Non-destructive: safely renames the existing table (data preserved).
-- ============================================================================

-- Rename the table holding task data.
alter table if exists public.agenda_items rename to tugas;

-- Index names are schema-wide; rename to avoid collision with the `agenda`
-- table's idx_agenda_date (created in 0007).
alter index if exists public.idx_agenda_date rename to idx_tugas_date;

-- Trigger names are per-table, so set_agenda_updated_at on `tugas` does not
-- collide with the one on `agenda`. Rename it anyway for clarity.
drop trigger if exists set_agenda_updated_at on public.tugas;
create trigger set_tugas_updated_at
  before update on public.tugas
  for each row execute function public.set_updated_at();
