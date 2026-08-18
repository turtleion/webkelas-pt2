-- Personalization & Preferences Migration
-- Non-destructive: adds optional JSONB column, seeds global defaults.
-- Safe to run on existing database with existing users.

-- 1) Add settings jsonb column to profiles (if not exists)
--    Existing rows get empty object '{}', meaning "use global defaults".
alter table public.profiles
  add column if not exists settings jsonb default '{}'::jsonb;

-- 2) Seed global theme defaults in organization_settings (if not exists)
insert into public.organization_settings (key, value)
values (
  'theme_defaults',
  '{
    "defaultTheme": "paper",
    "defaultMode": "light",
    "defaultColorScheme": "paper",
    "defaultFont": "fraunces",
    "defaultHomeLayout": "classic",
    "defaultLanguage": "id"
  }'::jsonb
)
on conflict (key) do nothing;

-- 3) Seed built-in font registry
insert into public.organization_settings (key, value)
values (
  'custom_fonts',
  '[]'::jsonb
)
on conflict (key) do nothing;
