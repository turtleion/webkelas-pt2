import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, LayoutDashboard, Settings, Globe } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { KelasMark } from "./KelasMark";
import { VerificationWarningBar } from "@/components/VerificationWarningBar";
import { useOrganization } from "@/hooks/use-organization";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/** Halaman unduh hanya untuk web — build Android tidak punya route ini. */
const IS_WEB = !Capacitor.isNativePlatform();
/** Halaman Update hanya untuk Android — build web tidak punya route ini. */
const IS_ANDROID = Capacitor.isNativePlatform();

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { isAuthenticated, isAdmin } = useAuth();
  const { t, locale, setLocale } = useTranslation();

  const NAV = [
    { to: "/", label: t.nav.home, end: true },
    ...(IS_WEB ? [{ to: "/download", label: t.nav.download }] : []),
    ...(IS_ANDROID ? [{ to: "/update", label: "Update" }] : []),
    { to: "/anggota", label: t.nav.members },
    { to: "/organisasi", label: t.nav.organization },
    { to: "/jadwal", label: t.nav.schedule },
    { to: "/artikel", label: t.nav.articles },
    { to: "/tugas", label: t.nav.tasks },
    { to: "/agenda", label: t.nav.agenda },
    { to: "/galeri", label: t.nav.gallery },
  ];

  /** Harian — pintu langsung ke ringkasan hari berikutnya. */
  const DAILY = { to: "/daily", label: t.nav.dailyOverview };

  // Tutup dropdown saat klik di luar menu utama (tapi abaikan trigger button —
  // biar onClick-nya yang toggle, bukan pointerdown listener yang mencuri event).
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (mainRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const toggleLanguage = () => void setLocale(locale === "id" ? "en" : "id");

  return (
    <>
      <VerificationWarningBar />
      <header
        className="glass sticky top-0 z-40 border-x-0 border-t-0 border-b border-b-border/60 transition-colors"
        style={{ backgroundColor: "var(--nav)", color: "var(--on-nav)" }}
      >
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-1.5 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-widest focus:text-primary-foreground"
        >
          Langsung ke konten
        </a>

        {/* masthead — baris atas */}
        <div className="hidden border-b border-border/70 md:block">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 md:px-8">
            <span className="kicker text-[10px]">
              {kelas.sekolah.toUpperCase()}
            </span>
            <span className="kicker text-[10px]">
              T.A. {kelas.tahunAjaran} — Semester {kelas.semester.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex h-16 items-center justify-between gap-6">
            <Link to="/" className="group flex items-center gap-3">
              <KelasMark className="size-10 text-primary transition-colors group-hover:text-accent" />
              <span className="leading-tight">
                <span className="block font-display text-lg font-semibold tracking-tight">
                  {kelas.nama}
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Arsip Kelas Digital
                </span>
              </span>
            </Link>

            {/* Hamburger — tampil di semua ukuran layar */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-main"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              className="flex size-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-card"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Dropdown panel — satu pola untuk semua ukuran layar */}
        {open && (
          <div
            id="menu-main"
            ref={mainRef}
            className="mx-auto max-h-[calc(100dvh-6rem)] max-w-2xl overflow-y-auto border-t border-border bg-background/95 backdrop-blur-md md:mx-auto md:mt-1 md:border md:border-border/60 md:shadow-lg"
          >
            <nav aria-label="Navigasi utama" className="px-5 py-3 md:px-8">
              {NAV.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between border-b border-border/60 py-3.5 font-display text-2xl tracking-tight transition-colors last:border-b-0",
                      isActive ? "text-accent" : "text-foreground",
                    )
                  }
                >
                  {item.label}
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Hal. {String(i + 1).padStart(2, "0")}
                  </span>
                </NavLink>
              ))}

              {/* Harian — link langsung ke /daily */}
              <NavLink
                to={DAILY.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between border-b border-border/60 py-3.5 font-display text-2xl tracking-tight transition-colors",
                    isActive ? "text-accent" : "text-foreground",
                  )
                }
              >
                {DAILY.label}
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Hal. {String(NAV.length + 1).padStart(2, "0")}
                </span>
              </NavLink>

              {/* Footer bar — language, settings, auth/admin */}
              <div className="pt-4 pb-2 space-y-2">
                <div className="flex items-center justify-between px-1 py-1 border-b border-border/40">
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="size-3.5" />
                    <span>Bahasa: {locale.toUpperCase()}</span>
                  </button>
                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="size-3.5" />
                    <span>{t.nav.settings}</span>
                  </Link>
                </div>

                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground"
                  >
                    {t.nav.adminPanel}
                  </Link>
                ) : isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full border border-border bg-card py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground"
                  >
                    <LayoutDashboard className="size-4" /> {t.nav.dashboard}
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground"
                  >
                    {t.nav.signIn}
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
