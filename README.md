# Arsip Kelas Digital — X TKJ 1 · SMK Negeri 1 Cerme

Ruang digital kelas X TKJ 1: pengumuman, jadwal pelajaran, agenda, anggota,
organisasi, dan dokumentasi kelas dalam satu tempat. Bergaya arsip kertas
dengan sentuhan kaca (glassmorphism) yang selektif.

## Stack

- Vite + React 19 + TypeScript
- React Router v7 (impor dari `react-router`, bukan `react-router-dom`)
- Tailwind v4 (styling) + Shadcn UI (komponen)
- Lucide (ikon) + Framer Motion (animasi)
- **Supabase** — backend/database/autentikasi (PostgreSQL + Supabase Auth)
- Grafik kode: Graphify di `graphify-out/` (lihat `.agents/rules/graphify.md`)

Semua berkas relevan di `src/`. Gunakan bun untuk manajemen paket.

## Setup

```bash
bun install
bun run dev      # http://localhost:5173
bun run build    # tsc -b && vite build
bun run lint
```

## Environment Variables

Frontend memakai dua variabel (lihat `.env.example`):

- `VITE_SUPABASE_URL` — URL proyek Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` — anon public key

Hanya kunci **anon/publishable** yang dipakai di sisi klien. Kunci service-role
**tidak pernah** boleh masuk ke frontend. Keamanan data dijamin oleh Row Level
Security (RLS) di Supabase, bukan oleh rahasia klien.

## Supabase

Skema database (tabel `profiles`, trigger, RLS) ada di
`supabase/migrations/202608140001_initial.sql`. Jalankan lewat Supabase
Dashboard → SQL Editor, lalu:

- Aktifkan **Google** sebagai penyedia auth (Authentication → Providers).
- Atur **Site URL** dan **Redirect URLs** (mis. `http://localhost:5173`) agar
  callback Google balik ke aplikasi.

Lihat bagian "SUPABASE DASHBOARD SETUP REQUIRED" pada laporan implementasi
untuk daftar lengkap.

## Autentikasi

- **Masuk dengan Google** (Supabase Auth, OAuth).
- **Mode tamu** (guest) — tanda lokal di `localStorage`, bukan akun anonim
  Supabase. Tidak ada baris di DB; cukup agar halaman terlindungi bisa dibuka
  tanpa akun.

Gunakan hook `useAuth` untuk semua kebutuhan data/auth — jangan sentuh Supabase
langsung dari komponen:

```ts
import { useAuth } from "@/hooks/use-auth";

const { isLoading, isAuthenticated, user, signIn, signInAsGuest, signOut } =
  useAuth();
```

`useAuth` mengambil data dari `src/lib/auth.ts` (lapisan data auth) yang
memakai `src/lib/supabase.ts` sebagai klien tunggal. `user` memuat identitas
profil dari tabel `profiles`; untuk tamu, `user.guest === true`.

## Protected Routes

Rute `/dashboard` dilindungi `RequireAuth` — pengunjung yang belum masuk
dialihkan ke `/auth?returnTo=<rute semula>`. Perluas halaman itu untuk
pengalaman khusus anggota, dan pakai ulang `RequireAuth` untuk rute terlindungi
lainnya. Sesi tamu juga lolos `RequireAuth` (dengan peran `member`).

## Struktur Halaman

- `/` Beranda · `/anggota` Anggota · `/organisasi` Organisasi
- `/jadwal` Jadwal · `/pengumuman` Pengumuman · `/agenda` Agenda
- `/galeri` Galeri · `/auth` Masuk · `/dashboard` Ruang anggota

Data halaman publik (anggota, jadwal, dll.) masih contoh/placeholder dan
berada di `src/data/kelas.ts` — ganti dengan data asli sebelum dipublikasikan.

## Frontend Conventions

- Halaman di `src/pages`, komponen di `src/components`, primitif Shadcn di
  `src/components/ui`.
- Tambahkan rute baru di `src/main.tsx`.
- Warna/huruf diatur di `src/index.css` (Tailwind v4, `@theme`). Bahan dasar
  halaman adalah kertas (warna opaque); kaca (`glass`, `glass-strong`,
  `glass-hover`) dipakai selektif.
- Semua halaman responsif, konten di tengah, lebar dibatasi.
- Gunakan `Loader2` (spinner) untuk keadaan memuat; Sonner untuk notifikasi.
