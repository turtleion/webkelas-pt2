import { Link } from "react-router";
import { Instagram, Mail } from "lucide-react";
import { KelasMark } from "./KelasMark";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslation } from "@/hooks/use-translation";

export function SiteFooter() {
  const { t, interpolate } = useTranslation();
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;

  const TAUTAN = [
    { to: "/", label: t.nav.home },
    { to: "/anggota", label: t.nav.members },
    { to: "/organisasi", label: t.nav.organization },
    { to: "/jadwal", label: t.nav.schedule },
    { to: "/pengumuman", label: t.nav.announcements },
    { to: "/agenda", label: t.nav.agenda },
    { to: "/galeri", label: t.nav.gallery },
    { to: "/settings", label: t.nav.settings },
  ];

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
                  {kelas.nama || "Arsip Kelas"}
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t.nav.home}
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
              {interpolate(t.footer.description, {
                sekolah: kelas.sekolah || "",
              })}
            </p>
            <p className="kicker mt-6 text-[10px]">
              {interpolate(t.footer.academicYear, {
                tahunAjaran: kelas.tahunAjaran || "",
                semester: kelas.semester || "",
              })}
            </p>
          </div>

          <nav aria-label="Tautan footer" className="md:col-span-3">
            <h2 className="kicker text-[10px]">{t.footer.explore}</h2>
            <ul className="mt-4 space-y-2.5">
              {TAUTAN.map((taut) => (
                <li key={taut.to}>
                  <Link
                    to={taut.to}
                    className="text-[13.5px] text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {taut.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="kicker text-[10px]">{t.footer.contactSocial}</h2>
            <ul className="mt-4 space-y-3">
              {kelas.kontak.instagram && (
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
              )}
              {kelas.kontak.email && (
                <li>
                  <a
                    href={`mailto:${kelas.kontak.email}`}
                    className="inline-flex items-center gap-2 text-[13.5px] text-foreground/80 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    <Mail className="size-3.5 text-muted-foreground" aria-hidden />
                    {kelas.kontak.email}
                  </a>
                </li>
              )}
              {kelas.alamatSekolah && (
                <li className="pt-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {kelas.alamatSekolah}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="kicker text-[9px]">
            {interpolate(t.footer.copyright, {
              sekolah: kelas.sekolah || "",
            })}
          </p>
          <p className="kicker text-[9px] text-muted-foreground/80">
            {t.footer.sampleData}
          </p>
        </div>
      </div>
    </footer>
  );
}
