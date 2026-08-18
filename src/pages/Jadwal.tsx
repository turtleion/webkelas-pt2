import { Fragment } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSchedule } from "@/hooks/use-schedule";
import { useOrganization } from "@/hooks/use-organization";
import { type ScheduleRow } from "@/lib/db";
import { Loader2 } from "lucide-react";

const DAYS: Array<ScheduleRow["day"]> = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];

export default function Jadwal() {
  usePageTitle("Jadwal Pelajaran");
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: schedules, isLoading } = useSchedule();

  const groupedByDay = DAYS.map((day) => ({
    hari: day,
    rows: schedules.filter((s) => s.day === day),
  })).filter((g) => g.rows.length > 0);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="04"
          label="Jadwal"
          title="Jadwal pelajaran"
          description={`Jadwal pelajaran ${kelas.nama} semester ${kelas.semester} tahun ajaran ${kelas.tahunAjaran}. Jam istirahat ditandai miring; jam ke-1 dimulai pukul 07.00.`}
          meta={`Semester ${kelas.semester}`}
        />

        <PlaceholderNote className="mt-8">
          Jadwal dapat berubah sewaktu-waktu sesuai ketentuan kurikulum sekolah dan diperbarui di panel admin.
        </PlaceholderNote>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : groupedByDay.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            Belum ada jadwal pelajaran yang tercatat saat ini.
          </p>
        ) : (
          <section className="mt-10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <caption className="sr-only">
                  Jadwal pelajaran kelas {kelas.nama} per hari, waktu, mata
                  pelajaran, dan guru pengampu
                </caption>
                <thead>
                  <tr className="kicker border-b-2 border-foreground/80 text-[10px]">
                    <th scope="col" className="py-3 pr-4 text-left font-normal">
                      Hari
                    </th>
                    <th scope="col" className="py-3 pr-4 text-left font-normal">
                      Waktu
                    </th>
                    <th scope="col" className="py-3 pr-4 text-left font-normal">
                      Mata Pelajaran
                    </th>
                    <th scope="col" className="py-3 text-left font-normal">
                      Guru
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedByDay.map((hari) => (
                    <Fragment key={hari.hari}>
                      <tr className="border-b border-border/70 bg-card/60">
                        <td
                          colSpan={4}
                          className="kicker px-0 py-2.5 text-[10px] text-foreground"
                        >
                          {hari.hari}
                        </td>
                      </tr>
                      {hari.rows.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-border/50 last:border-b-0"
                        >
                          <td className="py-3 pr-4 align-top" aria-hidden />
                          <td className="py-3 pr-4 align-top font-mono text-[11.5px] text-muted-foreground whitespace-nowrap">
                            {r.time_start} {r.time_end ? `— ${r.time_end}` : ""}
                          </td>
                          <td
                            className={
                              r.is_break
                                ? "py-3 pr-4 align-top text-[13.5px] italic text-muted-foreground"
                                : "py-3 pr-4 align-top text-[13.5px]"
                            }
                          >
                            {r.subject}
                          </td>
                          <td className="py-3 align-top text-[13px] text-muted-foreground">
                            {r.teacher || "—"}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="kicker mt-3 text-[10px] lg:hidden">
              Geser tabel ke samping untuk melihat jadwal lengkap →
            </p>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
