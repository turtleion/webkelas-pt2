import type { AnnouncementRow, AgendaRow, MemberRow, GalleryPhotoRow } from "@/lib/db";
import type { KelasInfo } from "@/data/kelas";
import { useTranslation } from "@/hooks/use-translation";
import { Link } from "react-router";

interface HomeLayoutProps {
  kelas: KelasInfo;
  pengumuman: AnnouncementRow[];
  agenda: AgendaRow[];
  anggota: MemberRow[];
  galeri: GalleryPhotoRow[];
  faktaIdentitas: Array<[string, string]>;
}

export function HomeExperimental({
  kelas,
  pengumuman,
  agenda,
  anggota,
  galeri,
  faktaIdentitas,
}: HomeLayoutProps) {
  const { t, interpolate } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (agenda.filter((a) => a.date >= today).length > 0
    ? agenda.filter((a) => a.date >= today)
    : agenda.slice(-3)
  ).slice(0, 3);

  return (
    <div className="relative bg-background">
      {/* ============ HERO — massive rotated type ============ */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* background layer — angled strip */}
        <div
          aria-hidden
          className="absolute -right-32 top-12 h-[120%] w-[60%] origin-top-right rotate-12 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:px-10">
          {/* top tag bar */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="kicker text-[10px] tracking-[0.4em] text-muted-foreground">
              ◆ {t.home.heroTag} ◆
          </span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              EST. {new Date().getFullYear()}
          </span>
        </div>

          {/* massive name */}
          <div className="relative mt-12">
            <h1 className="font-display text-[clamp(3rem,12vw,9rem)] font-black leading-[0.85] tracking-tighter">
              <span className="block text-foreground">{kelas.nama || "Arsip"}</span>
              <span className="block -mt-4 italic text-primary md:-mt-8">
                kelas.
             </span>
           </h1>

            {/* offset subtitle floating right */}
            <div className="mt-8 max-w-md md:ml-auto md:-mt-16 md:text-right">
              <p className="font-display text-lg italic text-muted-foreground md:text-xl">
                {interpolate(t.home.heroSubtitle, {
                  count: kelas.jumlahSiswa || anggota.length,
                })}
             </p>
           </div>
         </div>

          {/* facts row — boxed */}
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
            {faktaIdentitas.slice(0, 5).map(([k, v], i) => (
              <div
                key={k}
                className="flex flex-col gap-1 bg-background p-4 transition-colors hover:bg-card/60"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  0{i + 1} — {k}
              </span>
                <span className="line-clamp-1 font-display text-sm font-medium">
                  {v}
              </span>
            </div>
            ))}
         </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/pengumuman"
              className="group inline-flex items-center gap-3 border-b border-foreground pb-1 text-lg italic text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t.home.readAnnouncements}
              <span className="transition-transform group-hover:translate-x-1">→</span>
           </Link>
            <Link
              to="/anggota"
              className="text-lg italic text-muted-foreground hover:text-foreground"
            >
              /{t.home.viewMembers}
           </Link>
         </div>
       </div>
     </section>

      {/* ============ ANNOUNCEMENTS — magazine split ============ */}
      <section className="relative border-b border-border/60 bg-foreground/[0.02] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5 md:sticky md:top-12 md:self-start">
            <p className="font-mono text-[10px] tracking-[0.4em] text-primary">
              [01]
           </p>
            <h2 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              {t.home.latestAnnouncements}
           </h2>
            <p className="mt-6 font-display text-base italic text-muted-foreground">
              {interpolate(t.home.heroDescription, { kelas: kelas.nama })}
           </p>
            <Link
              to="/pengumuman"
              className="mt-8 inline-block border-b border-foreground pb-1 text-sm italic hover:border-primary hover:text-primary"
            >
              {t.home.allAnnouncements} →
           </Link>
         </div>

          <div className="space-y-6 md:col-span-7">
            {pengumuman.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                to="/pengumuman"
                className="group block border-t border-border/60 pt-6 transition-colors first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}.
                 </span>
                  <div className="flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      {p.category} — {p.published_at?.slice(0, 10)}
                   </p>
                    <p className="mt-2 font-display text-3xl font-medium leading-tight tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                      {p.title}
                   </p>
                    {p.summary && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {p.summary}
                     </p>
                    )}
                 </div>
               </div>
             </Link>
            ))}
         </div>
       </div>
     </section>

      {/* ============ AGENDA — horizontal scroll ============ */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-primary">
                [02]
             </p>
              <h2 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                {t.home.upcomingAgenda}
             </h2>
           </div>
            <Link
              to="/agenda"
              className="hidden text-sm italic text-muted-foreground hover:text-foreground md:inline"
            >
              {t.home.fullAgenda} ↗
           </Link>
         </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {upcoming.map((a, i) => (
              <div
                key={a.id}
                className="group relative bg-background p-8 transition-colors hover:bg-card/40"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · {a.date}
               </p>
                <p className="mt-6 font-display text-2xl font-medium leading-snug">
                  {a.title}
               </p>
                <p className="mt-3 text-xs uppercase tracking-widest text-accent">
                  {a.category}
               </p>
             </div>
            ))}
         </div>
       </div>
     </section>

      {/* ============ MEMBERS — offset diagonal ============ */}
      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.4em] text-primary">
                [03]
             </p>
              <h2 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
                {interpolate(t.home.allMembers, { count: anggota.length })}
             </h2>
           </div>
         </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {anggota.slice(0, 32).map((m) => (
              <span
                key={m.id}
                className="rounded-full border border-border bg-card/40 px-4 py-1.5 font-mono text-xs transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {m.name}
             </span>
            ))}
         </div>
       </div>
     </section>

      {/* ============ GALLERY — magazine ============ */}
      {galeri.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <p className="font-mono text-[10px] tracking-[0.4em] text-primary">
              [04]
           </p>
            <h2 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-6xl">
              {t.home.galleryShowcase}
           </h2>

            <div className="mt-10 grid grid-cols-12 gap-3">
              <a
                href={galeri[0]?.image_url}
                className="col-span-12 block aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 md:col-span-7"
              >
                <img
                  src={galeri[0]?.image_url}
                  alt={galeri[0]?.title}
                  className="size-full object-cover transition-transform duration-700 hover:scale-105"
                />
             </a>
              <div className="col-span-12 grid grid-cols-2 gap-3 md:col-span-5">
                {galeri.slice(1, 3).map((g) => (
                  <a
                    key={g.id}
                    href={g.image_url}
                    className="block aspect-square overflow-hidden rounded-2xl border border-border/60"
                  >
                    <img
                      src={g.image_url}
                      alt={g.title}
                      className="size-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                 </a>
                ))}
             </div>
           </div>
         </div>
       </section>
      )}
   </div>
  );
}
