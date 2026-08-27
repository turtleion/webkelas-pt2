import type { ArticleRow, AgendaRow, MemberRow, GalleryPhotoRow } from "@/lib/db";
import type { KelasInfo } from "@/data/kelas";
import { useTranslation } from "@/hooks/use-translation";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

interface HomeLayoutProps {
  kelas: KelasInfo;
  articles: ArticleRow[];
  agenda: AgendaRow[];
  anggota: MemberRow[];
  galeri: GalleryPhotoRow[];
  faktaIdentitas: Array<[string, string]>;
}

export function HomeModern({
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
  ).slice(0, 3);

  const stats = [
    { label: t.admin.recordedEvents, value: `${agenda.length}` },
    { label: t.admin.teachingHours, value: "40" },
    { label: t.admin.registeredStudents, value: `${anggota.length}` },
    { label: t.admin.savedPhotos, value: `${galeri.length}` },
  ];

  return (
    <div>
      {/* ============ HERO — bold asymmetric ============ */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <span className="kicker text-[10px] tracking-[0.3em] text-primary">
              {t.home.heroTag}
           </span>
            <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
              {kelas.nama || "Arsip Kelas"}.
           </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {interpolate(t.home.heroSubtitle, {
                count: kelas.jumlahSiswa || anggota.length,
              })}
           </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/artikel"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                {t.home.readArticles}
                <ArrowUpRight className="size-4" />
             </Link>
              <Link
                to="/anggota"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
              >
                {t.home.viewMembers}
             </Link>
           </div>
         </div>

          <div className="md:col-span-4 md:border-l md:border-border/60 md:pl-8">
            <p className="kicker mb-4 text-[10px] tracking-[0.25em] text-muted-foreground">
              {t.home.classIdentity}
           </p>
            <dl className="space-y-3">
              {faktaIdentitas.slice(0, 5).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-border/40 pb-2 last:border-b-0"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {k}
                 </dt>
                  <dd className="text-right text-sm font-medium">{v}</dd>
               </div>
              ))}
           </dl>
         </div>
       </div>

        {/* Stat strip */}
        <div className="border-t border-border/60 bg-card/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border/40 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-5">
                <p className="font-display text-3xl font-medium tracking-tight">
                  {s.value}
               </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
               </p>
             </div>
            ))}
         </div>
       </div>
     </section>

      {/* ============ ARTIKEL — editorial pull ============ */}
      <section className="border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="kicker text-[10px] tracking-[0.25em] text-primary">
              01 — {t.home.latestArticles}
           </p>
            <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              {t.home.latestArticles}
           </h2>
            <Link
              to="/artikel"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t.home.allArticles} <ArrowUpRight className="size-3.5" />
           </Link>
         </div>

          <div className="md:col-span-8">
            <div className="space-y-px overflow-hidden rounded-lg border border-border/60 bg-border/40">
              {articles.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/artikel/${p.slug}`}
                  className="group flex items-start gap-6 bg-background px-6 py-5 transition-colors hover:bg-card/60"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                 </span>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-accent">
                      {p.is_pinned ? t.articles.pinned : t.articles.heading}
                   </p>
                    <p className="mt-1 font-display text-lg font-medium leading-snug transition-colors group-hover:text-primary">
                      {p.title}
                   </p>
                 </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
               </Link>
              ))}
           </div>
         </div>
       </div>
     </section>

      {/* ============ AGENDA — three-up ============ */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="kicker text-[10px] tracking-[0.25em] text-primary">
                02 — {t.home.upcomingAgenda}
             </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                {t.home.upcomingAgenda}
             </h2>
           </div>
            <Link
              to="/agenda"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              {t.home.fullAgenda} →
           </Link>
         </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="group flex flex-col rounded-xl border border-border/60 bg-card/40 p-6 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {a.category}
               </p>
                <p className="mt-3 font-display text-lg font-medium leading-snug">
                  {a.title}
               </p>
                <p className="mt-auto pt-4 font-mono text-[11px] text-muted-foreground">
                  {a.date}
               </p>
             </div>
            ))}
         </div>
       </div>
     </section>

      {/* ============ MEMBERS — minimal list ============ */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="kicker text-[10px] tracking-[0.25em] text-primary">
                03 — {t.home.classMembers}
             </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                {interpolate(t.home.allMembers, {
                  count: anggota.length,
                })}
             </h2>
           </div>
            <Link
              to="/anggota"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t.home.viewMembers} →
           </Link>
         </div>

          <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6 md:grid-cols-8">
            {anggota.slice(0, 16).map((m) => (
              <Link
                key={m.id}
                to="/anggota"
                className="group flex flex-col items-center gap-2"
              >
                <span className="flex size-14 items-center justify-center rounded-full border border-border bg-card font-display text-sm font-medium text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
               </span>
                <span className="line-clamp-1 text-center text-[11px] text-muted-foreground">
                  {m.name}
               </span>
             </Link>
            ))}
         </div>
       </div>
     </section>

      {/* ============ GALLERY ============ */}
      {galeri.length > 0 && (
        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="kicker text-[10px] tracking-[0.25em] text-primary">
                  04 — {t.home.galleryShowcase}
               </p>
                <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {t.home.galleryShowcase}
               </h2>
             </div>
              <Link
                to="/galeri"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t.home.openGallery} →
             </Link>
           </div>

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {galeri.slice(0, 4).map((g) => (
                <a
                  key={g.id}
                  href={g.image_url}
                  className="group relative block aspect-square overflow-hidden rounded-xl border border-border/60 bg-card/40"
                >
                  <img
                    src={g.image_url}
                    alt={g.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {g.title}
                 </span>
               </a>
              ))}
           </div>
         </div>
       </section>
      )}
   </div>
  );
}
