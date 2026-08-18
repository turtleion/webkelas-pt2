import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useOrganization } from "@/hooks/use-organization";
import { pecahTanggal } from "@/lib/tanggal";
import { Loader2 } from "lucide-react";

export default function Pengumuman() {
  usePageTitle("Pengumuman");
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: pengumuman, isLoading } = useAnnouncements(true);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="05"
          label="Pengumuman"
          title="Pengumuman"
          description={`Informasi resmi ${kelas.nama}: pengumuman kelas, sekolah, tugas, dan akademik. Diurutkan dari yang terbaru.`}
          meta={`${pengumuman.length} entri`}
        />

        <PlaceholderNote className="mt-8">
          Pengumuman resmi dikelola langsung oleh wali kelas dan pengurus kelas melalui panel arsip digital.
        </PlaceholderNote>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : pengumuman.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            Belum ada pengumuman yang diterbitkan saat ini.
          </p>
        ) : (
          <ol className="mt-10">
            {pengumuman.map((p) => {
              const dateIso = (p.published_at || p.created_at).slice(0, 10);
              const t = pecahTanggal(dateIso);
              return (
                <li key={p.id} className="border-b border-border last:border-b-0">
                  <article className="grid gap-4 py-8 md:grid-cols-[7rem_1fr] md:gap-10">
                    <div>
                      <p className="font-display text-4xl font-medium leading-none tracking-tight">
                        {t.hari}
                      </p>
                      <p className="kicker mt-2 text-[10px]">
                        {t.bulanSingkat} {t.tahun}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="kicker text-[9px] text-accent">
                          {p.category}
                        </span>
                      </div>
                      <h2 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
                        {p.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-foreground/80">
                        {p.summary}
                      </p>
                      {p.body && (
                        <div className="mt-4 max-w-2xl border-l-2 border-border pl-4 text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-line">
                          {p.body}
                        </div>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
