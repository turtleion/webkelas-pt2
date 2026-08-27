-- ============================================================================
-- Migrasi 0009: Drop the announcements table (removed /pengumuman feature)
-- ----------------------------------------------------------------------------
-- The /pengumuman feature and its `announcements` table have been retired.
-- Articles (/artikel) replaced announcements. This drops the unused table
-- and its associated RLS policies, index, and trigger.
--
-- Non-destructive to other data: does not touch articles, tugas, agenda, etc.
-- ============================================================================

drop table if exists public.announcements;
