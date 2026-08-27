import { Link } from "react-router";
import { ArrowRight, Sparkles, Calendar, FileText, Users } from "lucide-react";
import { FadeIn } from "@/components/site/FadeIn";
import { PhotoPlate } from "@/components/site/PhotoPlate";
import { Stamp } from "@/components/site/Stamp";
import { inisialNama, padNomor, pecahTanggal } from "@/lib/tanggal";
import { useTranslation } from "@/hooks/use-translation";
import type { ArticleRow, AgendaRow, MemberRow, GalleryPhotoRow } from "@/lib/db";
import type { KelasInfo } from "@/data/kelas";

interface HomeLayoutProps {
  kelas: KelasInfo;
  articles: ArticleRow[];
  agenda: AgendaRow[];
  anggota: MemberRow[];
  galeri: GalleryPhotoRow[];
  faktaIdentitas: Array<[string, string]>;
}

export function HomeShowcase({
  kelas,
  articles,
  agenda,
  anggota,
  galeri,
  faktaIdentitas,
}: HomeLayoutProps) {
  const { t, interpolate } = useTranslation();

  return (
    <div>
      {/* Dynamic Visual Banner */}
      <section className="relative overflow-hidden border-b border-border bg-card/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col items-center text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                <Sparkles className="size-3.5" />
                <span>Showcase Arsip · {kelas.tahunAjaran}</span>
              </div>
              <h1 className="mt-4 font-display text-5xl font-medium tracking-tight md:text-7xl">
                {kelas.nama}
              </h1>
              <p className="mt-4 max-w-xl font-display text-lg italic text-muted-foreground md:text-2xl">
                {interpolate(t.home.heroSubtitle, {
                  count: kelas.jumlahSiswa || anggota.length,
                })}
              </p>
            </FadeIn>

            {/* Showcase Visual Trio */}
            <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galeri.slice(0, 3).map((g, idx) => (
                <div
                  key={g.id}
                  className="glass glass-hover transform transition-all duration-300 p-4"
                >
                  <PhotoPlate
                    aspect={g.aspect || "4 / 3"}
                    src={g.image_url || undefined}
                    label={`Dok. ${padNomor(idx + 1)} — ${g.category}`}
                    caption={g.title}
                    date={g.date ? pecahTanggal(g.date).teks : undefined}
                  />
                  {idx === 0 && (
                    <Stamp className="absolute -bottom-3 -right-3 rotate-6">
                      Unggulan
                    </Stamp>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                to="/galeri"
                className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.home.openGallery}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Split Section: Timeline & Announcements */}
      <section className="border-b border-border py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left: Agenda Timeline (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-display text-2xl font-medium tracking-tight flex items-center gap-2">
                  <Calendar className="size-5 text-accent" />
                  {t.home.upcomingAgenda}
                </h2>
                <Link
                  to="/agenda"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {t.home.fullAgenda} →
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {agenda.slice(0, 4).map((item) => {
                  const tDate = pecahTanggal(item.date);
                  return (
                    <div
                      key={item.id}
                      className="glass glass-hover flex items-start gap-4 p-4"
                    >
                      <div className="w-16 shrink-0 text-center border-r border-border/60 pr-3">
                        <span className="font-display text-2xl font-bold">
                          {tDate.hari}
                        </span>
                        <span className="block font-mono text-[9px] uppercase text-muted-foreground">
                          {tDate.bulanSingkat}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[9px] uppercase text-accent font-semibold">
                          {item.category}
                        </span>
                        <h3 className="font-display text-lg font-medium text-foreground">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Recent Articles Stream (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h2 className="font-display text-2xl font-medium tracking-tight flex items-center gap-2">
                  <FileText className="size-5 text-accent" />
                  {t.home.latestArticles}
                </h2>
                <Link
                  to="/artikel"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {t.home.allArticles} →
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {articles.slice(0, 3).map((p) => {
                  const dateIso = p.created_at.slice(0, 10);
                  const tDate = pecahTanggal(dateIso);
                  return (
                    <Link
                      key={p.id}
                      to={`/artikel/${p.slug}`}
                      className="glass glass-hover block p-4.5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase text-accent font-semibold">
                          {p.is_pinned ? t.articles.pinned : t.articles.heading}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {tDate.teks}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-medium">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
                        {p.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Roster Carousel Section */}
      <section className="border-b border-border bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="kicker text-[10px] text-accent">
                {t.home.classMembers}
              </p>
              <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">
                {interpolate(t.home.allMembers, { count: anggota.length })}
              </h2>
            </div>
            <Link
              to="/anggota"
              className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Lihat Roster Lengkap →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {anggota.slice(0, 12).map((m) => (
              <div
                key={m.id}
                className="glass glass-hover flex flex-col items-center p-4 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card font-display text-sm italic">
                  {inisialNama(m.name)}
                </span>
                <span className="kicker mt-3 text-[9px]">
                  No. {padNomor(m.absen_no)}
                </span>
                <p className="mt-1 font-display text-sm font-medium leading-snug line-clamp-1">
                  {m.name}
                </p>
                {m.position && (
                  <span className="mt-1 font-mono text-[9px] text-accent font-semibold truncate max-w-full">
                    {m.position}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
