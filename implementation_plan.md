# Implementation Plan — Arsip Kelas Digital

**Date:** 2026-08-14
**Scope:** Core functionality, admin panel, RBAC, Supabase integration, gallery storage
**Prerequisite:** Supabase project configured, `.env.local` populated, Google OAuth enabled

---

## 1. Current Architecture

### Stack
| Layer | Tech |
|---|---|
| Build | Vite + TypeScript |
| UI | React 19 + React Router v7 (react-router) |
| Style | Tailwind v4 + shadcn/ui (New York style, Radix primitives) |
| Animations | Framer Motion + react-intersection-observer |
| Auth | Supabase Auth (Google OAuth + guest/localStorage flag) |
| Database | Supabase PostgreSQL (currently 1 table: `profiles`) |
| Server | SST → Hono/Deno static serve (`main.ts`) |
| Host platform | Vly (`@vly-ai/integrations`, `vly-toolbar-readonly.tsx`) |
| Code graph | Graphify (`graphify-out/`) |

### Routing (all lazy-loaded)
| Route | Page | Component | Protected? |
|---|---|---|---|
| `/` | Home | `src/pages/Home.tsx` | No |
| `/anggota` | Members | `src/pages/Anggota.tsx` | No |
| `/organisasi` | Organization | `src/pages/Organisasi.tsx` | No |
| `/jadwal` | Schedule | `src/pages/Jadwal.tsx` | No |
| `/pengumuman` | Announcements | `src/pages/Pengumuman.tsx` | No |
| `/agenda` | Agenda | `src/pages/Agenda.tsx` | No |
| `/galeri` | Gallery | `src/pages/Galeri.tsx` | No |
| `/auth` | Login | `src/pages/Auth.tsx` | No |
| `/dashboard` | Workspace | `src/pages/Dashboard.tsx` | `RequireAuth` |
| `*` | 404 | `src/pages/NotFound.tsx` | No |

### Data Flow
```
src/data/kelas.ts (static placeholder data)
        │
        ▼
All 7 public pages ──► import { anggota, kelas, pengumuman, agenda, galeri, jadwal, pengurusInti, sie } from "@/data/kelas"
        │
        ▼
    No Supabase reads in any page (zero .from() calls outside auth.ts)
```

---

## 2. Existing Functionality

### Auth (`src/lib/auth.ts` + `src/hooks/use-auth.ts`)
- `signInWithGoogle()` — Google OAuth via `supabase.auth.signInWithOAuth`
- `signInAsGuest()` — localStorage flag only, no DB row
- `signOut()` — clears guest + calls `supabase.auth.signOut()`
- `useAuth()` — React hook: `{ isLoading, isAuthenticated, user, signIn, signInAsGuest, signOut }`
- `getAuthState()` / `onAuthChange()` — reads Supabase session + maps to `AuthUser`
- `mapUser()` — fetches `profiles` row, returns `{ id, email, name, image, role, guest }`

### Profile (DB table `profiles`)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | `references auth.users(id) on delete cascade` |
| `name` | text | nullable |
| `image` | text | nullable |
| `email` | text | nullable |
| `role` | text | default `'member'`, check: `'admin'` or `'member'` |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | trigger auto |

### RLS Policies
- `profiles_select_owner`: SELECT where `auth.uid() = id` (own profile only)
- `profiles_update_owner`: UPDATE where `auth.uid() = id` (own profile only)

### Static Data Model (`src/data/kelas.ts`)
| Interface | Fields | Line |
|---|---|---|
| `KelasInfo` | nama, jurusan, sekolah, tahunAjaran, semester, waliKelas, jumlahSiswa, kontak | 9 |
| `Anggota` | no (absen), nama, jabatan? | 58 |
| `Pengurus` | jabatan, nomor[] | 111 |
| `JadwalRow` | waktu, pelajaran, guru?, istirahat? | 138 |
| `JadwalHari` | hari, rows[] | 145 |
| `Pengumuman` | id, judul, ringkasan, tanggal, kategori | 215 |
| `AgendaItem` | tanggal, judul, keterangan?, kategori | 278 |
| `GaleriItem` | id, judul, tanggal, kategori, aspect | 339 |

### Reusable Components
| Component | Path | Purpose |
|---|---|---|
| `SiteHeader` | `src/components/site/SiteHeader.tsx` | Frosted glass masthead + mobile nav |
| `SiteFooter` | `src/components/site/SiteFooter.tsx` | Footer with links/contact |
| `PageHeader` | `src/components/site/PageHeader.tsx` | Archive-style page header (kicker + title + rule-double) |
| `PhotoPlate` | `src/components/site/PhotoPlate.tsx` | Photo frame with `src`, caption, date (already supports real images) |
| `FadeIn` | `src/components/site/FadeIn.tsx` | Intersection-based fade-in |
| `PlaceholderNote` | `src/components/site/PlaceholderNote.tsx` | Glass note for placeholder warnings |
| `Stamp` | `src/components/site/Stamp.tsx` | Rust stamp badge |
| `KelasMark` | `src/components/site/KelasMark.tsx` | SVG monogram logo |
| `RequireAuth` | `src/components/RequireAuth.tsx` | Route guard (checks `useAuth`) |

### shadcn/ui Components (already installed, 53 components)
Full list in `src/components/ui/index.ts`. Key ones for admin:
`Button`, `Input`, `Textarea`, `Label`, `Card`, `Table`, `Dialog`, `AlertDialog`,
`Select`, `Badge`, `Tabs`, `Sheet`, `Form`, `Checkbox`, `Switch`, `Avatar`,
`Pagination`, `Skeleton`, `ScrollArea`, `Separator`, `Tooltip`, `Popover`,
`DropdownMenu`, `Command`, `Calendar`

### Design System (`src/index.css`)
- Fonts: Fraunces (serif/display), IBM Plex Mono (labels/metadata)
- Light: cream `#f4eddd`, forest `#2e4631`, rust `#a64f2b`
- Dark: deep brown `#1e1a12`, sage `#9db392`, warm rust `#c96a41`
- Glass: `.glass`, `.glass-strong`, `.glass-hover` utilities with `--glass-*` tokens
- Texture: `body::after` grain, `.plate` for photo placeholders
- Layout: `max-w-6xl`, `px-5 md:px-8`

### Utilities
| Function | File | Purpose |
|---|---|---|
| `pecahTanggal(iso)` | `src/lib/tanggal.ts` | Parse ISO date → parts |
| `hariNama(iso)` | `src/lib/tanggal.ts` | Day name from ISO |
| `inisialNama(nama)` | `src/lib/tanggal.ts` | Two-letter initials |
| `padNomor(no)` | `src/lib/tanggal.ts` | Two-digit padded number |
| `cariAnggota(no)` | `src/data/kelas.ts` | Lookup by absen number |
| `cn(...)` | `src/lib/utils.ts` | Tailwind merge |

---

## 3. Current Gaps

| Category | Status | Detail |
|---|---|---|
| Database tables | **Missing** | Only `profiles` exists. Need `announcements`, `agenda_items`, `schedule`, `members`, `gallery_photos`, `organization_settings` |
| Admin panel | **Missing** | No `/admin` routes, no admin layout, no CRUD |
| Role system | **Partial** | `admin`/`member` exist; need `owner` role |
| Gallery | **Static only** | Uses placeholder data. No upload, no storage bucket |
| Announcements | **Static only** | Hardcoded in `src/data/kelas.ts` |
| Agenda | **Static only** | Hardcoded |
| Schedule | **Static only** | Hardcoded |
| Members | **Static only** | Hardcoded |
| Organization | **Static only** | Hardcoded `KelasInfo` object |
| Public → DB | **Not connected** | All public pages import from `src/data/kelas.ts`, zero Supabase reads |
| Supabase Storage | **Missing** | No bucket, no upload flow |
| Frontend guards | **Partial** | `RequireAuth` exists but role-blind; needs role-based variant |
| Guest limitations | **Documented** | Guest = localStorage flag, `role: "member"`, cannot write |
| SiteHeader nav | **No admin link** | No `/admin` or dashboard link in nav |

---

## 4. Feature Scope

### 4.1 Three-Role System
```
User (unauthenticated / public)  →  read-only public pages
      ↓ (sign in)
Member (role: "member")          →  same as User + can view members
      ↓
Admin (role: "admin")            →  + Admin Panel access + all CRUD
      ↓
Owner (role: "owner")            →  + User management + role changes
```

### 4.2 Admin Panel
- `/admin` — layout with sidebar, role-aware navigation
- CRUD interfaces for all content domains
- Loading/empty/error states for every view
- Confirmation dialogs for destructive actions

### 4.3 Content Management
All features share the same pattern: admin CRUD → public display.

| Feature | Admin CRUD | Public Display |
|---|---|---|
| Gallery | upload + metadata + delete | masonry grid |
| Announcements | create/edit/delete/publish | list sorted by date |
| Agenda | create/edit/delete | timeline, grouped by month |
| Schedule | create/edit/delete | table by day |
| Members | add/edit/remove | search grid |
| Organization | edit class info | info page |

### 4.4 User Management (Owner only)
- View all users
- Change roles (member ↔ admin ↔ owner)
- Cannot demote below own level (owner only)

---

## 5. Supabase Changes

### New Tables

```sql
-- 1. Role enum update: add 'owner'
-- profiles.role check must be updated to: ('admin', 'member', 'owner')

-- 2. Announcements
CREATE TABLE public.announcements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  summary     text NOT NULL,
  body        text,  -- optional rich text/markdown for full content
  category    text NOT NULL DEFAULT 'Umum',
  published   boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX idx_announcements_published ON public.announcements(published, published_at DESC);

-- 3. Agenda
CREATE TABLE public.agenda_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date NOT NULL,
  title       text NOT NULL,
  description text,
  category    text NOT NULL DEFAULT 'Kegiatan',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX idx_agenda_date ON public.agenda_items(date DESC);

-- 4. Schedule
CREATE TABLE public.schedules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day         text NOT NULL CHECK (day IN ('Senin','Selasa','Rabu','Kamis','Jumat')),
  time_start  text NOT NULL,  -- "07:00"
  time_end    text,           -- "07:45"
  subject     text NOT NULL,
  teacher     text,
  is_break    boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_schedules_day ON public.schedules(day, sort_order);

-- 5. Members
CREATE TABLE public.members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  absen_no    integer NOT NULL UNIQUE,  -- nomor absen
  name        text NOT NULL,
  position    text,  -- jabatan (Ketua Kelas, Sekretaris, etc.)
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_members_absen ON public.members(absen_no);

-- 6. Gallery
CREATE TABLE public.gallery_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  category    text NOT NULL DEFAULT 'Dokumentasi',
  date        date,
  image_url   text NOT NULL,  -- Supabase Storage public URL
  storage_path text NOT NULL, -- bucket path for deletion
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX idx_gallery_date ON public.gallery_photos(date DESC);

-- 7. Organization settings (singleton or keyed)
CREATE TABLE public.organization_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
-- Keys: 'class_info' (KelasInfo), 'wali_kelas', 'contacts', etc.
```

### Storage Bucket
```
Bucket name: gallery
Public: yes (anyone can read; only admin/owner can write)
File path: gallery/{uuid}.{ext}
Max size: 5MB per file
Allowed types: image/jpeg, image/png, image/webp
```

### RLS Policies (all tables)

```sql
-- Read policies (public read for published content)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_public_read" ON public.announcements
  FOR SELECT USING (published = true);
CREATE POLICY "announcements_admin_all" ON public.announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agenda_public_read" ON public.agenda_items FOR SELECT USING (true);
CREATE POLICY "agenda_admin_all" ON public.agenda_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedule_public_read" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "schedule_admin_all" ON public.schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_public_read" ON public.members FOR SELECT USING (true);
CREATE POLICY "members_admin_all" ON public.members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery_public_read" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery_admin_all" ON public.gallery_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_public_read" ON public.organization_settings FOR SELECT USING (true);
CREATE POLICY "org_admin_all" ON public.organization_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );

-- Owner-only: role management
CREATE POLICY "profiles_owner_manage" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
  );
-- Owner can also read all profiles (for user management view)
CREATE POLICY "profiles_owner_select_all" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'owner')
  );

-- Storage policies
CREATE POLICY "gallery_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "gallery_storage_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );
CREATE POLICY "gallery_storage_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','owner'))
  );
```

---

## 6. File-Level Changes

### Files to Modify

| File | Change | Why |
|---|---|---|
| `src/lib/auth.ts` | Add `'owner'` to `Role` type, map in `mapUser()` | Three-role system |
| `src/hooks/use-auth.ts` | Expose `role` + `isAdmin`/`isOwner` helpers | Role-based UI decisions |
| `src/main.tsx` | Add `/admin/*` routes with `RequireAdmin`/`RequireOwner` guards | Admin panel routing |
| `src/components/site/SiteHeader.tsx` | Add admin link for admin/owner users | Navigation to admin panel |
| `src/pages/Auth.tsx` | No functional change needed | Auth already works |
| `src/pages/Dashboard.tsx` | Redirect admin/owner to `/admin` | Dashboard → Admin Panel |
| `supabase/migrations/202608140001_initial.sql` | Update: add `owner` role, new tables, RLS, storage | Schema expansion |

### Files to Create

| File | Purpose |
|---|---|
| `src/components/admin/AdminLayout.tsx` | Sidebar + content shell for admin |
| `src/components/admin/AdminSidebar.tsx` | Navigation sidebar |
| `src/components/admin/RequireAdmin.tsx` | Route guard for admin + owner |
| `src/components/admin/RequireOwner.tsx` | Route guard for owner only |
| `src/components/admin/DataTable.tsx` | Generic table with loading/empty/error |
| `src/components/admin/ConfirmDialog.tsx` | Reusable destructive-action confirmation |
| `src/pages/admin/AdminDashboard.tsx` | Overview / summary page |
| `src/pages/admin/AdminAnnouncements.tsx` | CRUD for announcements |
| `src/pages/admin/AdminAgenda.tsx` | CRUD for agenda items |
| `src/pages/admin/AdminSchedule.tsx` | CRUD for schedule |
| `src/pages/admin/AdminMembers.tsx` | CRUD for members |
| `src/pages/admin/AdminGallery.tsx` | Upload + manage gallery |
| `src/pages/admin/AdminOrganization.tsx` | Edit class info/contacts |
| `src/pages/admin/AdminUsers.tsx` | Owner-only user management |
| `src/lib/db.ts` | Supabase query wrappers (one place for all `.from()` calls) |
| `src/hooks/use-announcements.ts` | Fetch announcements from Supabase |
| `src/hooks/use-agenda.ts` | Fetch agenda from Supabase |
| `src/hooks/use-schedule.ts` | Fetch schedule from Supabase |
| `src/hooks/use-members.ts` | Fetch members from Supabase |
| `src/hooks/use-gallery.ts` | Fetch gallery from Supabase |
| `src/hooks/use-organization.ts` | Fetch org settings from Supabase |
| `src/lib/storage.ts` | Upload/delete helpers for Supabase Storage |
| `supabase/migrations/202608140002_content_tables.sql` | All new tables + RLS + storage |

### Files to Reuse (no changes needed)

| File | Reuse As |
|---|---|
| `src/components/site/PageHeader.tsx` | Admin page headers (same style) |
| `src/components/site/PhotoPlate.tsx` | Gallery display (already supports `src`) |
| `src/components/site/FadeIn.tsx` | Admin transitions |
| `src/components/site/KelasMark.tsx` | Admin sidebar logo |
| `src/components/site/Stamp.tsx` | Role/status badges |
| `src/components/ui/*` | All 53 shadcn components |
| `src/lib/tanggal.ts` | Date formatting throughout admin |
| `src/lib/utils.ts` | `cn()` utility |

---

## 7. Authentication & Authorization

### Auth Flow
```
1. User visits /auth
2. Clicks "Lanjutkan dengan Google"
3. → supabase.auth.signInWithOAuth({ provider: "google" })
4. → Redirect to Google → callback to window.location.origin
5. → supabase.auth.onAuthStateChange fires
6. → useAuth() calls mapUser() → fetches profiles row → returns AuthUser
7. → RequireAuth checks isAuthenticated → renders children or redirects
```

### Guest Flow
```
1. User clicks "Masuk sebagai tamu"
2. → localStorage.setItem("arsip_guest", "1")
3. → user = { id: "guest", role: "member", guest: true }
4. → Can access /dashboard (but limited features)
5. → Cannot access /admin/* (RequireAdmin rejects)
```

### Role Resolution
```typescript
// src/lib/auth.ts
export type Role = "admin" | "member" | "owner";

// mapUser() reads profiles.role:
// - "owner"  → role: "owner"
// - "admin"  → role: "admin"
// - default  → role: "member"
```

### Route Protection
```
/admin/*         → RequireAdmin  (admin OR owner)
/admin/users     → RequireOwner  (owner ONLY)
/dashboard       → RequireAuth   (any authenticated user OR guest)
/*               → public
```

### Frontend vs Backend Security
- **Frontend:** `RequireAdmin` / `RequireOwner` / `RequireAuth` — UX guards only
- **Backend (RLS):** All tables have RLS policies checking `role IN ('admin','owner')` for write operations. Guest users (no Supabase session) cannot write anything. The `profiles_owner_manage` policy is owner-only.
- **Critical:** Frontend role checks are NEVER the security boundary. A malicious user bypassing frontend guards would still be blocked by RLS.

---

## 8. Feature Implementation Details

### 8.1 Role System Expansion

**Goal:** Three roles: user, admin, owner.

**Files to modify:**
- `src/lib/auth.ts` — add `'owner'` to `Role` type, add owner logic to `mapUser()`
- `supabase/migrations/202608140001_initial.sql` — note in migration (actual update in new migration)

**Database changes:**
- Update `profiles.role` check constraint: `CHECK (role IN ('admin', 'member', 'owner'))`

**Implementation steps:**
1. Add `'owner'` to `Role` type in `src/lib/auth.ts`
2. Update `mapUser()` to recognize `"owner"` role
3. Update RLS policies in new migration
4. First owner is set manually in Supabase Dashboard

**Acceptance criteria:**
- Owner can see `/admin/users`
- Admin can see all admin routes except `/admin/users`
- Member/guest cannot see any admin route

---

### 8.2 Admin Layout

**Goal:** Shared admin shell with sidebar navigation.

**Existing code to reuse:**
- `KelasMark` — logo in sidebar
- `useAuth()` — role-aware nav visibility
- `cn()` — class merging

**Files to create:**
- `src/components/admin/AdminLayout.tsx` — flex layout (sidebar + content area)
- `src/components/admin/AdminSidebar.tsx` — nav links, role-aware items
- `src/components/admin/RequireAdmin.tsx` — wraps `RequireAuth` + role check
- `src/components/admin/RequireOwner.tsx` — wraps `RequireAuth` + owner check

**Implementation steps:**
1. Create `AdminLayout` with sidebar (240px, collapsible on mobile via `Sheet`)
2. Create `AdminSidebar` with nav items, conditional items based on `user.role`
3. Create `RequireAdmin` and `RequireOwner` wrappers
4. Add routes to `src/main.tsx`

**UI requirements:**
- Follow existing design language: Fraunces headers, mono kickers, `bg-background`
- Sidebar: glass panel, role label at bottom, logout button
- Mobile: `Sheet` (drawer) for sidebar toggle

**Edge cases:**
- Guest users visiting `/admin` → redirect to `/auth?returnTo=/admin`
- Member users visiting `/admin` → redirect to `/` with toast

---

### 8.3 Gallery

**Goal:** Admin upload/delete images with metadata; public masonry display.

**Existing code to reuse:**
- `PhotoPlate` — already supports `src` prop, `aspect`, `caption`, `date`
- `GaleriItem` interface — extends for DB row shape
- Masonry layout in `src/pages/Galeri.tsx`

**Files to modify:**
- `src/pages/Galeri.tsx` — fetch from Supabase instead of `src/data/kelas`

**Files to create:**
- `src/lib/storage.ts` — `uploadImage(file)`, `deleteImage(path)`
- `src/hooks/use-gallery.ts` — `useGallery()` hook
- `src/pages/admin/AdminGallery.tsx` — upload form + photo list + delete

**Database:**
- `gallery_photos` table (see §5)
- Storage bucket `gallery` (public read, admin/owner write)

**Implementation steps:**
1. Create Supabase Storage bucket `gallery` via Dashboard
2. Create `src/lib/storage.ts` with upload/delete functions
3. Create `src/hooks/use-gallery.ts` — fetches from `gallery_photos`
4. Create `AdminGallery.tsx` — file input, metadata form, photo grid with delete
5. Update `Galeri.tsx` to use `useGallery()` instead of static data
6. Handle: empty state (no photos), loading (spinner), error (toast)

**Authorization:** admin/owner only for upload/delete. Public read via RLS.

**Edge cases:**
- Large file (>5MB) → client-side validation before upload
- Upload failure → toast + retry
- Delete confirmation → `AlertDialog`
- Empty gallery → `PlaceholderNote` remains

---

### 8.4 Announcements

**Goal:** CRUD for announcements; published ones visible publicly.

**Existing code to reuse:**
- `Pengumuman` interface — nearly identical to DB shape
- `src/pages/Pengumuman.tsx` — layout with `PageHeader`, list rendering
- `pecahTanggal()` — date formatting

**Files to modify:**
- `src/pages/Pengumuman.tsx` — fetch from Supabase

**Files to create:**
- `src/hooks/use-announcements.ts` — fetch published (public) or all (admin)
- `src/pages/admin/AdminAnnouncements.tsx` — list + create/edit form

**Database:**
- `announcements` table (see §5)

**Implementation steps:**
1. Create `announcements` table + RLS
2. Create `useAnnouncements(publishedOnly?)` hook
3. Create `AdminAnnouncements.tsx` — table + create/edit dialog
4. Update `Pengumuman.tsx` to use hook
5. Handle: publish/unpublish toggle, category, date

**Acceptance criteria:**
- Public users see only published announcements
- Admin can create, edit, delete, toggle publish
- Announcements sorted by date descending

---

### 8.5 Agenda

**Goal:** CRUD for agenda items; chronological public display.

**Existing code to reuse:**
- `AgendaItem` interface — maps to DB shape
- `src/pages/Agenda.tsx` — month-grouped timeline layout
- `kelompokkanBulan()` — month grouping logic

**Files to modify:**
- `src/pages/Agenda.tsx` — fetch from Supabase

**Files to create:**
- `src/hooks/use-agenda.ts` — fetch agenda from Supabase
- `src/pages/admin/AdminAgenda.tsx` — list + create/edit form

**Database:**
- `agenda_items` table (see §5)

---

### 8.6 Schedule

**Goal:** CRUD for class schedule; table display by day.

**Existing code to reuse:**
- `JadwalRow` / `JadwalHari` interfaces
- `src/pages/Jadwal.tsx` — table layout with day grouping

**Files to modify:**
- `src/pages/Jadwal.tsx` — fetch from Supabase

**Files to create:**
- `src/hooks/use-schedule.ts` — fetch schedule from Supabase
- `src/pages/admin/AdminSchedule.tsx` — table + create/edit form

**Database:**
- `schedules` table (see §5)

---

### 8.7 Members

**Goal:** CRUD for class members; search/display publicly.

**Existing code to reuse:**
- `Anggota` interface — maps to DB shape
- `src/pages/Anggota.tsx` — search + grid layout
- `inisialNama()`, `padNomor()` — initials + numbering

**Files to modify:**
- `src/pages/Anggota.tsx` — fetch from Supabase

**Files to create:**
- `src/hooks/use-members.ts` — fetch members from Supabase
- `src/pages/admin/AdminMembers.tsx` — list + create/edit/delete

**Database:**
- `members` table (see §5)

---

### 8.8 Organization

**Goal:** Admin-editable class identity and contact info.

**Existing code to reuse:**
- `KelasInfo` interface — maps to JSONB in `organization_settings`
- `src/pages/Organisasi.tsx` — org chart layout

**Files to modify:**
- `src/pages/Organisasi.tsx` — fetch from Supabase

**Files to create:**
- `src/hooks/use-organization.ts` — fetch org settings
- `src/pages/admin/AdminOrganization.tsx` — form to edit class info

**Database:**
- `organization_settings` table (see §5)

---

### 8.9 User Management (Owner Only)

**Goal:** View users, change roles.

**Files to create:**
- `src/pages/admin/AdminUsers.tsx` — user list with role dropdown

**Implementation steps:**
1. `RequireOwner` guard on route
2. Query `profiles` table (owner RLS policy allows reading all)
3. Display: avatar, name, email, role, last sign-in (if available)
4. Role change: update `profiles.role` (owner RLS allows this)

**Edge cases:**
- Owner cannot demote themselves
- Owner cannot remove another owner (if only one exists)

---

### 8.10 Home Page → Supabase

**Goal:** Home page displays real data from Supabase.

**Files to modify:**
- `src/pages/Home.tsx` — replace static imports with hooks

**Implementation:**
1. Replace `import { anggota, kelas, pengumuman, agenda, galeri } from "@/data/kelas"`
2. Use `useAnnouncements(true)`, `useAgenda()`, `useMembers()`, `useGallery()`
3. `KelasInfo` → fetch from `organization_settings` key `'class_info'`
4. Keep `PlaceholderNote` when data is empty

---

## 9. Implementation Order

```
Phase 1: Database & Security
  ├─ Migration 202608140002_content_tables.sql (all new tables + RLS)
  ├─ Storage bucket creation
  └─ Profile role update (add 'owner')

Phase 2: Auth & Roles
  ├─ Update src/lib/auth.ts (Role type + owner)
  ├─ Update src/hooks/use-auth.ts (role helpers)
  ├─ Create RequireAdmin.tsx, RequireOwner.tsx
  └─ Update RequireAuth.tsx

Phase 3: Data Layer
  ├─ src/lib/db.ts (Supabase query wrappers)
  ├─ src/lib/storage.ts (upload/delete)
  ├─ src/hooks/use-announcements.ts
  ├─ src/hooks/use-agenda.ts
  ├─ src/hooks/use-schedule.ts
  ├─ src/hooks/use-members.ts
  ├─ src/hooks/use-gallery.ts
  └─ src/hooks/use-organization.ts

Phase 4: Admin Panel
  ├─ AdminLayout + AdminSidebar
  ├─ AdminDashboard (overview)
  ├─ AdminAnnouncements
  ├─ AdminAgenda
  ├─ AdminSchedule
  ├─ AdminMembers
  ├─ AdminGallery (with upload)
  ├─ AdminOrganization
  └─ AdminUsers (owner only)

Phase 5: Connect Public Pages
  ├─ Home.tsx → Supabase hooks
  ├─ Pengumuman.tsx → useAnnouncements
  ├─ Agenda.tsx → useAgenda
  ├─ Jadwal.tsx → useSchedule
  ├─ Anggota.tsx → useMembers
  ├─ Galeri.tsx → useGallery
  └─ Organisasi.tsx → useOrganization

Phase 6: Navigation & Polish
  ├─ SiteHeader: admin link for admin/owner
  ├─ Dashboard.tsx: redirect to /admin for admin/owner
  ├─ Loading states (spinner)
  ├─ Empty states (PlaceholderNote)
  └─ Error states (toast)

Phase 7: Testing & Verification
  ├─ Build check
  ├─ Auth flow (Google + guest)
  ├─ Role-based access
  ├─ CRUD operations
  ├─ Gallery upload/delete
  ├─ RLS enforcement
  ├─ Responsive design
  └─ Convex sweep (should remain clean)
```

---

## 10. Testing Strategy

### Authentication
- [ ] Google OAuth sign-in → redirect → session created → profile row exists
- [ ] Guest sign-in → localStorage flag → `user.guest = true`
- [ ] Sign out → session cleared → redirect to `/`
- [ ] Session persistence on page reload

### Unauthorized Access
- [ ] Unauthenticated user visiting `/dashboard` → redirected to `/auth`
- [ ] Unauthenticated user visiting `/admin` → redirected to `/auth`
- [ ] Guest user visiting `/admin` → redirected to `/`

### Role-Based Access
- [ ] Member visiting `/admin/*` → redirected to `/`
- [ ] Admin visiting `/admin/*` → access granted
- [ ] Admin visiting `/admin/users` → redirected to `/admin`
- [ ] Owner visiting `/admin/users` → access granted
- [ ] Admin cannot change roles via API (RLS blocks)
- [ ] Owner can change roles via API (RLS allows)

### CRUD Operations
- [ ] Create announcement → appears in public list
- [ ] Edit announcement → changes reflected
- [ ] Delete announcement → removed from list
- [ ] Toggle publish → only published visible publicly
- [ ] Same for: agenda, schedule, members, gallery

### Gallery
- [ ] Upload image → stored in Supabase Storage → URL saved to DB
- [ ] Image appears in public gallery
- [ ] Delete image → removed from storage + DB
- [ ] File type validation (JPEG/PNG/WebP only)
- [ ] File size validation (≤5MB)
- [ ] Upload error → toast notification

### Supabase Errors
- [ ] Network error → graceful fallback / toast
- [ ] RLS violation → operation blocked, no data leaked
- [ ] Empty table → empty state displayed

### Loading & Empty States
- [ ] Data loading → spinner shown
- [ ] No data → PlaceholderNote or empty state
- [ ] Error fetching → error message / toast

### Responsive
- [ ] Admin sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Forms stack vertically on mobile
- [ ] Gallery masonry responsive

---

## 11. Acceptance Criteria

The implementation is complete when:

1. **Auth works:** Google sign-in, guest mode, sign out, session persistence
2. **Three roles:** User (public), admin, owner — each with correct access
3. **Admin panel:** All CRUD routes functional with proper role guards
4. **Gallery:** Upload, display, delete via Supabase Storage
5. **All content:** Announcements, agenda, schedule, members, organization — admin CRUD + public display
6. **Public pages:** Display real Supabase data (not static placeholders)
7. **RLS enforced:** No data leaks via direct API calls
8. **No Convex:** Zero Convex references in codebase (verified via grep)
9. **Build passes:** `tsc -b && vite build` with zero errors in own code
10. **Responsive:** All pages work on mobile
11. **Design consistent:** Admin panel uses existing design system (Fraunces, mono kickers, glass, grain)
12. **No unnecessary deps:** Only `@supabase/supabase-js` added

---

## 12. Risks & Technical Decisions

### Security Risks
| Risk | Mitigation |
|---|---|
| Frontend-only role checks | RLS policies enforce at DB level; frontend is UX only |
| Guest user escalation | Guest has no Supabase session → cannot write to any table via RLS |
| Service-role key in frontend | Never. Only anon key used. `.env.example` documents this |
| Storage abuse | File type + size validation client-side; Supabase Storage policies server-side |

### Technical Decisions
| Decision | Rationale |
|---|---|
| 3 tables for content vs 1 JSONB table | Relational is simpler for filtering/sorting/date queries |
| `organization_settings` as JSONB key-value | Class info is config-like, not row-based; avoids schema churn |
| Guest = localStorage flag | No Supabase anonymous auth needed; guest is "view-only mode" |
| Hooks per feature | Each feature has its own hook — simple, composable, no over-engineering |
| `src/lib/db.ts` as query layer | Avoids scattering `.from()` calls in components |
| Single SQL migration for all tables | Simpler than 6 separate files; one migration = one atomic operation |

### Decisions Requiring Clarification
| Topic | Question |
|---|---|
| First owner | Who is the first owner? Must be set manually in Supabase Dashboard |
| `organization_settings` initial data | Should `KelasInfo` from `src/data/kelas.ts` seed the initial settings row? |
| Announcements `body` field | Does the design need a rich text editor, or plain text / markdown suffices? |
| Gallery aspect ratios | Admin uploads photos of varying sizes — should aspect ratio be auto-detected or manually set? |
| Schedule edit granularity | Is per-row edit sufficient, or does the admin need to edit an entire day at once? |
| `src/data/kelas.ts` fate | After all pages connect to Supabase, should this file be deleted or kept as seed data reference? |

---

*This plan was generated from analysis of the Graphify code graph and direct source inspection of all relevant files. Every file path, interface name, and data flow described herein reflects the actual current state of the repository.*
