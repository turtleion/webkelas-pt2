# 📚 Arsip Kelas Digital — X TKJ 1

> **Ruang digital kelas X TKJ 1 · SMK Negeri 1 Cerme**
> Arsip kertas bertemu teknologi modern — pengumuman, jadwal, agenda, anggota, galeri, dan dokumentasi kelas dalam satu tempat.

[![Vite](https://img.shields.io/badge/Vite-7-%23646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-%2361DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-%2306B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-%23119E48?logo=capacitor&logoColor=white)](https://capacitorjs.com)

---

## ✨ Apa Itu Ini?

**Arsip Kelas Digital** adalah aplikasi web + Android untuk kelas X TKJ 1 — sebuah *class archive* yang menggantikan papan pengumuman fisik dengan versi digital yang hidup:

- 📢 **Pengumuman & Artikel** — informasi kelas yang rapi dan mudah dibaca
- 📅 **Jadwal Pelajaran** — jadwal harian yang selalu ter-update
- 🗓️ **Agenda & Tugas** — catatan kegiatan dan tugas kelas
- 👥 **Anggota & Organisasi** — profil teman sekelas dan struktur organisasi
- 🖼️ **Galeri** — dokumentasi momen kelas
- 🔔 **Notifikasi Harian** — pengingat otomatis jadwal esok hari, langsung ke perangkat
- 📱 **Aplikasi Android** — dibangun dengan Capacitor, bisa di-install langsung dari APK

Gaya visualnya terinspirasi **arsip kertas klasik** — hangat, berkarakter, dengan sentuhan kaca (glassmorphism) yang selektif. Bisa diganti tema layout di pengaturan (Bento, Showcase, Modern, Experimental, Nature, Classic).

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Frontend** | React 19 + TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 + Shadcn UI |
| **Routing** | React Router v7 |
| **Animasi** | Framer Motion |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **Push Notification** | FCM via Capacitor Push Notifications |
| **Platform Native** | Capacitor 8 (Android) |
| **Icons** | Lucide |

---

## 📁 Struktur Proyek

```
├── src/
│   ├── components/       # Komponen UI (site, admin, home layouts, ui)
│   ├── pages/            # Halaman publik & admin
│   ├── hooks/            # React hooks (data fetching, auth, dll)
│   ├── lib/              # Utilitas, i18n, auth, db client
│   ├── context/          # React context (preferensi)
│   ├── data/             # Data statis
│   └── main.tsx          # Entry point + route definitions
├── public/               # Aset publik (logo, manifest, redirects)
├── android/              # Proyek Android (Capacitor)
├── .github/workflows/    # CI/CD (build debug & release APK)
├── capacitor.config.ts   # Konfigurasi Capacitor
├── netlify.toml          # Deploy Netlify
└── vite.config.ts        # Konfigurasi Vite
```

---

## 🚀 Menjalankan di Lokal

### Prasyarat

- Node.js ≥ 22
- pnpm ≥ 9

### Instalasi

```bash
# 1. Install dependency
pnpm install

# 2. Siapkan environment
cp .env.example .env.local   # isi dengan kredensial Supabase kamu
```

| Variabel | Deskripsi |
|---|---|
| `VITE_SUPABASE_URL` | URL proyek Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon public key Supabase |
| `VITE_GOOGLE_WEB_CLIENT_ID` | OAuth Google client ID (web) |

### Menjalankan

```bash
pnpm run dev        # Development server → http://localhost:5173
pnpm run build      # Build production → dist/
pnpm run lint       # ESLint check
pnpm run preview    # Preview hasil build
```

### Build Android

```bash
pnpm run build                  # Build web assets
npx cap sync android            # Sync ke proyek Android
cd android && ./gradlew assembleDebug   # Build APK debug
```

APK dihasilkan di `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🔄 CI/CD

Dua workflow GitHub Actions untuk build otomatis:

| Workflow | Trigger | Output |
|---|---|---|
| **build-debug.yml** | Manual (workflow_dispatch) | APK debug sebagai artifact |
| **build-release.yml** | Tag `v*` | APK release + GitHub Release |

Web app di-deploy ke **Netlify** (konfigurasi di `netlify.toml`).

---

## 🏗️ Arsitektur Singkat

- **SPA React** dengan lazy-loading per route — halaman hanya dimuat saat dibutuhkan.
- **Supabase** sebagai backend: database PostgreSQL, autentikasi Google OAuth, dan RLS (Row Level Security) untuk kontrol akses — admin/owner punya akses khusus.
- **Mode tamu** — pengunjung bisa menjelajah tanpa akun; fitur tertentu butuh verifikasi/akun.
- **Notifikasi harian**: cron di Supabase (pg_cron) → generate ringkasan → push FCM ke Android atau banner in-app di web.
- **Satu codebase** untuk web + Android via Capacitor — halaman `/download` khusus web, tidak dimasukkan ke build Android.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan edukasi dan dokumentasi kelas X TKJ 1.

---

Dibuat dengan ❤️ untuk X TKJ 1 · SMK Negeri 1 Cerme