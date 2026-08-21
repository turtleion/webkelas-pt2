# Implementation Plan — Personalization, Themes, Layouts & Localization

**Date:** 2026-08-18  
**Scope:** Per-user `/settings` page, Theme presets (Paper, Glass, Cartoon [Light only]), Custom theme transitions, Custom color schemes, Dynamic font engine, 3 Home page layout variants, Full-stack Indonesian/English i18n localization, Global Admin Defaults (`/admin/theme`), and Backward-Compatible Supabase persistence.  
**Constraint:** Zero destructive schema changes. Reuse existing Supabase tables (`organization_settings` and `profiles`) with maximal database stability.

---

## 1. Current Architecture

### 1.1 Tech Stack
- **Framework & Runtime:** Vite + React 19 + TypeScript + React Router v7 (`react-router`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, Radix UI primitives / shadcn/ui (New York style), Lucide React
- **Animations:** Framer Motion, `react-intersection-observer`
- **Backend & Persistence:** Supabase JS SDK (`@supabase/supabase-js`) with anon key only, Google OAuth authentication, PostgreSQL database with Row Level Security (RLS) and Postgres functions (`is_admin_or_owner`, `is_owner`), Supabase Storage (`gallery` bucket)
- **State & Data Management:** Centralized Supabase data access layer (`src/lib/db.ts`) with custom React hooks (`useAnnouncements`, `useAgenda`, `useSchedule`, `useMembers`, `useGallery`, `useOrganization`, `useAuth`) containing offline fallback mock states.

### 1.2 Current Routing Architecture
```
Public Routes:
  /               → Home (src/pages/Home.tsx)
  /anggota        → Anggota (src/pages/Anggota.tsx)
  /organisasi     → Organisasi (src/pages/Organisasi.tsx)
  /jadwal         → Jadwal (src/pages/Jadwal.tsx)
  /pengumuman     → Pengumuman (src/pages/Pengumuman.tsx)
  /agenda         → Agenda (src/pages/Agenda.tsx)
  /galeri         → Galeri (src/pages/Galeri.tsx)
  /auth           → AuthPage (src/pages/Auth.tsx)
  *               → NotFound (src/pages/NotFound.tsx)

Protected Member Routes (RequireAuth):
  /dashboard      → Dashboard (src/pages/Dashboard.tsx)

Protected Admin Routes (RequireAdmin):
  /admin              → AdminDashboard (src/pages/admin/AdminDashboard.tsx)
  /admin/pengumuman   → AdminAnnouncements (src/pages/admin/AdminAnnouncements.tsx)
  /admin/agenda       → AdminAgenda (src/pages/admin/AdminAgenda.tsx)
  /admin/jadwal       → AdminSchedule (src/pages/admin/AdminSchedule.tsx)
  /admin/anggota      → AdminMembers (src/pages/admin/AdminMembers.tsx)
  /admin/galeri       → AdminGallery (src/pages/admin/AdminGallery.tsx)
  /admin/organisasi   → AdminOrganization (src/pages/admin/AdminOrganization.tsx)

Protected Owner-Only Routes (RequireOwner):
  /admin/users        → AdminUsers (src/pages/admin/AdminUsers.tsx)
```

---

## 2. Existing Theme/Design System

### 2.1 CSS Tokens (`src/index.css`)
- **Typography:** Fraunces (`--font-display`, `--font-serif`, `--font-sans`) and IBM Plex Mono (`--font-mono`).
- **Default Palette (Paper Light):**
  - Background: `#f4eddd` (Warm cream / sepia off-white)
  - Foreground: `#29241d` (Warm charcoal)
  - Primary: `#2e4631` (Deep pine / forest green)
  - Secondary: `#e7dcc2`
  - Accent: `#a64f2b` (Rust / stamp red)
  - Card: `#ece2cb`
  - Border: `#d2c3a2`
- **Dark Mode (`.dark` class on root):**
  - Background: `#1e1a12`
  - Foreground: `#e7dcc1`
  - Primary: `#9db392`
  - Accent: `#c96a41`
  - Card: `#272216`
- **Materiality & Glass Utilities:**
  - `.glass` token: `backdrop-filter: blur(16px) saturate(1.2)`, background `var(--glass-bg)`, border `var(--glass-border)`, shadow `var(--glass-shadow)`
  - `.glass-strong` token: `background-color: var(--glass-bg-strong)`
  - `.glass-hover` token: animated translation and glow on interaction.
  - Background paper grain: `body::after` fractal noise overlay with `opacity: 0.045`.

---

## 3. Existing Supabase/User Architecture

### 3.1 PostgreSQL Tables & Structures
1. **`public.profiles`**:
   - `id`: `uuid primary key references auth.users(id) on delete cascade`
   - `name`: `text`
   - `image`: `text`
   - `email`: `text`
   - `role`: `text not null default 'member' check (role in ('admin', 'member', 'owner'))`
   - `created_at`: `timestamptz not null default now()`
   - `updated_at`: `timestamptz not null default now()`
2. **`public.organization_settings`**:
   - `key`: `text primary key`
   - `value`: `jsonb not null`
   - `updated_at`: `timestamptz not null default now()`
3. **Content Tables**: `announcements`, `agenda_items`, `schedules`, `members`, `gallery_photos` (all secured with RLS).

### 3.2 Authentication & Guest Mode (`src/lib/auth.ts` + `src/hooks/use-auth.ts`)
- **OAuth User:** Authenticated via Supabase Google OAuth (`signInWithGoogle()`). The `handle_new_user()` trigger inserts a row in `profiles`.
- **Guest Mode:** Managed locally via `localStorage.getItem("arsip_guest")`. Guest user ID is `"guest"`, role is `"member"`, `guest: true`.

---

## 4. Existing Admin Architecture
- **Navigation:** `AdminSidebar.tsx` contains links to `/admin`, `/admin/pengumuman`, `/admin/agenda`, `/admin/jadwal`, `/admin/anggota`, `/admin/galeri`, `/admin/organisasi`, and conditionally `/admin/users` for `isOwner`.
- **Route Guards:**
  - `RequireAdmin`: checks `isAuthenticated && (isAdmin || isOwner)`.
  - `RequireOwner`: checks `isAuthenticated && isOwner`.

---

## 5. Current Gaps

| Area | Current State | Required State |
|---|---|---|
| **User Settings** | No `/settings` route; no user personalization interface | Dedicated `/settings` page with Personalization and Language tabs |
| **Theme Presets** | Only static CSS tokens for Paper (Light/Dark) | Dynamic runtime switcher supporting Paper (L/D), Glass (L/D), and Cartoon (Light only) |
| **Custom Theme Detection** | None | Automatic switch to "Custom" theme whenever any individual preset value is modified |
| **Custom Color Schemes** | Hardcoded CSS variables | Per-user configurable Light and Dark mode tokens (Background, Primary, Secondary, Accent, Text, Card, Border) |
| **Font Engine** | Hardcoded Google Fonts `@import` for Fraunces & IBM Plex Mono | System supporting 3 default fonts + dynamic runtime loader + Admin font registry |
| **Home Page Layouts** | Single static layout in `Home.tsx` | 3 distinct home layouts (Editorial Classic, Modern Bento/Grid, Archive Showcase) selectable per user / global default |
| **Localization (i18n)** | Indonesian only, hardcoded in TSX strings | Dual language dictionary system (Indonesian `id` & English `en`) spanning all navigation, pages, and admin UI |
| **Global Admin Defaults** | Only `organization_settings` for class metadata | Admin page `/admin/theme` to configure organization-wide default theme, color scheme, font, layout, and font registry |
| **Persistence Cascade** | No preference storage | `Global Admin Default` → `User Database Override` → `Local Fallback / Guest Storage` |

---

## 6. Proposed Personalization Architecture

```
                                  ┌─────────────────────────────┐
                                  │ Supabase DB (Global)        │
                                  │ organization_settings       │
                                  │ key: 'theme_defaults'       │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│ Supabase DB (Per-User)      │   │ Default Fallback Model      │
│ profiles.settings (JSONB)   │   │ Built-in Constants          │
└──────────────┬──────────────┘   └──────────────┬──────────────┘
               │                                 │
               ▼                                 ▼
┌───────────────────────────────────────────────────────────────┐
│ Preferences Context & Provider (PreferencesContext.tsx)       │
│                                                               │
│ Effective Settings Cascade:                                   │
│ 1. User DB preference (if authenticated & not null)           │
│ 2. LocalStorage preference (if guest / offline)               │
│ 3. Global Admin Default (from organization_settings)          │
│ 4. Built-in Preset Fallback                                   │
└──────────────────────────────┬────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────┐             ┌───────────────────────┐
│ DOM / CSS Engine      │             │ i18n Translation Hook │
│ - Token injection     │             │ - useTranslation()    │
│ - HTML classes/attrs  │             │ - Active lang dict    │
│ - Dynamic font load   │             │                       │
└───────────────────────┘             └───────────────────────┘
```

---

## 7. Theme System

### 7.1 Built-in Theme Presets

```typescript
export type ThemePresetKey = "paper" | "glass" | "cartoon" | "custom";

export interface ThemeConfig {
  name: string;
  presetKey: ThemePresetKey;
  supportedModes: Array<"light" | "dark">;
  defaultMode: "light" | "dark";
  colorScheme: string; // "paper" | "glass" | "cartoon" | "custom"
  fontFamily: string;  // "fraunces" | "plus-jakarta" | "space-grotesk" | custom
  homeLayout: "classic" | "bento" | "showcase";
  borderRadius: string; // e.g. "0.25rem", "0.75rem", "1rem"
  glassBlur: boolean;
  paperGrain: boolean;
  borderStyle: "solid" | "double" | "bold-cartoon";
}
```

#### Theme 1: Paper (Default)
- **Modes:** Light & Dark
- **Visual Feel:** Vintage academic ledger, physical archive, warm sepia, subtle paper grain overlay.
- **Default Font:** Fraunces (Display/Serif) + IBM Plex Mono (Kicker/Labels).
- **Default Layout:** `classic` (Editorial archive layout).
- **Border & Radius:** `0.25rem`, double rules (`.rule-double`), subtle borders.

#### Theme 2: Glass
- **Modes:** Light & Dark
- **Visual Feel:** Modern translucent glassmorphism, high blur (`backdrop-filter: blur(20px)`), frosted borders, crisp modern typography, refined soft shadows.
- **Default Font:** Plus Jakarta Sans / Inter.
- **Default Layout:** `bento` (Modern grid/bento box layout).
- **Border & Radius:** `0.75rem`, continuous semi-transparent white/sage glass borders (`--glass-border`).

#### Theme 3: Cartoon
- **Modes:** **Light mode ONLY**.
- **Dark Mode Restriction:** When `Cartoon` is active, the theme engine strictly disables and ignores Dark mode requests. `effectiveMode` is pinned to `"light"`. The UI mode switch in `/settings` is disabled with a helper note: *"Tema Cartoon hanya tersedia dalam mode Terang."*
- **Visual Feel:** Fresh, cheerful, bold playful outlines (2px solid ink borders), pop-art vibrant accents, high contrast, flat cards with hard drop shadows (`box-shadow: 4px 4px 0px #000000`).
- **Default Font:** Space Grotesk / Comic-clean display font.
- **Default Layout:** `showcase` (Playful card showcase).
- **Border & Radius:** `1rem`, bold 2px borders (`border-2 border-foreground`).

---

## 8. Color Scheme System

### 8.1 Color Scheme Definitions

```typescript
export interface ColorPaletteTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
  glassBg?: string;
  glassBorder?: string;
}

export interface PresetColorScheme {
  id: string;
  name: string;
  light: ColorPaletteTokens;
  dark?: ColorPaletteTokens; // Cartoon omits dark
}
```

#### 1. Paper Scheme
- **Light:**
  - `background`: `#f4eddd`
  - `foreground`: `#29241d`
  - `card`: `#ece2cb`
  - `primary`: `#2e4631` (Forest Green)
  - `primaryForeground`: `#f2ead7`
  - `accent`: `#a64f2b` (Rust / Terracotta)
  - `border`: `#d2c3a2`
- **Dark:**
  - `background`: `#1e1a12`
  - `foreground`: `#e7dcc1`
  - `card`: `#272216`
  - `primary`: `#9db392` (Sage)
  - `accent`: `#c96a41`
  - `border`: `#3a3120`

#### 2. Glass Scheme
- **Light:**
  - `background`: `#f0f4f8` (Crisp ice-blue white)
  - `foreground`: `#0f172a` (Slate deep blue)
  - `card`: `rgba(255, 255, 255, 0.75)`
  - `primary`: `#0284c7` (Sky blue 600)
  - `primaryForeground`: `#ffffff`
  - `accent`: `#38bdf8` (Light sky blue)
  - `border`: `rgba(2, 132, 199, 0.18)`
  - `glassBg`: `rgba(255, 255, 255, 0.65)`
  - `glassBorder`: `rgba(2, 132, 199, 0.22)`
- **Dark:**
  - `background`: `#0b1320`
  - `foreground`: `#f1f5f9`
  - `card`: `rgba(15, 23, 42, 0.75)`
  - `primary`: `#38bdf8`
  - `primaryForeground`: `#0b1320`
  - `accent`: `#7dd3fc`
  - `border`: `rgba(56, 189, 248, 0.2)`
  - `glassBg`: `rgba(15, 23, 42, 0.65)`
  - `glassBorder`: `rgba(56, 189, 248, 0.25)`

#### 3. Cartoon Scheme (Light Only)
- **Light:**
  - `background`: `#fef9c3` (Vibrant pastel lemon yellow)
  - `foreground`: `#18181b` (Solid ink black)
  - `card`: `#ffffff`
  - `primary`: `#fbbf24` (Sunburst Amber)
  - `primaryForeground`: `#18181b`
  - `secondary`: `#fdba74` (Peach orange)
  - `accent`: `#f43f5e` (Punch Pink / Cherry)
  - `accentForeground`: `#ffffff`
  - `border`: `#18181b` (Bold cartoon ink outline)
  - `ring`: `#fbbf24`

### 8.2 Custom Color Scheme (User-Created)
Users can fine-tune specific semantic colors for Light and Dark modes in `/settings`:
- Primary Color (Brand / Buttons / Key accents)
- Background Color (Canvas surface)
- Accent Color (Badges, highlights, kicker highlights)
- Card / Container Background
- Text / Foreground Color

When a user modifies any color token:
1. `colorScheme` becomes `"custom"`.
2. `activeTheme` automatically flags to `"custom"`.
3. The custom palette is serialized to `userPreferences.customColors`.

---

## 9. Font System

### 9.1 Built-in User Fonts
1. **Fraunces & IBM Plex Mono (Default / Serif / Archive):**
   - Headings: Fraunces Serif
   - Body: Fraunces / Serif
   - Metadata: IBM Plex Mono
2. **Plus Jakarta Sans (Modern / Sans / Clean):**
   - Headings & Body: Plus Jakarta Sans
   - Metadata: JetBrains Mono / IBM Plex Mono
3. **Space Grotesk (Playful / Tech / Geometric):**
   - Headings: Space Grotesk
   - Body: Plus Jakarta Sans / Inter
   - Metadata: Space Mono

### 9.2 Dynamic Font Loading Engine (`src/lib/font-loader.ts`)
- Rather than bloating `index.html` with dozens of heavy font stylesheets, fonts are loaded on-demand via the Web Font Loading API (`document.fonts` & `<link rel="stylesheet">` injection).
- When a font is selected, `loadFont(fontDefinition)` ensures the corresponding Google Font / Web Font CSS is fetched before assigning `--font-display` and `--font-sans` CSS custom properties on `:root`.

### 9.3 Admin Font Management
- Stored globally in `organization_settings` under key `'custom_fonts'`.
- Admins can register a new Google Font / Web Font by providing:
  - Font Name (e.g., `"Cinzel"`, `"Outfit"`, `"Lora"`)
  - Font Category: `serif` | `sans-serif` | `display` | `monospace`
  - Google Font Family query / stylesheet URL.
- Once registered, the new font automatically appears in the `/settings` Font Selector dropdown for all users.

---

## 10. Home Layout System

Users can select one of **3 built-in Home page layouts**. All layouts consume identical data from hooks (`useAnnouncements`, `useAgenda`, `useMembers`, `useGallery`, `useOrganization`), eliminating data fragmentation.

### Layout 1: Editorial Classic (`HomeClassic.tsx`)
- **Structure:** The existing vintage newspaper / archive ledger design.
- **Hero:** Large display title, editorial description, stamp badge, and prominent MPLS photo plate on the right.
- **Sections:** Vertical list sections with double rules (`.rule-double`), 3-column stats list, sequential agenda list with dates on left gutter.

### Layout 2: Modern Bento Grid (`HomeBento.tsx`)
- **Structure:** Interactive, modular Bento Grid (CSS grid with glass cards).
- **Hero & Highlights:** Combined into high-impact grid cards with live quick-stats (Total Students, Active Agenda, Next Class Schedule countdown).
- **Components:** Grid tiles with `.glass` backdrop blur, hover tilt interactions, and integrated photo carousels.

### Layout 3: Archive Showcase (`HomeShowcase.tsx`)
- **Structure:** Visual-first showcase featuring media plates and timeline cards.
- **Hero:** Full-width dynamic gallery banner with overlaid class badges.
- **Sections:** Two-column split featuring an interactive horizontal agenda timeline and class member avatar carousel.

---

## 11. Language/i18n System

### 11.1 Dictionary Architecture
- Light, zero-dependency, type-safe i18n dictionary system in `src/lib/i18n/`.
- Supported Locales: `id` (Indonesian - Default) and `en` (English).

```typescript
// src/lib/i18n/types.ts
export type Locale = "id" | "en";

export interface TranslationSchema {
  nav: {
    home: string;
    members: string;
    organization: string;
    schedule: string;
    announcements: string;
    agenda: string;
    gallery: string;
    dashboard: string;
    adminPanel: string;
    settings: string;
    signIn: string;
    signOut: string;
  };
  settings: {
    title: string;
    subtitle: string;
    personalizationTab: string;
    languageTab: string;
    themeSection: string;
    themeSelect: string;
    colorSchemeSection: string;
    customColors: string;
    fontSection: string;
    homeLayoutSection: string;
    modeSection: string;
    lightMode: string;
    darkMode: string;
    cartoonModeWarning: string;
    languageSection: string;
    selectLanguage: string;
    saveSuccess: string;
    resetDefaults: string;
  };
  home: {
    heroTag: string;
    readAnnouncements: string;
    viewMembers: string;
    classIdentity: string;
    latestAnnouncements: string;
    upcomingAgenda: string;
    classMembers: string;
    galleryShowcase: string;
  };
  admin: {
    themeManagement: string;
    globalDefaultsTitle: string;
    globalDefaultsDesc: string;
    fontsManagement: string;
    addFont: string;
  };
  common: {
    save: string;
    cancel: string;
    loading: string;
    error: string;
    empty: string;
    all: string;
    close: string;
  };
}
```

### 11.2 Translation Hook (`useTranslation()`)
- `useTranslation()` reads active locale from `PreferencesContext`.
- Returns `{ t, locale, setLocale }` where `t` is the strongly-typed translation tree for the active language.

---

## 12. Global Admin Defaults vs User Preferences

```
                     ┌──────────────────────────────────────────────┐
                     │           Global Defaults (Admin)            │
                     │  Stored in: organization_settings            │
                     │  Key: 'theme_defaults'                       │
                     │                                              │
                     │  • defaultTheme: "paper"                     │
                     │  • defaultMode: "light"                      │
                     │  • defaultColorScheme: "paper"               │
                     │  • defaultFont: "fraunces"                   │
                     │  • defaultLayout: "classic"                  │
                     │  • defaultLanguage: "id"                     │
                     └──────────────────────┬───────────────────────┘
                                            │
               Inherited when user has not saved personal preferences
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          User Preferences (User)             │
                     │  Stored in: profiles.settings (JSONB)        │
                     │  Fallback: localStorage['arsip_prefs']       │
                     │                                              │
                     │  • theme?: "paper"|"glass"|"cartoon"|"custom"│
                     │  • mode?: "light" | "dark"                   │
                     │  • colorScheme?: string                      │
                     │  • customColors?: { light: {...}, dark: {...}│
                     │  • font?: string                             │
                     │  • homeLayout?: "classic"|"bento"|"showcase" │
                     │  • language?: "id" | "en"                    │
                     └──────────────────────┬───────────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │               Effective Result               │
                     │  Applied to DOM, CSS Vars & React App        │
                     └──────────────────────────────────────────────┘
```

---

## 13. Settings Page (`/settings`)

### 13.1 Route & Layout
- Route: `/settings` (available to all users; guests persist locally, authenticated members persist to Supabase).
- UI Aesthetic: Matches the site design language (`PageHeader`, `.glass` containers, Fraunces titles, mono kickers).

### 13.2 Sections
1. **Personalization Tab:**
   - **Theme Selector:** Cards for `Paper`, `Glass`, `Cartoon`, and `Custom` with visual thumbnail previews.
   - **Appearance Mode:** Switch for `Light` vs `Dark` (auto-disabled with tooltip when `Cartoon` is active).
   - **Color Scheme & Custom Palette:** Palette cards + collapsible color picker for primary/accent/background tokens.
   - **Typography / Font Selector:** Radio/Select list with live font preview rendered in each candidate font.
   - **Home Layout Selector:** Interactive 3-card picker for `Editorial Classic`, `Modern Bento`, and `Archive Showcase`.
   - **Reset Button:** *"Kembalikan ke Default Sekolah / Admin"*.
2. **Language Tab:**
   - Visual radio cards for **Bahasa Indonesia (ID)** and **English (EN)** with country flags and descriptive labels.

---

## 14. Admin Global Theme Page (`/admin/theme`)

### 14.1 Route & Access
- Route: `/admin/theme`
- Guard: `RequireAdmin` (Admin & Owner access).
- Added to `AdminSidebar.tsx` navigation list with icon `Palette`.

### 14.2 Functional Capabilities
1. **Global Default Presets:** Admin sets the school-wide default theme, mode, font, layout, and language.
2. **Built-in Color Scheme Adjuster:** Admin can adjust global baseline values for Paper, Glass, and Cartoon.
3. **Font Registry Manager:** Admin can add new Google Fonts by entering font family names and CSS URLs.
4. **Publish Defaults:** Saves to Supabase table `organization_settings` key `'theme_defaults'`.

---

## 15. Database Strategy (Stability & Backward Compatibility)

### 15.1 Zero-Destructive Database Guarantee
- **No new tables required** for themes, fonts, layouts, or language.
- **Global Settings:** Reuses existing `public.organization_settings` table (`key text primary key, value jsonb not null`).
  - Key `'theme_defaults'`: holds global theme, layout, font, and language defaults.
  - Key `'custom_fonts'`: holds list of admin-registered external fonts.
- **User Settings:**
  - Authenticated Users: Add a single optional JSONB column `settings` to `public.profiles` if missing (`alter table public.profiles add column if not exists settings jsonb default '{}'::jsonb;`).
  - Guest Users: Persisted in `localStorage.getItem("arsip_user_prefs")`.

### 15.2 Schema Migration SQL (`supabase/migrations/202608180001_personalization.sql`)

```sql
-- 1) Tambah kolom settings jsonb pada profiles jika belum ada (non-destructive)
alter table public.profiles
  add column if not exists settings jsonb default '{}'::jsonb;

-- 2) Seed default global theme settings pada organization_settings jika belum ada
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

-- 3) Seed default font registry
insert into public.organization_settings (key, value)
values (
  'custom_fonts',
  '[
    {"id": "fraunces", "name": "Fraunces & IBM Plex Mono", "fontDisplay": "Fraunces", "fontSans": "Fraunces", "fontMono": "IBM Plex Mono", "isBuiltIn": true},
    {"id": "plus-jakarta", "name": "Plus Jakarta Sans", "fontDisplay": "Plus Jakarta Sans", "fontSans": "Plus Jakarta Sans", "fontMono": "IBM Plex Mono", "googleFont": "Plus+Jakarta+Sans:wght@400;500;600;700", "isBuiltIn": true},
    {"id": "space-grotesk", "name": "Space Grotesk", "fontDisplay": "Space Grotesk", "fontSans": "Plus Jakarta Sans", "fontMono": "Space Mono", "googleFont": "Space+Grotesk:wght@400;500;600;700&family=Space+Mono", "isBuiltIn": true}
  ]'::jsonb
)
on conflict (key) do nothing;
```

---

## 16. Authentication & RLS

### 16.1 RLS Matrix for Personalization
- `public.organization_settings`:
  - `SELECT`: Public (all users, guests, and unauthenticated visitors can read global defaults).
  - `INSERT / UPDATE / DELETE`: Restricted to `is_admin_or_owner()` via existing policy `org_settings_admin_all`.
- `public.profiles`:
  - `SELECT`: Owner of row (`auth.uid() = id`) or Admin/Owner (`is_admin_or_owner()`).
  - `UPDATE`: Owner of row (`auth.uid() = id`) can update their own `settings` JSONB column.

---

## 17. Runtime Settings Resolution & Custom Transition Engine

### 17.1 Determination Algorithm

```typescript
function resolveEffectiveSettings(
  globalDefaults: GlobalThemeDefaults,
  userPrefs: Partial<UserPreferences> | null,
  activeFonts: FontDefinition[]
): EffectiveSettings {
  // 1. Resolve raw selections
  const selectedTheme = userPrefs?.theme ?? globalDefaults.defaultTheme ?? "paper";
  let selectedMode = userPrefs?.mode ?? globalDefaults.defaultMode ?? "light";
  const selectedColorScheme = userPrefs?.colorScheme ?? globalDefaults.defaultColorScheme ?? selectedTheme;
  const selectedFont = userPrefs?.font ?? globalDefaults.defaultFont ?? "fraunces";
  const selectedLayout = userPrefs?.homeLayout ?? globalDefaults.defaultHomeLayout ?? "classic";
  const selectedLang = userPrefs?.language ?? globalDefaults.defaultLanguage ?? "id";

  // 2. Cartoon Dark Mode Normalization Rule:
  // Cartoon does not support Dark mode under any circumstances.
  if (selectedTheme === "cartoon" || selectedColorScheme === "cartoon") {
    selectedMode = "light";
  }

  // 3. Custom Theme Transition Detection:
  // If active theme was set to a preset (e.g. 'paper'), but user modified individual settings
  // away from preset defaults, mark effective theme as 'custom'.
  let effectiveTheme: ThemePresetKey = selectedTheme;
  if (selectedTheme !== "custom") {
    const preset = THEME_PRESETS[selectedTheme];
    if (preset) {
      const isMismatch =
        (selectedColorScheme !== preset.colorScheme && selectedColorScheme !== selectedTheme) ||
        (selectedFont !== preset.fontFamily) ||
        (selectedLayout !== preset.homeLayout) ||
        (userPrefs?.customColors && Object.keys(userPrefs.customColors).length > 0);
      
      if (isMismatch) {
        effectiveTheme = "custom";
      }
    }
  }

  return {
    theme: effectiveTheme,
    mode: selectedMode,
    colorScheme: selectedColorScheme,
    customColors: userPrefs?.customColors,
    font: selectedFont,
    homeLayout: selectedLayout,
    language: selectedLang,
  };
}
```

### 17.2 DOM & Token Injection (`applyThemeToDOM()`)
1. **Mode Class:** Add/remove `.dark` on `document.documentElement`.
2. **Data Attributes:** Set `data-theme={effectiveTheme}`, `data-color-scheme={colorScheme}`, `data-layout={homeLayout}` on `document.documentElement`.
3. **CSS Custom Properties:** Inject semantic variables into `:root` (or `.dark`):
   - `--background`, `--foreground`, `--primary`, `--accent`, `--card`, `--border`, `--radius`, `--font-display`, `--font-serif`, `--font-sans`.

---

## 18. File-Level Changes

### 18.1 Files to Create

| File | Purpose |
|---|---|
| `supabase/migrations/202608180001_personalization.sql` | Non-destructive migration for `profiles.settings` and `organization_settings` seed |
| `src/lib/i18n/types.ts` | TypeScript schema for translation dictionary |
| `src/lib/i18n/id.ts` | Indonesian language dictionary |
| `src/lib/i18n/en.ts` | English language dictionary |
| `src/lib/i18n/index.ts` | i18n exports and dictionary registry |
| `src/lib/theme-presets.ts` | Built-in presets (Paper, Glass, Cartoon), color palettes, and token mappings |
| `src/lib/font-loader.ts` | Dynamic WebFont loader and Google Fonts stylesheet injector |
| `src/context/PreferencesContext.tsx` | Global React context managing user preferences, global defaults, effective settings resolution, and persistence |
| `src/hooks/use-preferences.ts` | Hook exposing preferences, effective tokens, update handlers, and preset reset |
| `src/hooks/use-translation.ts` | Hook exposing active dictionary `t` and language switch function |
| `src/components/home/HomeClassic.tsx` | Layout Variant 1: Editorial Classic archive homepage |
| `src/components/home/HomeBento.tsx` | Layout Variant 2: Modern Bento Grid homepage |
| `src/components/home/HomeShowcase.tsx` | Layout Variant 3: Archive Media Showcase homepage |
| `src/components/settings/ThemeSelector.tsx` | Theme preset picker cards with thumbnail previews |
| `src/components/settings/ColorSchemePicker.tsx` | Color scheme and custom palette fine-tuning controls |
| `src/components/settings/FontSelector.tsx` | Interactive typography picker with live rendering |
| `src/components/settings/LayoutSelector.tsx` | Home page layout selector cards |
| `src/components/settings/LanguageSelector.tsx` | Language switcher with flags and locale metadata |
| `src/pages/Settings.tsx` | User preferences page (`/settings`) |
| `src/pages/admin/AdminTheme.tsx` | Admin panel global theme and default settings manager (`/admin/theme`) |

### 18.2 Files to Modify

| File | Modifications |
|---|---|
| `src/main.tsx` | Wrap App in `<PreferencesProvider>`, register `/settings` and `/admin/theme` routes |
| `src/lib/db.ts` | Add query functions `getUserPreferences`, `updateUserPreferences`, `getGlobalThemeDefaults`, `setGlobalThemeDefaults`, `getCustomFonts`, `addCustomFont` |
| `src/pages/Home.tsx` | Dynamically render `HomeClassic`, `HomeBento`, or `HomeShowcase` based on `effectiveSettings.homeLayout` |
| `src/components/site/SiteHeader.tsx` | Add `/settings` link, language toggle, and localize navigation labels with `useTranslation()` |
| `src/components/site/SiteFooter.tsx` | Localize footer labels and links |
| `src/components/admin/AdminSidebar.tsx` | Add `/admin/theme` navigation link ("Tema & Tampilan") with `Palette` icon; localize menus |
| `src/index.css` | Add Cartoon and Glass theme token rules, CSS custom property fallbacks, and animation styles |

---

## 19. Implementation Order

```
Phase 1: Database & Persistence Layer
  ├─ 1.1 Run non-destructive SQL migration (supabase/migrations/202608180001_personalization.sql)
  └─ 1.2 Implement Supabase helpers in src/lib/db.ts for preferences and global theme settings

Phase 2: i18n Localization Foundation
  ├─ 2.1 Create src/lib/i18n/types.ts, src/lib/i18n/id.ts, and src/lib/i18n/en.ts
  └─ 2.2 Create use-translation.ts hook and translation helper

Phase 3: Theme, Palette & Font Engine
  ├─ 3.1 Define theme presets and color schemes in src/lib/theme-presets.ts
  ├─ 3.2 Implement dynamic font loader in src/lib/font-loader.ts
  ├─ 3.3 Create PreferencesContext.tsx with resolution cascade, auto-custom transition, and DOM injector
  └─ 3.4 Create use-preferences.ts hook

Phase 4: Home Layout Variants
  ├─ 4.1 Refactor classic home into src/components/home/HomeClassic.tsx
  ├─ 4.2 Build Bento Grid home layout in src/components/home/HomeBento.tsx
  ├─ 4.3 Build Showcase home layout in src/components/home/HomeShowcase.tsx
  └─ 4.4 Update src/pages/Home.tsx to switch layouts dynamically

Phase 5: User Settings Page (/settings)
  ├─ 5.1 Create settings components (ThemeSelector, ColorSchemePicker, FontSelector, LayoutSelector, LanguageSelector)
  ├─ 5.2 Create src/pages/Settings.tsx with Personalization and Language tabs
  └─ 5.3 Connect to SiteHeader navigation and route in src/main.tsx

Phase 6: Admin Global Theme Management (/admin/theme)
  ├─ 6.1 Create src/pages/admin/AdminTheme.tsx for global defaults and font management
  ├─ 6.2 Add route in src/main.tsx with RequireAdmin guard
  └─ 6.3 Update AdminSidebar.tsx with navigation link

Phase 7: End-to-End Localization & Polishing
  ├─ 7.1 Localize remaining public pages (Anggota, Organisasi, Jadwal, Pengumuman, Agenda, Galeri)
  ├─ 7.2 Localize Admin layout and modals
  └─ 7.3 Verify build, theme transitions, Cartoon mode restrictions, and performance
```

---

## 20. Testing Strategy

### 20.1 Theme & Mode Switching
- [ ] Switching between `Paper`, `Glass`, and `Cartoon` instantly applies tokens without full page reload.
- [ ] When `Cartoon` is active, Dark Mode toggle is disabled, and active mode is forced to `light`.
- [ ] Attempting to activate Dark mode while in `Cartoon` is rejected/prevented.
- [ ] Switching to `Paper` or `Glass` enables Dark mode toggle.

### 20.2 Custom Theme Detection
- [ ] User selects `Paper` preset → changes font → theme automatically shifts to `Custom`.
- [ ] User selects `Glass` preset → modifies primary color in color picker → theme shifts to `Custom`.
- [ ] User clicks *"Kembalikan ke Default"* → returns to preset values and preset theme title.

### 20.3 Color Customization
- [ ] User customizes Light mode background and primary colors → immediate CSS variable injection.
- [ ] User customizes Dark mode colors → verify changes persist when toggling dark mode.

### 20.4 Dynamic Font Loading
- [ ] Selecting `Plus Jakarta Sans` or `Space Grotesk` loads font stylesheet on demand and updates body/headings.
- [ ] Admin adds new font via `/admin/theme` → font becomes selectable in `/settings` for all users.

### 20.5 Home Layouts
- [ ] User selects `Editorial Classic` → verifies classic layout renders correctly with all real data.
- [ ] User selects `Modern Bento` → verifies interactive grid cards render with live data.
- [ ] User selects `Archive Showcase` → verifies media banner and timeline render with live data.

### 20.6 Localization (i18n)
- [ ] Switching language to English (`en`) immediately translates Header, Footer, Home, and Settings.
- [ ] Switching back to Indonesian (`id`) restores Indonesian text immediately.
- [ ] Locale selection persists across page refreshes and browser restarts.

### 20.7 Persistence & Role Separation
- [ ] Guest user preferences save to `localStorage` and persist on reload.
- [ ] Authenticated user preferences save to Supabase `profiles.settings` and sync across devices.
- [ ] Admin modifying global defaults in `/admin/theme` updates defaults for users who have not set overrides.
- [ ] Admin's personal settings in `/settings` do NOT alter global website defaults.

---

## 21. Migration & Backward Compatibility

1. **Non-Destructive Database Guarantee:**
   - Existing profiles and content tables are untouched.
   - `settings` column added to `profiles` with `default '{}'::jsonb`.
   - Existing records without custom settings automatically inherit global defaults from `organization_settings`.
2. **Offline & Unauthenticated Resilience:**
   - If Supabase is unreachable, the application falls back seamlessly to local constants and `localStorage`.
   - Guest mode users enjoy full personalization features stored in browser storage.

---

## 22. Risks & Decisions Required

| Topic | Status | Resolution in Plan |
|---|---|---|
| **Dark mode in Cartoon theme** | Resolved | Strictly disabled. `effectiveMode` forced to `"light"` whenever Cartoon theme or color scheme is active. |
| **Theme Mismatch Logic** | Resolved | Deterministic comparison against active preset's `colorScheme`, `fontFamily`, `homeLayout`, and `customColors`. Any deviation flags theme as `"custom"`. |
| **Admin vs User Scope** | Resolved | `/admin/theme` writes to `organization_settings` (affects all new/unset users); `/settings` writes to `profiles.settings` (affects only active user). |
| **Font Performance** | Resolved | Asynchronous on-demand font loader (`font-loader.ts`) avoids loading unused Google Font assets. |
