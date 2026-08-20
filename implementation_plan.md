# Implementation Plan — Invitation-Based Registration & Verified Access

Status: PLAN ONLY — nothing implemented yet.
Scope: add `verified` registration state on top of existing Google auth, gate `/pengumuman` `/jadwal` `/agenda` behind it, add `/register` + Owner-only invitation management. Existing Supabase architecture preserved; smallest possible schema change.

---

## 1. Current Architecture Analysis

### Auth layer (`src/lib/auth.ts`)
- **Google OAuth is the only real login** (`signInWithGoogle` → `supabase.auth.signInWithOAuth({ provider: "google" })`). Email OTP was removed previously.
- **Guest mode is frontend-only**: boolean flag in `localStorage("arsip_guest")`. No Supabase session, no DB row. `getAuthState()` returns `{ id: "guest", role: "member", guest: true }` for guests.
- `mapUser()` reads `profiles` row (`id, name, image, email, role`) for the session user. Role defaults to `"member"`; `"owner"`/`"admin"` mapped from DB.
- `onAuthChange()` wraps `supabase.auth.onAuthStateChange` with debounce; emits full `AuthState`.
- `AuthUser = { id, email, name, image, role, guest }` — **no verified concept today**.

### Database (migrations in `supabase/migrations/`, applied manually via Supabase SQL Editor — stated in each file header)
- `public.profiles` (0001): `id uuid PK → auth.users(id) cascade`, `name`, `image`, `email`, `role text check in ('admin','member','owner') default 'member'`, `settings jsonb default '{}'` (added 0003), timestamps.
- Trigger `on_auth_user_created` → `handle_new_user()` (security definer): **every new Google signup automatically gets a profiles row**. So "profile exists" ≠ "registered"; today they are indistinguishable.
- Content tables (0002): `announcements`, `agenda_items`, `schedules`, `members`, `gallery_photos`, `organization_settings` (jsonb key-value).
- RLS helpers (security definer, stable): `public.is_owner()`, `public.is_admin_or_owner()`.
- Profiles RLS: public read (`using (true)` from 0004), update own (`auth.uid() = id`), owner updates any row (role management).
- **No `verified` column, no invitation concept anywhere** (grep confirmed).
- **Critical existing hole relevant to this feature**: the "update own profile" policy is row-level only — any authenticated user can currently UPDATE *any* column of their own row, including `role` and (once added) `verified`. See §11 for the column-grant fix; without it the whole feature is decorative.

### Routing / guards
- `src/main.tsx`: `PreferencesProvider > BrowserRouter > Suspense > Routes`.
- Guards exist and are reusable patterns:
  - `src/components/RequireAuth.tsx` — spinner while loading; anonymous → `/auth?returnTo=<path>`.
  - `src/components/admin/RequireAdmin.tsx` — non-admin → `/dashboard`.
  - `src/components/admin/RequireOwner.tsx` — non-owner → `/admin`.
- **Currently public (unguarded)**: `/`, `/anggota`, `/organisasi`, `/jadwal`, `/pengumuman`, `/agenda`, `/galeri`, `/settings`, `/auth`.
- Guarded: `/dashboard` (RequireAuth), `/admin/*` (RequireAdmin), `/admin/users` (RequireOwner).
- `/auth` page (`src/pages/Auth.tsx`) already implements safe internal redirect: `resolveRedirectAfterAuth()` accepts only strings starting with `/` and not `//`.

### State propagation caveat
`useAuth()` holds **local component state**, not context. Two components calling `useAuth()` each fetch independently; there is no shared store. After redeeming a code, other mounted components will not see `verified=true` until their own re-fetch or a full page load. Plan accounts for this (§9, §10).

### Admin panel
- `AdminSidebar.tsx` already has an owner-conditional nav pattern: `...(isOwner ? [{ to: "/admin/users", ... }] : [])`. Extend it.
- Page scaffolding to reuse: `AdminLayout`, `PageHeader`, `DataTable`, `ConfirmDialog`, `Button`, `Dialog`, `Input`; data-fetch style copied from `AdminUsers.tsx` (local `useState` + `fetchProfiles` callback pattern).
- i18n: all admin UI translated via `useTranslation()`; keys live in `src/lib/i18n/{types,id,en}.ts`. New pages must add keys to all three files.

---

## 2. Proposed Authentication State Model

| State | Determined by | Can access |
|---|---|---|
| **Anonymous** | No Supabase session, no guest flag | `/`, homepage overviews, `/auth`, `/anggota`, `/organisasi`, `/galeri`, `/settings` |
| **Guest** | `arsip_guest=1`, no Supabase session | Same as anonymous (treated as anonymous for gating; keeps existing `/dashboard` guest workspace behavior untouched) |
| **Authenticated, unverified** | Supabase session + `profiles.verified = false` | Everything above + `/register` only among new gates |
| **Authenticated, verified** | Supabase session + `profiles.verified = true` | Everything, incl. `/pengumuman`, `/jadwal`, `/agenda`, plus role-based `/admin/*` |

Key decisions:
1. **Google-authenticated ≠ registered.** Profile row existence is NOT registration (auto-created by trigger). `profiles.verified` is the registration flag.
2. **Guests are treated as anonymous** by the new gate. They have no DB identity, so they cannot be verified. Their existing `/dashboard` access stays as-is (not part of this change).
3. Roles unchanged: invitation never grants `admin`/`owner`; new registrants stay `member` (the DB default).

---

## 3. Route Protection Changes

Exact edits in `src/main.tsx`:

| Route | Today | After |
|---|---|---|
| `/` | public | public (unchanged — overviews stay visible) |
| `/anggota`, `/organisasi`, `/galeri`, `/settings` | public | public (unchanged) |
| `/auth` | public | public |
| `/jadwal` | **public** | `<RequireVerified>` |
| `/pengumuman` | **public** | `<RequireVerified>` |
| `/agenda` | **public** | `<RequireVerified>` |
| `/register` | — | new, public route (page self-guards, see §9) |
| `/dashboard` | RequireAuth | RequireAuth (unchanged) |
| `/admin/*` | RequireAdmin | RequireAdmin (unchanged) |
| `/admin/users` | RequireOwner | RequireOwner (unchanged) |
| `/admin/invitation-codes` | — | new, `<RequireOwner>` |

New guard `src/components/RequireVerified.tsx` (modeled on `RequireAuth.tsx`):

```
isLoading            → spinner (same markup as RequireAuth)
guest                → Navigate /auth?returnTo=<path+search>
!isAuthenticated     → Navigate /auth?returnTo=<path+search>
authenticated,
  verified unknown   → spinner (brief; verified arrives with mapUser)
  !verified          → Navigate /register?returnTo=<path+search>
  verified           → children
```

Homepage exception preserved: `Home.tsx` sections and their "view all" links are untouched; only the destination routes gain guards, so clicking through from `/` triggers login → register → return flow naturally.

---

## 4. Registration Flow

```
Anonymous ──▶ /pengumuman
                 │ RequireVerified
                 ▼
             /auth?returnTo=/pengumuman        (Google button only path matters here)
                 │ signInWithGoogle (redirectTo: origin)
                 ▼
             back on site → RequireVerified re-evaluates
                 │
       ┌─────────┴──────────┐
   verified=true        verified=false
       │                    │
       ▼                    ▼
  /pengumuman         /register?returnTo=/pengumuman
                            │ enter code
                            ▼
                     RPC redeem_invitation_code  (atomic, §6)
                            │ ok
                            ▼
                     full reload → /pengumuman
```

Direct visits:

```
/register while anonymous/guest → page renders Google sign-in prompt (no auto-redirect loop;
                                  after OAuth return, RequireVerified-style logic inside page shows form)
/register while verified        → Navigate to returnTo || "/"
/register while unverified      → invitation form
```

Redirect safety: reuse `resolveRedirectAfterAuth` semantics — accept only values starting with `/` and not starting with `//`; fallback `/`. Extract into a tiny shared helper (`src/lib/redirect.ts`) so `/auth` and `/register` share one implementation. No query-string external URLs, no open redirects.

---

## 5. Invitation Code Database Design

One new table + one column. Follows existing conventions (uuid PK, timestamptz, `created_at default now()`, FKs to `profiles(id)`).

```sql
alter table public.profiles
  add column if not exists verified boolean not null default false;

create table if not exists public.invitation_codes (
  id          uuid primary key default gen_random_uuid(),
  code_hash   text not null unique,        -- sha256 hex of the code; plaintext never stored
  code_prefix text not null,               -- first 4 chars, Owner UI identification only
  created_by  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,        -- created_at + interval '7 days', set by RPC
  used_at     timestamptz,
  used_by     uuid references public.profiles(id) on delete set null,
  constraint invitation_codes_not_used_by_creator_check ... -- see note
);

create index if not exists idx_invitation_codes_created
  on public.invitation_codes (created_at desc);
```

Notes:
- **No `status` column** — derivable: `used_at is not null` → Used; `used_at is null and now() >= expires_at` → Expired; else Active. Matches instruction to avoid redundant status.
- `code_hash unique` doubles as the uniqueness constraint and lookup key.
- Expiration always server-side: comparisons use `now()` inside Postgres, never client clock.
- The creator-check constraint idea is dropped — an Owner redeeming their own code is harmless and not worth a rule.

---

## 6. Invitation Code Security

### Single-use guarantee (race condition)
Consumption is **one atomic SQL statement inside a security-definer RPC** — no read-then-write window:

```sql
create or replace function public.redeem_invitation_code(p_code_hash text)
returns text                       -- 'ok' | 'invalid' | 'expired' | 'used' | 'already_verified'
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then return 'invalid'; end if;

  -- reject double-registration
  if exists (select 1 from profiles where id = auth.uid() and verified) then
    return 'already_verified';
  end if;

  -- atomic claim: only succeeds if row still unused and unexpired (server time)
  update invitation_codes
     set used_at = now(), used_by = auth.uid()
   where code_hash = p_code_hash
     and used_at is null
     and expires_at > now()
   returning id into v_id;

  if v_id is null then
    return coalesce(
      (select case when used_at is not null then 'used' else 'expired' end
         from invitation_codes where code_hash = p_code_hash),
      'invalid');
  end if;

  update profiles set verified = true where id = auth.uid();
  return 'ok';
end $$;
```

Two simultaneous submissions: Postgres serializes the UPDATE row lock; exactly one gets `v_id`, the other sees `used_at is not null` → `'used'`. Case H satisfied.

### Hashing vs plaintext — decision: **hashed**
Codes are credentials. Store `sha256(code)` only:
- Client generates code with `crypto.getRandomValues`, computes `crypto.subtle.digest('SHA-256', …)` (Web Crypto, already available; no new dependency), sends hash + prefix to creation RPC.
- Unsalted SHA-256 is appropriate because codes are ~128-bit uniform random — preimage/brute-force infeasible; salt would add nothing.
- DB leak exposes no usable codes.
- Owner UX unaffected: plaintext shown once at creation with copy button; table shows `code_prefix`, dates, status, used-by email (join via RPC view below).

### Creation RPC (Owner-only)

```sql
create or replace function public.create_invitation_code(p_code_hash text, p_prefix text)
returns invitation_codes
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise insufficient_privilege; end if;
  insert into invitation_codes (code_hash, code_prefix, created_by, expires_at)
  values (p_code_hash, p_prefix, auth.uid(), now() + interval '7 days')
  returning * into ...;
end $$;
```

Expiration fixed server-side at 7 days; Owner never enters a date.

### Listing (Owner-only)
Owner table needs used-by name/email, but `used_by` is a uuid and RLS hides nothing here if we just allow owner select. Simplest correct setup:
- RLS: `enable row level security`; one policy: `for select to authenticated using (public.is_owner())`. **No insert/update/delete policies** — the table is writable only through the two security-definer RPCs, so even the Owner cannot hand-edit `expires_at`/`used_at` via PostgREST.
- Used-by display: second RPC `list_invitation_codes()` (security definer, `is_owner()` check) returning rows joined with `profiles` for `used_by` name/email. Avoids giving owners-row joins complexity to the client.

### What normal users cannot do (all enforced in DB, not UI)
- Create codes → no insert grant/policy; RPC checks `is_owner()`.
- List codes → RLS select policy owner-only.
- Mark self/others verified → **column-grant fix (§11)** removes direct UPDATE path; only RPC sets `verified`.
- Mark codes used / edit expiry → no update path exists at all.

### Error-message policy (§14 of request)
Client maps RPC results to **two generic messages**: `'ok'` → success; everything else → "Kode invitasi tidak valid atau sudah kedaluwarsa." Specific reasons (`used`/`expired`) are returned by the RPC for potential future debugging but are NOT surfaced distinctly, preventing code-enumeration oracle. Recommendation accepted: generic message.

### Code format
Generated client-side: 16 chars from alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (excludes I, L, O, 0, 1), grouped `XXXX-XXXX-XXXX-XXXX`. ~80 bits of entropy — far beyond brute-force reach within a 7-day window, still typeable and shareable via chat. Dashes stripped before hashing. Not sequential, not predictable.

---

## 7. Existing User Migration

Current population: small class site; every existing profiles row belongs to a real class member/officer who already uses the app (including the Owner and Admins).

Migration (same SQL file, run once):

```sql
update public.profiles set verified = true where verified = false;
```

- Explicitly **does not** leave existing users locked out.
- All future Google signups get `verified = false` from the column default via `handle_new_user()` (trigger needs no change — default applies).
- Edge cases: B (existing user logs in → verified → straight in), C (post-migration new signup → unverified → `/register`).

---

## 8. Owner Invitation Management

New page `src/pages/admin/AdminInvitationCodes.tsx`, route `/admin/invitation-codes`, wrapped in existing `<RequireOwner>`. Sidebar entry appended to the existing `isOwner` spread in `AdminSidebar.tsx` (icon: `Ticket` from lucide).

UI (reuses `AdminLayout`, `PageHeader`, `DataTable`):
- Header + primary button "Buat Kode Invitasi" (one click, no form dialog — expiration automatic).
- On create: generate code client-side (§6 format), call `create_invitation_code`, then show a one-time reveal card: full code in mono font + **Copy** button (navigator.clipboard) + note "Kode hanya ditampilkan sekali."
- Table columns: Kode (`XXXX` prefix…), Dibuat, Kedaluwarsa, Status, Digunakan Oleh, Digunakan Pada.
- Status derivation client-side from `used_at`/`expires_at` compared against server-provided current time (RPC returns `now()` as `server_now` to avoid clock skew): Used (consumed) / Expired (unused, past expiry) / Active. Used and Expired are visually distinct badges; a used code is never labeled merely "expired".

i18n keys added under `admin.invitations.*` in `types.ts` / `id.ts` / `en.ts`.

---

## 9. `/register` UI

New `src/pages/Register.tsx`, styled like `Auth.tsx` (glass card, KelasMark header).

States:
1. **Loading** — auth state resolving → spinner.
2. **Not signed in / guest** — explanation + Google sign-in button (calls `signInWithGoogle`; OAuth round-trip returns to `/register`). Guest sees same prompt (guests cannot register).
3. **Already verified** — immediate `<Navigate to={returnTo || "/"} replace />`.
4. **Form** — copy: account authenticated, invitation code required to complete registration. Single input (auto-uppercase, dash-tolerant), Continue button, "Keluar / gunakan akun lain" link (signOut → `/auth`).
5. **Submitting** — disabled button + spinner.
6. **Error** — generic invalid/expired message (§6). Distinct non-enumerating handling of network errors ("Terjadi kesalahan, coba lagi.").
7. **Success** — brief confirmation, then `window.location.assign(internalReturnTo)`.

Why full reload instead of SPA navigate: `useAuth` is per-component local state (§1); a reload guarantees the header, guards, and target page all observe `verified=true` with zero stale-state bugs. Cost: one page load, once per account lifetime. Session itself persists (Supabase stores the session in local storage) — **no second Google login** (§16 requirement met).

---

## 10. Routing / Redirect Logic

- `returnTo` captured by `RequireVerified` from `location.pathname + location.search`, passed as `?returnTo=` to `/auth` and onward to `/register`.
- `/auth` already forwards `returnTo` post-login; extend its post-login effect: if the resolved destination is a verified-only route and user is unverified, go to `/register?returnTo=…` instead. (Simplest: point the Google-button flow's redirect resolution through one helper that knows the three gated prefixes.)
- Shared validation helper (extracted from `Auth.tsx`): accepts `/…`, rejects `//`, `http`, etc. Used by `/auth`, `/register`, `RequireVerified`.
- Verified users are never blindly sent to `/`: original destination wins; fallback `/`.
- Open-redirect: impossible by construction (single validator, internal-prefix only).

Edge cases A–H disposition:
- A new account → trigger creates profile (`verified=false`) → `/register`. ✔
- B existing verified → straight to destination. ✔
- C unverified → `/register`. ✔
- D verified visits `/register` → redirected out. ✔
- E anonymous `/pengumuman` → chain returns them there. ✔
- F expired → rejected (server time). ✔
- G used → rejected. ✔
- H concurrent same code → atomic UPDATE, one winner. ✔

---

## 11. Supabase / RLS Changes

Single migration file: `supabase/migrations/202608210001_invitation_registration.sql` (follows repo naming convention; applied manually via Supabase SQL Editor like all prior migrations).

Contents:
1. `alter table public.profiles add column if not exists verified boolean not null default false;`
2. **Column-grant lockdown (closes the pre-existing self-update hole for the new column):**
   ```sql
   revoke update on public.profiles from authenticated;
   grant update (name, image, email, settings) on public.profiles to authenticated;
   ```
   Effect: users keep updating their own editable fields (existing settings/personalization flow unaffected — it writes only `settings`), but `verified` and `role` are no longer writable through PostgREST by the row owner. Owner role-management continues to work because `updateProfileRole` runs as the owner… **conflict noted**: the owner also loses direct UPDATE via this grant. Resolution: convert role changes to a tiny security-definer RPC `set_user_role(p_user uuid, p_role text)` with `is_owner()` check (mirrors existing helper), and update `db.updateProfileRole` to call it. This is the one unavoidable touching of existing code beyond additions; documented rather than hidden.
3. `create table invitation_codes …` + index (§5).
4. RLS on `invitation_codes`: enable; owner-only select policy; deliberately no write policies.
5. RPCs: `redeem_invitation_code`, `create_invitation_code`, `list_invitation_codes` (§6), all `security definer` with explicit `set search_path = public` (matches existing helper convention).
6. Backfill: `update profiles set verified = true;` (§7).
7. `grant execute` on the three RPCs to `authenticated` (redeem/create/list as appropriate; create/list additionally guarded internally by `is_owner()`).

No changes to: content tables, storage buckets, auth triggers (default column value suffices), existing helper functions.

---

## 12. Files Modify / Create

Create:
- `supabase/migrations/202608210001_invitation_registration.sql`
- `src/components/RequireVerified.tsx`
- `src/pages/Register.tsx`
- `src/pages/admin/AdminInvitationCodes.tsx`
- `src/lib/redirect.ts` (shared internal-redirect validator, extracted from `Auth.tsx`)
- `src/lib/invitation-codes.ts` (client generator: alphabet, grouping, sha256 via Web Crypto)

Modify:
- `src/lib/auth.ts` — `AuthUser` gains `verified: boolean`; `mapUser` selects `verified`; guest user gets `verified: false`.
- `src/hooks/use-auth.ts` — expose `isVerified` (computed, guest-aware).
- `src/main.tsx` — `/register` route; wrap `/jadwal`, `/pengumuman`, `/agenda` in `RequireVerified`; `/admin/invitation-codes` in `RequireOwner`.
- `src/lib/db.ts` — `createInvitationCode`, `listInvitationCodes`, `redeemInvitationCode` wrappers (RPC calls); switch `updateProfileRole` to `set_user_role` RPC.
- `src/components/admin/AdminSidebar.tsx` — owner nav entry.
- `src/pages/Auth.tsx` — use shared redirect helper; forward `returnTo` into `/register` when user unverified.
- `src/lib/i18n/types.ts`, `src/lib/i18n/id.ts`, `src/lib/i18n/en.ts` — `register.*` and `admin.invitations.*` key groups (both languages complete).

Untouched (explicitly): `Home.tsx` and all homepage overview sections, preferences/theme system, content hooks/pages, storage, `RequireAuth`/`RequireAdmin`/`RequireOwner` internals.

---

## 13. Implementation Order

1. Migration SQL written (not executed).
2. `src/lib/redirect.ts` extraction + `Auth.tsx` refactor (behavior-neutral, buildable alone).
3. `auth.ts`/`use-auth.ts`: add `verified` (reads fine before column exists? No — select of missing column errors; therefore steps 3+ require migration applied first. Order: apply migration manually, then continue.)
   → Revised: **Step 3 = user applies migration (Manual Action #1). Steps 4+ depend on it.**
4. `auth.ts` + `use-auth.ts` verified plumbing.
5. `RequireVerified.tsx` + route wrapping in `main.tsx` (gates active; unverified users land on `/register` which doesn't exist yet → create Register stub in same step).
6. `lib/invitation-codes.ts` + `db.ts` RPC wrappers.
7. `Register.tsx` full implementation + i18n keys.
8. `set_user_role` RPC switch in `db.ts` (paired with migration from step 1 — included there).
9. `AdminInvitationCodes.tsx` + sidebar entry + i18n keys.
10. Validation pass (§14 tests), `npm run build`.

---

## 14. Manual Actions (cannot be done by Claude Code)

1. **Run migration** `202608210001_invitation_registration.sql` in Supabase Dashboard → SQL Editor (repo convention; includes backfill + grants + RPCs).
2. Verify Google OAuth redirect URLs unchanged (no config change expected — flow reuses existing provider setup).
3. Tests requiring multiple real accounts/browser profiles:
   - Race test: two browsers submit same valid code simultaneously → exactly one success, other sees generic error, code shows Used.
   - Expired-code test: temporarily `update invitation_codes set expires_at = now() - interval '1 hour'` → rejected; revert.
   - RLS tests (as plain member, e.g. via Supabase JS in console): `insert`/`update`/`delete` on `invitation_codes` → permission error; `select` → 0 rows; direct `update profiles set verified = true` → column permission error; `update profiles set role = 'owner'` → error.
   - Owner role-change regression: Owner can still change roles via `/admin/users` after grant lockdown.
   - Existing-user migration test: pre-existing account logs in → lands in app, not `/register`.
   - Redirect tests: E-chain end-to-end; crafted `?returnTo=https://evil.com` and `//evil.com` → falls back to `/`.
   - Settings regression: personalization save still works after column-grant change.

---

## Architectural Conflicts Found (documented per instructions)

1. **Self-update RLS hole** — "Users can update own profile settings" policy would let any user set their own `verified` (and already lets them attempt `role`). Fixed via column grants + `set_user_role` RPC (§11.2). Smallest safe fix; alternative (separate `verifications` table) rejected as more restructuring than requested.
2. **Per-component `useAuth` state** — no global store, so post-redeem UI freshness requires full reload (§9). Accepted; cheaper than introducing a context/store refactor this feature doesn't need.
3. **Guest mode ambiguity** — guests report `isAuthenticated: true` today. For gating purposes they are treated as anonymous (no DB identity to verify). Existing guest `/dashboard` behavior intentionally left alone.
