-- Convert mbg_schedule and duty_schedule from date-based to day-of-week recurring.
-- Matches the existing jadwal pelajaran pattern (one row per weekday, no dates).

-- Clear old date-based data (incompatible with new model)
DELETE FROM public.mbg_schedule;
DELETE FROM public.duty_schedule;

-- Drop date column + old indexes
ALTER TABLE public.mbg_schedule DROP COLUMN date;
ALTER TABLE public.duty_schedule DROP COLUMN date;

DROP INDEX IF EXISTS public.idx_mbg_date;
DROP INDEX IF EXISTS public.idx_duty_date;

-- Add unique constraint: one entry per day
ALTER TABLE public.mbg_schedule ADD CONSTRAINT mbg_schedule_day_unique UNIQUE (day);
ALTER TABLE public.duty_schedule ADD CONSTRAINT duty_schedule_day_unique UNIQUE (day);

-- Add day-based indexes
CREATE INDEX idx_mbg_day ON public.mbg_schedule(day);
CREATE INDEX idx_duty_day ON public.duty_schedule(day);
