import { Link } from "react-router";
import { Instagram, Mail } from "lucide-react";
import { KelasMark } from "./KelasMark";
import { kelas } from "@/data/kelas";

const TAUTAN = [
  { to: "/", label: "Beranda" },
  { to: "/anggota", label: "Anggota kelas" },
  { to: "/organisasi", label: "Struktur organisasi" },
  { to: "/jadwal", label: "Jadwal pelajaran" },
  { to: "/pengumuman", label: "Pengumuman" },
  { to: "/agenda", label: "Agenda kelas" },
  { to: "/galeri", label: "Galeri & dokumentasi" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 md:mt-28">
      <div className="rule-double" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <KelasMark className="size-11 text-primary" />
              <span className="leading-tight">
                <span className="block font-display text-xl font-semibold tracking-tight">
                  X TKJ 1
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Arsip Kelas Digital
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
              Ruang digital kelas X TKJ 1 — {kelas.sekolah}. Pengumuman, jadwal,
              agenda, dan dokumentasi kelas dikumpulkan di satu tempat.
            </p>
            <p className="kicker mt-6 text-[10px]">
              Tahun ajaran {kelas.tahunAjaran} · Semester {kelas.semester}
            </p>
          </div>

          <nav aria-label="Tautan footer" className="md:col-span-3">
            <h2 className="kicker text-[10px]">Jelajahi</h2>
            <ul className="mt-4 space-y-2.5">
              {TAUTAN.map((t) => (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className="text-[13.5px] text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="kicker text-[10px]">Kontak & medsos</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={kelas.kontak.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13.5px] text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  <Instagram className="size-3.5 text-muted-foreground" aria-hidden />
                  {kelas.kontak.instagram}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${kelas.kontak.email}`}
                  className="inline-flex items-center gap-2 text-[13.5px] text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                  {kelas.kontak.email}
                </a>
              </li>
              <li className="pt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {kelas.alamatSekolah}
              </li>
            </ul>
            <p className="kicker mt-6 text-[9px] text-muted-foreground/80">
              Kontak di atas placeholder — ganti dengan data asli pengurus kelas.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="kicker text-[9px]">
            © 2026 X TKJ 1 · {kelas.sekolah}
          </p>
          <p className="kicker text-[9px] text-muted-foreground/80">
            Data contoh — hubungi pengurus kelas untuk pembaruan
          </p>
        </div>
      </div>
    </footer>
  );
}
