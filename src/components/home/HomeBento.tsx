import { Link } from "react-router";
import {
  ArrowRight,
  Calendar,
  Megaphone,
  Users,
  Image as ImageIcon,
  Clock,
  Sparkles,
} from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { PhotoPlate } from "@/components/site/PhotoPlate";
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

export function HomeBento({
  kelas,
  pengumuman,
  agenda,
  anggota,
  galeri,
  faktaIdentitas,
}: HomeLayoutProps) {
  const { t, interpolate } = useTranslation();
  const tanggalHariIni = new Date().toISOString().slice(0, 10);
  const nextAgenda = agenda.find((a) => a.date >= tanggalHariIni) || agenda[0];
  const latestAnnouncement = pengumuman[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      {/* Bento Grid Header */}
      <FadeIn>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>
                {kelas.nama} · T.A. {kelas.tahunAjaran}
              </span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              {kelas.nama}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {interpolate(t.home.heroSubtitle, {
                count: kelas.jumlahSiswa || anggota.length,
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/pengumuman"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.home.readAnnouncements}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Bento Tiles Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 md:gap-6">
        {/* Card 1: Featured Photo & Class Tag (Col 8) */}
        <div className="glass glass-hover col-span-1 sm:col-span-2 lg:col-span-8 flex flex-col justify-between overflow-hidden p-6 md:p-8">
          <div className="flex items-center justify-between">
            <span className="kicker text-[10px] text-accent">
              {t.home.galleryShowcase}
            </span>
            <Link
              to="/galeri"
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              {t.home.openGallery} →
            </Link>
          </div>
          <div className="my-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <PhotoPlate
                aspect="16 / 9"
                src={galeri[0]?.image_url || undefined}
                label={`Dok. 001 — ${galeri[0]?.category || "MPLS"}`}
                caption={galeri[0]?.title || `Foto Kelas ${kelas.nama}`}
                date={galeri[0]?.date ? pecahTanggal(galeri[0].date).teks : undefined}
              />
            </div>
            <div className="md:col-span-5 flex flex-col gap-3">
              <h2 className="font-display text-2xl font-medium tracking-tight">
                {galeri[0]?.title || `Dokumentasi Utama ${kelas.nama}`}
              </h2>
              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                {interpolate(t.home.heroDescription, { kelas: kelas.nama })}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-4 text-xs font-mono text-muted-foreground">
            <span>{kelas.sekolah}</span>
            <span>{kelas.jurusan}</span>
          </div>
        </div>

        {/* Card 2: Upcoming Agenda Highlight (Col 4) */}
        <div className="glass glass-hover col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="kicker flex items-center gap-1.5 text-[10px] text-accent">
                <Calendar className="size-3.5" />
                {t.home.upcomingAgenda}
              </span>
              <Link
                to="/agenda"
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {t.home.fullAgenda} →
              </Link>
            </div>
            {nextAgenda ? (
              <div className="mt-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-medium text-foreground">
                    {pecahTanggal(nextAgenda.date).hari}
                  </span>
                  <span className="font-mono text-xs uppercase text-muted-foreground">
                    {pecahTanggal(nextAgenda.date).bulanSingkat}{" "}
                    {pecahTanggal(nextAgenda.date).tahun}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-medium tracking-tight">
                  {nextAgenda.title}
                </h3>
                {nextAgenda.description && (
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {nextAgenda.description}
                  </p>
                )}
                <div className="mt-4">
                  <span className="kicker rounded bg-accent/15 px-2 py-0.5 text-[9px] text-accent font-semibold">
                    {nextAgenda.category}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground italic">
                {t.common.empty}
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-border/70 pt-4">
            <Link
              to="/jadwal"
              className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-foreground hover:text-accent transition-colors"
            >
              <span className="flex items-center gap-2">
                <Clock className="size-3.5 text-primary" /> {t.nav.schedule}
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 3: Latest Announcement (Col 6) */}
        <div className="glass glass-hover col-span-1 lg:col-span-6 flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="kicker flex items-center gap-1.5 text-[10px] text-accent">
                <Megaphone className="size-3.5" />
                {t.home.latestAnnouncements}
              </span>
              <Link
                to="/pengumuman"
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {t.home.allAnnouncements} →
              </Link>
            </div>
            {latestAnnouncement ? (
              <div className="mt-4">
                <p className="font-mono text-[10px] text-muted-foreground">
                  {pecahTanggal((latestAnnouncement.published_at || latestAnnouncement.created_at).slice(0, 10)).teks}
                </p>
                <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">
                  {latestAnnouncement.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {latestAnnouncement.summary}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground italic">
                {t.common.empty}
              </p>
            )}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-3">
            <span className="font-mono text-[10px] text-accent uppercase">
              {latestAnnouncement?.category || "Umum"}
            </span>
            <Link
              to="/pengumuman"
              className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Baca Lengkap →
            </Link>
          </div>
        </div>

        {/* Card 4: Class Roster Peek (Col 6) */}
        <div className="glass glass-hover col-span-1 lg:col-span-6 flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="kicker flex items-center gap-1.5 text-[10px] text-accent">
                <Users className="size-3.5" />
                {t.home.classMembers}
              </span>
              <Link
                to="/anggota"
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {interpolate(t.home.allMembers, { count: anggota.length })} →
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {anggota.slice(0, 6).map((m) => (
                <div key={m.id} className="flex flex-col items-center text-center">
                  <span className="flex size-10 items-center justify-center rounded-full border border-border bg-card font-display text-xs italic">
                    {inisialNama(m.name)}
                  </span>
                  <span className="mt-1.5 truncate max-w-full font-mono text-[9px] text-muted-foreground">
                    #{padNomor(m.absen_no)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-3 text-[12px] text-muted-foreground">
            <span>Wali Kelas: {kelas.waliKelas.nama}</span>
            <Link
              to="/organisasi"
              className="font-mono text-[10px] uppercase tracking-wider text-accent hover:underline"
            >
              {t.home.viewOrgChart}
            </Link>
          </div>
        </div>

        {/* Card 5: Class Identity Quick-Stats Grid (Col 12) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {faktaIdentitas.map(([label, nilai]) => (
            <div
              key={label}
              className="glass glass-hover p-4 text-center flex flex-col justify-center"
            >
              <span className="kicker text-[9px]">{label}</span>
              <span className="mt-1 font-display text-sm font-medium text-foreground">
                {nilai}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
