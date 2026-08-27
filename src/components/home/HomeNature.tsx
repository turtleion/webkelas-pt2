import type { ArticleRow, AgendaRow, MemberRow, GalleryPhotoRow } from "@/lib/db";
import type { KelasInfo } from "@/data/kelas";
import { useTranslation } from "@/hooks/use-translation";
import { Link } from "react-router";
import { Leaf } from "lucide-react";

interface HomeLayoutProps {
  kelas: KelasInfo;
  articles: ArticleRow[];
  agenda: AgendaRow[];
  anggota: MemberRow[];
  galeri: GalleryPhotoRow[];
  faktaIdentitas: Array<[string, string]>;
}

export function HomeNature({
  kelas,
  articles,
  agenda,
  anggota,
  galeri,
  faktaIdentitas,
}: HomeLayoutProps) {
  const { t, interpolate } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (agenda.filter((a) => a.date >= today).length > 0
    ? agenda.filter((a) => a.date >= today)
    : agenda.slice(-4)
  ).slice(0, 4);

  return (
    <div className="relative">
      {/* soft leaf shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
    </div>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <div className="flex items-center gap-2 text-accent">
            <Leaf className="size-4" />
            <span className="kicker text-[10px] tracking-[0.3em]">
              {t.home.heroTag}
          </span>
        </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
            {interpolate(t.home.heroSubtitle, {
              count: kelas.jumlahSiswa || anggota.length,
            })}
        </h1>

          <p className="mt-6 max-w-2xl font-display text-lg italic leading-relaxed text-muted-foreground md:text-xl">
            {interpolate(t.home.heroDescription, { kelas: kelas.nama })}
        </p>

          {/* organic curved facts */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {faktaIdentitas.slice(0, 6).map(([k, v], i) => (
              <div
                key={k}
                className="relative rounded-3xl border border-border/60 bg-card/40 px-6 py-5 backdrop-blur-sm"
                style={{
                  borderRadius:
                    i % 2 === 0
                      ? "1.75rem 1.25rem 1.75rem 1.25rem"
                      : "1.25rem 1.75rem 1.25rem 1.75rem",
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {k}
            </p>
                <p className="mt-2 font-display text-base font-medium">
                  {v}
            </p>
          </div>
            ))}
        </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/artikel"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-[1.02]"
            >
              {t.home.readArticles}
              <Leaf className="size-4" />
          </Link>
            <Link
              to="/anggota"
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-card"
            >
              {t.home.viewMembers}
          </Link>
        </div>
      </div>
    </section>

      {/* ============ ARTIKEL — leaf-card list ============ */}
      <section className="relative border-b border-border/40">
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="flex items-center gap-3">
            <Leaf className="size-5 text-accent" />
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {t.home.latestArticles}
          </h2>
        </div>

          <div className="mt-10 space-y-4">
            {articles.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                to={`/artikel/${p.slug}`}
                className="group flex items-start gap-5 rounded-2xl border border-border/60 bg-card/30 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-card/60 md:p-6"
                style={{
                  borderRadius:
                    i % 2 === 0
                      ? "1.5rem 1rem 1.5rem 1rem"
                      : "1rem 1.5rem 1rem 1.5rem",
                }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Leaf className="size-5" />
              </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    {p.is_pinned ? t.articles.pinned : t.articles.heading}
                </p>
                  <p className="mt-1 font-display text-lg font-medium leading-snug transition-colors group-hover:text-primary md:text-xl">
                    {p.title}
                </p>
                  {p.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                  </p>
                  )}
              </div>
            </Link>
            ))}
        </div>

          <div className="mt-8 text-center">
            <Link
              to="/artikel"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {t.home.allArticles} →
          </Link>
        </div>
      </div>
    </section>

      {/* ============ AGENDA — flowing timeline ============ */}
      <section className="relative border-b border-border/40">
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="flex items-center gap-3">
            <Leaf className="size-5 text-accent" />
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {t.home.upcomingAgenda}
          </h2>
        </div>

          <div className="relative mt-10">
            {/* vertical vine */}
            <div
              aria-hidden
              className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-primary/20 to-transparent md:left-1/2"
            />
            <ul className="space-y-8">
              {upcoming.map((a, i) => (
                <li
                  key={a.id}
                  className={`relative flex gap-6 pl-12 md:gap-10 md:pl-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* leaf bullet */}
                  <span className="absolute left-0 top-2 flex size-8 items-center justify-center rounded-full bg-background text-accent md:left-1/2 md:-translate-x-1/2">
                    <Leaf className="size-4" />
                 </span>

                  <div className="flex-1 md:w-1/2">
                    <div
                      className="rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm"
                      style={{
                        borderRadius:
                          i % 2 === 0
                            ? "1.5rem 1rem 1.5rem 1rem"
                            : "1rem 1.5rem 1rem 1.5rem",
                      }}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {a.category} — {a.date}
                    </p>
                      <p className="mt-2 font-display text-lg font-medium leading-snug md:text-xl">
                        {a.title}
                    </p>
                      {a.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {a.description}
                      </p>
                      )}
                  </div>
                </div>
              </li>
              ))}
          </ul>
        </div>
      </div>
    </section>

      {/* ============ MEMBERS ============ */}
      <section className="relative border-b border-border/40">
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10">
          <div className="flex items-center gap-3">
            <Leaf className="size-5 text-accent" />
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {interpolate(t.home.allMembers, { count: anggota.length })}
          </h2>
        </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {anggota.slice(0, 15).map((m, i) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/30 p-3 backdrop-blur-sm"
                style={{
                  borderRadius:
                    i % 2 === 0
                      ? "1.25rem 0.75rem 1.25rem 0.75rem"
                      : "0.75rem 1.25rem 0.75rem 1.25rem",
                }}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-xs font-medium text-accent">
                  {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
                <span className="line-clamp-1 text-xs">{m.name}</span>
            </div>
            ))}
        </div>

          <div className="mt-8 flex items-center justify-center" aria-hidden>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-accent/20" />
              <span className="inline-block size-1.5 -translate-y-0.5 rounded-full bg-accent/30" />
              <span className="inline-block size-1 rounded-full bg-primary/20" />
            </div>
            <div className="mx-1.5 flex items-center gap-1">
              <span className="inline-block size-1.5 translate-y-0.5 rounded-full bg-primary/25" />
              <span className="inline-block size-2 rounded-full bg-accent/20" />
              <span className="inline-block size-1 -translate-y-0.5 rounded-full bg-accent/30" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-accent/25" />
              <span className="inline-block size-1.5 translate-y-0.5 rounded-full bg-primary/20" />
              <span className="inline-block size-1 rounded-full bg-accent/25" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/anggota"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {t.home.allMembersLink} →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      {galeri.length > 0 && (
        <section className="relative">
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-10">
            <div className="flex items-center gap-3">
              <Leaf className="size-5 text-accent" />
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
                {t.home.galleryShowcase}
            </h2>
          </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {galeri.slice(0, 4).map((g, i) => (
                <a
                  key={g.id}
                  href={g.image_url}
                  className="group relative block aspect-[4/5] overflow-hidden border border-border/60"
                  style={{
                    borderRadius:
                      i % 2 === 0
                        ? "1.5rem 1rem 1.5rem 1rem"
                        : "1rem 1.5rem 1rem 1.5rem",
                  }}
                >
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium text-white">{g.title}</p>
                </div>
              </a>
              ))}
          </div>
        </div>
      </section>
      )}
  </div>
  );
}
