import { Fragment } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSchedule } from "@/hooks/use-schedule";
import { useMbgSchedule } from "@/hooks/use-mbg";
import { useDutySchedule } from "@/hooks/use-duty";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslation } from "@/hooks/use-translation";
import { type ScheduleRow } from "@/lib/db";
import { pecahTanggal } from "@/lib/tanggal";
import { Loader2 } from "lucide-react";

const DAYS: Array<ScheduleRow["day"]> = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];

export default function Jadwal() {
  const { t, interpolate, locale } = useTranslation();
  usePageTitle(t.schedule.pageTitle);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: schedules, isLoading } = useSchedule();
  const { data: mbgData, isLoading: mbgLoading } = useMbgSchedule();
  const { data: dutyData, isLoading: dutyLoading } = useDutySchedule();

  const dayTranslations: Record<string, string> = {
    Senin: locale === "en" ? "Monday" : "Senin",
    Selasa: locale === "en" ? "Tuesday" : "Selasa",
    Rabu: locale === "en" ? "Wednesday" : "Rabu",
    Kamis: locale === "en" ? "Thursday" : "Kamis",
    Jumat: locale === "en" ? "Friday" : "Jumat",
  };

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
          label={t.nav.schedule}
          title={t.schedule.heading}
          description={interpolate(t.schedule.description, {
            kelas: kelas.nama || "",
            semester: kelas.semester || "",
            tahunAjaran: kelas.tahunAjaran || "",
          })}
          meta={interpolate(t.schedule.semesterMeta, {
            semester: kelas.semester || "",
          })}
        />

        <PlaceholderNote className="mt-8">
          {t.schedule.note}
        </PlaceholderNote>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : groupedByDay.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            {t.schedule.empty}
          </p>
        ) : (
          <div className="mt-14 space-y-12">
            {groupedByDay.map((g) => (
              <section key={g.hari} aria-labelledby={`hari-${g.hari}`}>
                <div className="flex items-center gap-4">
                  <h2
                    id={`hari-${g.hari}`}
                    className="font-display text-2xl font-medium tracking-tight md:text-3xl"
                  >
                    {dayTranslations[g.hari] || g.hari}
                  </h2>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-[14px]">
                    <thead className="kicker border-b border-border text-[10px]">
                      <tr>
                        <th className="py-2.5 pr-4 font-normal">{t.schedule.timeColumn}</th>
                        <th className="py-2.5 px-4 font-normal">{t.schedule.subjectColumn}</th>
                        <th className="py-2.5 pl-4 font-normal">{t.schedule.roomColumn}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {g.rows.map((r) => {
                        const isIstirahat = r.subject.toLowerCase().includes("istirahat");
                        return (
                          <tr
                            key={r.id}
                            className={
                              isIstirahat
                                ? "text-muted-foreground/80 italic"
                                : "text-foreground"
                            }
                          >
                            <td className="py-3 pr-4 font-mono text-[12px] whitespace-nowrap">
                              {r.time_start} {r.time_end ? `– ${r.time_end}` : ""}
                            </td>
                            <td className="py-3 px-4 font-display text-[15px]">
                              {isIstirahat ? t.schedule.breakLabel : r.subject}
                            </td>
                            <td className="py-3 pl-4 font-mono text-[12px] text-muted-foreground">
                              {r.teacher || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ── MBG Schedule ── */}
        <section className="mt-16">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              {t.mbg.heading}
            </h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>

          {mbgLoading ? (
            <div className="mt-8 flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : mbgData.length === 0 ? (
            <p className="mt-8 text-sm italic text-muted-foreground">{t.mbg.empty}</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="kicker border-b border-border text-[10px]">
                  <tr>
                    <th className="py-2.5 pr-4 font-normal">{t.schedule.timeColumn}</th>
                    <th className="py-2.5 px-4 font-normal">{t.mbg.menu}</th>
                    <th className="py-2.5 pl-4 font-normal">{t.mbg.notes}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {mbgData.map((item) => {
                    const td = pecahTanggal(item.date);
                    return (
                      <tr key={item.id} className="text-foreground">
                        <td className="py-3 pr-4 font-mono text-[12px] whitespace-nowrap">
                          {td.hari} {td.bulanSingkat}
                        </td>
                        <td className="py-3 px-4 font-display text-[15px]">
                          {item.menu}
                        </td>
                        <td className="py-3 pl-4 text-[13px] text-muted-foreground">
                          {item.notes || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Piket Schedule ── */}
        <section className="mt-16">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              {t.duty.heading}
            </h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>

          {dutyLoading ? (
            <div className="mt-8 flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : dutyData.length === 0 ? (
            <p className="mt-8 text-sm italic text-muted-foreground">{t.duty.empty}</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="kicker border-b border-border text-[10px]">
                  <tr>
                    <th className="py-2.5 pr-4 font-normal">{t.schedule.timeColumn}</th>
                    <th className="py-2.5 px-4 font-normal">{t.duty.group}</th>
                    <th className="py-2.5 px-4 font-normal">{t.duty.members}</th>
                    <th className="py-2.5 pl-4 font-normal">{t.duty.area}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {dutyData.map((item) => {
                    const td = pecahTanggal(item.date);
                    return (
                      <tr key={item.id} className="text-foreground">
                        <td className="py-3 pr-4 font-mono text-[12px] whitespace-nowrap">
                          {td.hari} {td.bulanSingkat}
                        </td>
                        <td className="py-3 px-4 font-display text-[15px]">
                          {item.group_name}
                        </td>
                        <td className="py-3 px-4 text-[13px]">
                          {item.members.join(", ")}
                        </td>
                        <td className="py-3 pl-4 text-[13px] text-muted-foreground">
                          {item.area || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
