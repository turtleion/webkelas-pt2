import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, Shield, LayoutDashboard } from "lucide-react";
import { KelasMark } from "./KelasMark";
import { useOrganization } from "@/hooks/use-organization";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Beranda", end: true },
  { to: "/anggota", label: "Anggota" },
  { to: "/organisasi", label: "Organisasi" },
  { to: "/jadwal", label: "Jadwal" },
  { to: "/pengumuman", label: "Pengumuman" },
  { to: "/agenda", label: "Agenda" },
  { to: "/galeri", label: "Galeri" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0 border-b border-b-border/60">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-1.5 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-widest focus:text-primary-foreground"
      >
        Langsung ke konten
      </a>

      {/* masthead — baris atas ala kepala surat */}
      <div className="hidden border-b border-border/70 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 md:px-8">
          <span className="kicker text-[10px]">{kelas.sekolah.toUpperCase()}</span>
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

          <nav aria-label="Navigasi utama" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "border-b pb-0.5 font-mono text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-150",
                    isActive
                      ? "border-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Link Admin / Dashboard */}
            {isAdmin ? (
              <NavLink
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Shield className="size-3.5" />
                Panel Admin
              </NavLink>
            ) : isAuthenticated ? (
              <NavLink
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded border border-border bg-card/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-foreground hover:bg-card transition-colors"
              >
                <LayoutDashboard className="size-3.5" />
                Ruang Anggota
              </NavLink>
            ) : (
              <NavLink
                to="/auth"
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Masuk
              </NavLink>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="flex size-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-card lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* menu mobile */}
      {open && (
        <div id="menu-mobile" className="border-t border-border lg:hidden">
          <nav
            aria-label="Navigasi mobile"
            className="mx-auto max-w-6xl px-5 py-3 md:px-8"
          >
            {NAV.map((item) => (
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
                  Hal. {String(NAV.indexOf(item) + 1).padStart(2, "0")}
                </span>
              </NavLink>
            ))}

            <div className="pt-4 pb-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground"
                >
                  <Shield className="size-4" /> Buka Panel Admin
                </Link>
              ) : isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full border border-border bg-card py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground"
                >
                  <LayoutDashboard className="size-4" /> Ruang Anggota
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground"
                >
                  Masuk ke Arsip
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
