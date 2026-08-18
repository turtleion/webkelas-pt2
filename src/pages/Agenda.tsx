import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAgenda } from "@/hooks/use-agenda";
import { useOrganization } from "@/hooks/use-organization";
import { hariNama, pecahTanggal } from "@/lib/tanggal";
import { type AgendaRow } from "@/lib/db";
import { Loader2 } from "lucide-react";

interface GrupBulan {
  kunci: string;
  judul: string;
  items: AgendaRow[];
}

function kelompokkanBulan(items: AgendaRow[]): GrupBulan[] {
  const peta = new Map<string, GrupBulan>();
  for (const item of items) {
    const t = pecahTanggal(item.date);
    const kunci = `${t.tahun}-${String(t.bulan).padStart(2, "0")}`;
    const judul = `${t.bulanNama} ${t.tahun}`;
    if (!peta.has(kunci)) peta.set(kunci, { kunci, judul, items: [] });
    peta.get(kunci)!.items.push(item);
  }
  return [...peta.values()];
}

export default function Agenda() {
  usePageTitle("Agenda");
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: agenda, isLoading } = useAgenda();

  const tanggalHariIni = new Date().toISOString().slice(0, 10);
  const agendaAkanDatang = agenda.filter((a) => a.date >= tanggalHariIni);
  const agendaTampil =
    agendaAkanDatang.length > 0 ? agendaAkanDatang : agenda.slice(-4);
  const bulan = kelompokkanBulan(agendaTampil);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="06"
          label="Agenda"
          title="Agenda kelas"
          description={`Kegiatan ${kelas.nama} semester ${kelas.semester}, disusun kronologis. Tanggal menjadi penanda utama — pantau halaman ini agar tidak ketinggalan.`}
          meta="Kronologis"
        />

        <PlaceholderNote className="mt-8">
          Agenda diperbarui secara berkala oleh pengurus kelas (tugas, ulangan, dan kegiatan sekolah).
        </PlaceholderNote>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : bulan.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            Belum ada agenda kelas tercatat saat ini.
          </p>
        ) : (
          <ol className="mt-14 space-y-12">
            {bulan.map((g) => (
              <li key={g.kunci}>
                <div className="flex items-center gap-4">
                  <h2 className="kicker text-[11px]">{g.judul}</h2>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <ul className="mt-2">
                  {g.items.map((item) => {
                    const t = pecahTanggal(item.date);
                    const terdekat =
                      agendaAkanDatang.length > 0 &&
                      item.date === agendaAkanDatang[0].date;
                    return (
                      <li
                        key={item.id}
                        className="flex gap-6 border-b border-border py-6 md:gap-10"
                      >
                        <div className="w-28 shrink-0 md:w-36">
                          <p className="font-display text-5xl font-medium leading-none tracking-tight">
                            {t.hari}
                          </p>
                          <p className="kicker mt-2 text-[10px]">
                            {hariNama(item.date)}, {t.bulanSingkat} {t.tahun}
                          </p>
                        </div>
                        <div className="min-w-0 flex-1 border-l border-border pl-6 md:pl-10">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="kicker text-[9px]">{item.category}</span>
                            {terdekat && (
                              <span className="kicker text-[9px] text-accent">
                                Terdekat
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 font-display text-xl font-medium tracking-tight md:text-2xl">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
