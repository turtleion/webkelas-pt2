import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { usePageTitle } from "@/hooks/use-page-title";
import { useOrganization } from "@/hooks/use-organization";
import { inisialNama, padNomor } from "@/lib/tanggal";
import { Loader2 } from "lucide-react";

function Orang({
  nama,
  absenNo,
  besar = false,
}: {
  nama: string;
  absenNo?: number;
  besar?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          besar
            ? "flex size-11 shrink-0 items-center justify-center border border-border bg-card/70 font-display text-base italic"
            : "flex size-9 shrink-0 items-center justify-center border border-border bg-card/70 font-display text-sm italic"
        }
      >
        {inisialNama(nama)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14.5px] leading-tight">{nama}</span>
        {absenNo ? (
          <span className="kicker mt-0.5 block text-[9px] text-muted-foreground">
            No. {padNomor(absenNo)}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export default function Organisasi() {
  usePageTitle("Struktur Organisasi");
  const { data: orgData, isLoading } = useOrganization();
  const { kelas, pengurusInti, sie } = orgData;

  const hasWali = Boolean(kelas.waliKelas?.nama);
  const hasInti = pengurusInti.length > 0;
  const hasSie = sie.length > 0;
  const isEmpty = !hasWali && !hasInti && !hasSie;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="03"
          label="Organisasi"
          title="Struktur organisasi kelas"
          description={
            kelas.nama
              ? `Susunan pengurus ${kelas.nama}: pengurus inti dan sie bidang. Wali kelas membimbing, pengurus inti menjalankan, sie mengurus bidangnya masing-masing.`
              : "Susunan pengurus kelas: pengurus inti dan sie bidang."
          }
          meta={`${pengurusInti.length} inti + ${sie.length} sie`}
        />

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : isEmpty ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            Belum ada struktur organisasi kelas yang tercatat saat ini.
          </p>
        ) : (
          <>
            {/* wali kelas */}
            {hasWali && (
              <section className="mt-12 border-y-2 border-foreground/85 py-8 text-center md:mt-16">
                <p className="kicker text-[10px]">Wali Kelas</p>
                <p className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                  {kelas.waliKelas.nama}
                  {kelas.waliKelas.gelar ? `, ${kelas.waliKelas.gelar}` : ""}
                </p>
                {kelas.waliKelas.peran && (
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {kelas.waliKelas.peran}
                  </p>
                )}
              </section>
            )}

            {/* pengurus inti */}
            {hasInti && (
              <section className="mt-14">
                <FadeHeading kicker="Pengurus Inti" title="Inti kelas" />
                <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  {pengurusInti.map((p) => (
                    <li key={p.jabatan} className="bg-background px-5 py-6">
                      <p className="kicker text-[10px]">{p.jabatan}</p>
                      <div className="mt-4 space-y-3">
                        {p.nomor.map((no) => (
                          <Orang
                            key={no}
                            nama={`Pengurus Absen #${no}`}
                            absenNo={no}
                            besar={p.nomor.length === 1}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* sie */}
            {hasSie && (
              <section className="mt-14">
                <FadeHeading kicker="Sie & Bagian" title="Sie-sie kelas" />
                <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                  {sie.map((s) => (
                    <li key={s.jabatan} className="bg-background px-5 py-6">
                      <p className="kicker text-[10px]">{s.jabatan}</p>
                      <div className="mt-4 space-y-3">
                        {s.nomor.map((no) => (
                          <Orang
                            key={no}
                            nama={`Sie Absen #${no}`}
                            absenNo={no}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-14 border-t border-border pt-8">
              <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                Setiap sie bertanggung jawab kepada pengurus inti, dan pengurus inti
                bertanggung jawab kepada wali kelas serta seluruh anggota kelas.
                Perubahan susunan disahkan melalui rapat kelas dan dicatat di arsip digital.
              </p>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FadeHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="kicker text-[10px]">{kicker}</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
