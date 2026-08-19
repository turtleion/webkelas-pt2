import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { usePageTitle } from "@/hooks/use-page-title";
import { useMembers } from "@/hooks/use-members";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslation } from "@/hooks/use-translation";
import { inisialNama, padNomor } from "@/lib/tanggal";
import { Loader2 } from "lucide-react";

export default function Anggota() {
  const { t, interpolate } = useTranslation();
  usePageTitle(t.members.pageTitle);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: anggota, isLoading } = useMembers();

  const [cari, setCari] = useState("");

  const kata = cari.trim().toLowerCase();
  const hasil = anggota.filter(
    (a) =>
      a.name.toLowerCase().includes(kata) ||
      String(a.absen_no).includes(kata) ||
      (a.position ?? "").toLowerCase().includes(kata)
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="02"
          label={t.nav.members}
          title={t.members.heading}
          description={interpolate(t.members.description, {
            count: anggota.length,
            kelas: kelas.nama || "",
          })}
          meta={`${anggota.length} ${t.members.pageTitle.toLowerCase()}`}
        />

        <PlaceholderNote className="mt-8">
          {t.members.note}
        </PlaceholderNote>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
          <label className="block max-w-md flex-1">
            <span className="kicker text-[10px]">{t.members.searchLabel}</span>
            <input
              type="search"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder={t.members.searchPlaceholder}
              aria-label={t.members.searchLabel}
              className="mt-2 w-full border-b border-border bg-transparent pb-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
            />
          </label>
          <p className="kicker text-[10px]">
            {interpolate(t.members.searchCount, {
              filtered: hasil.length,
              total: anggota.length,
            })}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="grid gap-px bg-border sm:grid-cols-2">
            {hasil.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-4 bg-background px-4 py-4 md:px-5"
              >
                <span className="kicker w-8 shrink-0 text-[10px]">
                  {padNomor(a.absen_no)}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center border border-border bg-card/70 font-display text-sm italic">
                  {inisialNama(a.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px]">{a.name}</span>
                  {a.position && (
                    <span className="kicker mt-0.5 block text-[9px] text-accent">
                      {a.position}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && hasil.length === 0 && (
          <p className="mt-10 font-display text-xl italic text-muted-foreground">
            {cari
              ? interpolate(t.members.emptySearch, { query: cari })
              : t.members.emptyList}
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
