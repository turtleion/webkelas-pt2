import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { KelasMark } from "@/components/site/KelasMark";
import { Sparkles, ArrowRight, Shield, Calendar, Bell } from "lucide-react";

export function LivePreview() {
  const { preferences } = usePreferences();
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium tracking-tight">
            {t.settings.previewLabel || "Pratinjau Langsung"}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            Tampilan interaktif komponen website menggunakan token tema dan corak aktif saat ini.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          Mode: {preferences.mode.toUpperCase()} · Tema: {preferences.theme.toUpperCase()}
        </span>
      </div>

      {/* Main Preview Container with Theme Variables and Live Background */}
      <div
        className="relative overflow-hidden rounded-xl border border-border/80 p-5 sm:p-6 shadow-md transition-all"
        style={{
          backgroundImage: "var(--custom-bg-image)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Mock Navigation Bar */}
        <div
          className="glass mb-5 flex items-center justify-between rounded-lg border border-border/70 px-4 py-2.5 shadow-xs transition-colors"
          style={{
            backgroundColor: "var(--nav)",
            color: "var(--on-nav)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <KelasMark className="size-6 text-primary" />
            <div>
              <span className="block font-display text-xs font-bold leading-none tracking-tight">
                X TKJ 1
              </span>
              <span className="block font-mono text-[8px] uppercase tracking-widest opacity-70">
                Arsip Kelas
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider opacity-85">
            <span className="border-b border-accent pb-0.5 font-bold opacity-100">{t.nav.home}</span>
            <span>{t.nav.members}</span>
            <span>{t.nav.schedule}</span>
            <span>{t.nav.gallery}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary border border-primary/25">
              <Shield className="size-2.5" />
              <span>Admin</span>
            </span>
          </div>
        </div>

        {/* Hero & Heading Area */}
        <div className="mb-6 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent border border-accent/25">
            <Sparkles className="size-2.5" />
            <span>Digital Class Archive</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dokumentasi & Ruang Bersama
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Satu kelas, 36 siswa, dan satu tahun pelajaran — seluruh arsip, jadwal, dan kegiatan dicatat secara rapi di sini.
          </p>
        </div>

        {/* Cards & Surfaces Grid */}
        <div className="grid gap-3.5 sm:grid-cols-3 mb-5">
          {/* Card 1: Pengumuman / Surface */}
          <div
            className="glass glass-hover rounded-lg border border-border/80 p-3.5 flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Bell className="size-2.5 text-accent" />
                  Pengumuman
                </span>
                <span className="font-mono text-[8px] opacity-60">Baru</span>
              </div>
              <h4 className="font-display text-sm font-semibold mb-1">
                Jadwal Ujian Semester
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Pelaksanaan penilaian akhir semester ganjil dimulai hari Senin pekan depan.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex justify-between items-center text-[10px] text-accent font-medium">
              <span>Baca rincian</span>
              <ArrowRight className="size-2.5" />
            </div>
          </div>

          {/* Card 2: Agenda / Surface */}
          <div
            className="glass glass-hover rounded-lg border border-border/80 p-3.5 flex flex-col justify-between transition-all"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-2.5 text-primary" />
                  Agenda
                </span>
                <span className="font-mono text-[8px] opacity-60">18 Ags</span>
              </div>
              <h4 className="font-display text-sm font-semibold mb-1">
                Kerja Bakti Lab TKJ
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                Pembersihan rutin perangkat PC dan perapihan kabel patch cord ruang lab 2.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/40 flex justify-between items-center text-[10px] text-primary font-medium">
              <span>Lihat jadwal</span>
              <ArrowRight className="size-2.5" />
            </div>
          </div>

          {/* Card 3: Tertiary / Highlight Showcase */}
          <div
            className="rounded-lg border border-border/80 p-3.5 flex flex-col justify-between shadow-xs transition-all"
            style={{
              backgroundColor: "var(--tertiary, var(--secondary))",
              color: "var(--on-tertiary, var(--secondary-foreground))",
            }}
          >
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider opacity-80 block mb-1">
                Aksen Tersier
              </span>
              <h4 className="font-display text-sm font-semibold mb-1">
                Status Sistem Kelas
              </h4>
              <p className="text-[11px] opacity-85 leading-relaxed">
                Semua modul aktif dan sinkron dengan basis data sekolah.
              </p>
            </div>
            <div className="mt-3">
              <span className="inline-block rounded px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider bg-black/15 dark:bg-white/15">
                Optimal
              </span>
            </div>
          </div>
        </div>

        {/* Buttons & Interactive Elements Palette Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-border/60">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 font-display text-xs font-semibold shadow-xs transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <span>Tombol Utama</span>
            <ArrowRight className="size-3" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 font-display text-xs font-semibold shadow-xs transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            }}
          >
            <span>Tombol Aksen</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-border bg-card/80 px-3 py-1.5 font-display text-xs font-medium text-foreground transition-all cursor-pointer"
          >
            <span>Tombol Sekunder</span>
          </button>

          <div className="ml-auto hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            <span>Primary</span>
            <span className="size-2 rounded-full bg-accent ml-2" />
            <span>Accent</span>
            <span className="size-2 rounded-full bg-border ml-2" />
            <span>Border</span>
          </div>
        </div>
      </div>
    </div>
  );
}
