import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { PhotoPlate } from "@/components/site/PhotoPlate";
import { Stamp } from "@/components/site/Stamp";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { inisialNama, padNomor, pecahTanggal } from "@/lib/tanggal";
import { useTranslation } from "@/hooks/use-translation";
import type { AnnouncementRow, AgendaRow, MemberRow, GalleryPhotoRow } from "@/lib/db";
import type { KelasInfo } from "@/data/kelas";

interface HomeLayoutProps {
  kelas: KelasInfo;
  pengumuman: AnnouncementRow[];
  agenda: AgendaRow[];
  anggota: MemberRow[];
  galeri: GalleryPhotoRow[];
  faktaIdentitas: Array<[string, string]>;
}

function SectionHead({
  no,
  label,
  title,
  linkTo,
  linkText,
}: {
  no: string;
  label: string;
  title: string;
  linkTo?: string;
  linkText?: string;
}) {
  return (
    <FadeIn>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker text-[10px]">
            No. {no} — {label}
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            {title}
          </h2>
        </div>
        {linkTo && linkText && (
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-1.5 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {linkText}
            <ArrowRight
              className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        )}
      </div>
    </FadeIn>
  );
}

export function HomeClassic({
  kelas,
  pengumuman,
  agenda,
  anggota,
  galeri,
  faktaIdentitas,
}: HomeLayoutProps) {
  const { t, interpolate } = useTranslation();

  const tanggalHariIni = new Date().toISOString().slice(0, 10);
  const agendaAkanDatang = agenda.filter((a) => a.date >= tanggalHariIni);
  const agendaTampil = (
    agendaAkanDatang.length > 0 ? agendaAkanDatang : agenda.slice(-4)
  ).slice(0, 4);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="border-b border-border">
        {/* strip pengumuman terbaru */}
        <div className="border-b border-border/70 bg-card/40">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 md:px-8">
            <p className="kicker flex min-w-0 items-center gap-2.5 text-[10px]">
              <span className="shrink-0 text-accent">{t.home.latestAnnouncements}</span>
              <span aria-hidden className="text-muted-foreground/60">
                —
              </span>
              <span className="truncate text-muted-foreground">
                {pengumuman[0]?.title || t.common.empty}
              </span>
            </p>
            <Link
              to="/pengumuman"
              className="kicker shrink-0 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.home.allAnnouncements} →
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 lg:pr-6">
              <FadeIn>
                <p className="kicker flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px]">
                  <span>Kelas {kelas.nama}</span>
                  <span aria-hidden>—</span>
                  <span>{kelas.jurusan}</span>
                  <span aria-hidden>—</span>
                  <span>T.A. {kelas.tahunAjaran}</span>
                </p>

                <h1 className="mt-6 font-display text-[clamp(3.4rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
                  {kelas.nama}
                </h1>

                <p className="mt-5 max-w-lg font-display text-xl italic leading-snug text-muted-foreground md:text-2xl">
                  {interpolate(t.home.heroSubtitle, { count: kelas.jumlahSiswa || anggota.length })}
                </p>

                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-foreground/80">
                  {interpolate(t.home.heroDescription, { kelas: kelas.nama })}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link
                    to="/pengumuman"
                    className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
                  >
                    {t.home.readAnnouncements}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                  <Link
                    to="/anggota"
                    className="group inline-flex items-center gap-1.5 pb-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {t.home.viewMembers}
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </Link>
                </div>
              </FadeIn>
            </div>

            <div className="relative lg:col-span-5">
              <div className="flex h-full flex-col justify-between gap-8 lg:border-l lg:border-border lg:pl-8">
                <FadeIn delay={120}>
                  <div className="relative ml-auto max-w-sm md:max-w-md">
                    <PhotoPlate
                      aspect="4 / 5"
                      src={galeri[0]?.image_url || undefined}
                      label="Dok. 001 — Foto kelas"
                      caption={galeri[0]?.title || `Foto kelas ${kelas.nama} — MPLS ${kelas.tahunAjaran}`}
                      date={galeri[0]?.date ? pecahTanggal(galeri[0].date).teks : "14 Jul 2026"}
                    />
                    <Stamp className="absolute -left-4 top-8 hidden -rotate-6 sm:inline-block">
                      Arsip Kelas · {kelas.tahunAjaran}
                    </Stamp>
                  </div>
                </FadeIn>
                <p className="kicker hidden text-right text-[9px] lg:block">
                  Dok. 001 — {galeri[0]?.image_url ? "Foto dokumentasi kelas" : "foto belum diarsip"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IDENTITAS KELAS ================= */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <SectionHead no="01" label={t.nav.organization} title={t.home.classIdentity} />
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                {interpolate(t.home.classIdentityDesc, {
                  kelas: kelas.nama,
                  tahunAjaran: kelas.tahunAjaran,
                })}
              </p>
            </div>
            <div className="lg:col-span-8">
              <dl className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {faktaIdentitas.map(([label, nilai]) => (
                  <div key={label} className="bg-background px-5 py-6">
                    <dt className="kicker text-[10px]">{label}</dt>
                    <dd className="mt-2 text-[15px] leading-snug">{nilai}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PENGUMUMAN TERBARU ================= */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead
            no="02"
            label={t.nav.announcements}
            title={t.home.latestAnnouncements}
            linkTo="/pengumuman"
            linkText={t.home.allAnnouncements}
          />
          <ol className="mt-10">
            {pengumuman.slice(0, 3).map((p) => {
              const dateIso = (p.published_at || p.created_at).slice(0, 10);
              const tDate = pecahTanggal(dateIso);
              return (
                <li key={p.id} className="border-b border-border last:border-b-0">
                  <article className="group grid gap-3 py-6 md:grid-cols-[8rem_1fr] md:gap-8">
                    <p className="kicker pt-1 text-[10px]">
                      {tDate.hari} {tDate.bulanSingkat} {tDate.tahun}
                    </p>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="kicker text-[9px] text-accent">
                          {p.category}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight underline-offset-4 group-hover:underline md:text-[1.65rem]">
                        {p.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
                        {p.summary}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= AGENDA TERDEKAT ================= */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead
            no="03"
            label={t.nav.agenda}
            title={t.home.upcomingAgenda}
            linkTo="/agenda"
            linkText={t.home.fullAgenda}
          />
          <ol className="mt-10">
            {agendaTampil.map((item, i) => {
              const tDate = pecahTanggal(item.date);
              return (
                <li key={item.id} className="border-b border-border last:border-b-0">
                  <div className="flex gap-6 py-5 md:gap-10">
                    <div className="w-24 shrink-0 md:w-32">
                      <p className="font-display text-4xl font-medium leading-none tracking-tight">
                        {tDate.hari}
                      </p>
                      <p className="kicker mt-2 text-[10px]">
                        {tDate.bulanSingkat} {tDate.tahun}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1 border-l border-border pl-6 md:pl-10">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {i === 0 && agendaAkanDatang.length > 0 && (
                          <span className="kicker text-[9px] text-accent">
                            {t.home.nearest}
                          </span>
                        )}
                        <span className="kicker text-[9px]">{item.category}</span>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-medium tracking-tight md:text-2xl">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= WAJAH KELAS ================= */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <SectionHead
            no="04"
            label={t.nav.members}
            title={t.home.classMembers}
            linkTo="/anggota"
            linkText={interpolate(t.home.allMembers, { count: anggota.length })}
          />
          <ul className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {anggota.slice(0, 8).map((a) => (
              <li key={a.id} className="bg-background px-5 py-6">
                <div className="flex items-start justify-between gap-2">
                  <span className="kicker text-[10px]">
                    No. {padNomor(a.absen_no)}
                  </span>
                  {a.position && (
                    <span className="kicker text-[9px] text-accent">
                      {a.position.split(" ")[0]}
                    </span>
                  )}
                </div>
                <span className="mt-4 flex size-12 items-center justify-center border border-border bg-card/70 font-display text-lg italic">
                  {inisialNama(a.name)}
                </span>
                <p className="mt-3 text-[14.5px] leading-snug">{a.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= DOKUMENTASI ================= */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker text-[10px] text-primary-foreground/60">
                  No. 05 — {t.nav.gallery}
                </p>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {t.home.galleryShowcase}
                </h2>
              </div>
              <Link
                to="/galeri"
                className="group inline-flex items-center gap-1.5 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                {t.home.openGallery}
                <ArrowRight
                  className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 md:col-span-7">
              <FadeIn delay={60}>
                <PhotoPlate
                  onDark
                  aspect={galeri[0]?.aspect || "4 / 3"}
                  src={galeri[0]?.image_url || undefined}
                  label="Dok. 001 — Kegiatan"
                  caption={galeri[0]?.title ?? "Kegiatan kelas"}
                  date={galeri[0]?.date ? pecahTanggal(galeri[0].date).teks : undefined}
                />
              </FadeIn>
            </div>
            <div className="col-span-7 md:col-span-5 md:mt-12">
              <FadeIn delay={120}>
                <PhotoPlate
                  onDark
                  aspect={galeri[1]?.aspect || "1 / 1"}
                  src={galeri[1]?.image_url || undefined}
                  label="Dok. 002 — Kegiatan"
                  caption={galeri[1]?.title ?? "Kegiatan kelas"}
                  date={galeri[1]?.date ? pecahTanggal(galeri[1].date).teks : undefined}
                />
              </FadeIn>
            </div>
            <div className="col-span-5 md:col-span-4 md:mt-6">
              <FadeIn delay={180}>
                <PhotoPlate
                  onDark
                  aspect={galeri[2]?.aspect || "3 / 2"}
                  src={galeri[2]?.image_url || undefined}
                  label="Dok. 003 — Kegiatan"
                  caption={galeri[2]?.title ?? "Kegiatan kelas"}
                  date={galeri[2]?.date ? pecahTanggal(galeri[2].date).teks : undefined}
                />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BARIS KONTAK ================= */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="kicker text-[10px]">{t.home.contactRow}</p>
            <p className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
              {t.home.contactRowDesc}
            </p>
          </div>
          <Link
            to="/organisasi"
            className="group inline-flex shrink-0 items-center gap-1.5 pb-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t.home.viewOrgChart}
            <ArrowRight
              className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <PlaceholderNote className="mt-12" />
      </div>
    </div>
  );
}
