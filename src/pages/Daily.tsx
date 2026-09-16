import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { MemberList } from "@/components/site/MemberList";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { useDailyOverview } from "@/hooks/use-daily";
import { labelTanggal } from "@/lib/daily";
import { type MemberRow, type ScheduleRow } from "@/lib/db";
import { Link } from "react-router";
import { ArrowRight, Loader2, Shirt, Backpack, StickyNote } from "lucide-react";
import { taskSlug } from "./Tugas";

const DAY_LABEL: Record<string, { id: string; en: string }> = {
  Senin: { id: "Senin", en: "Monday" },
  Selasa: { id: "Selasa", en: "Tuesday" },
  Rabu: { id: "Rabu", en: "Wednesday" },
  Kamis: { id: "Kamis", en: "Thursday" },
  Jumat: { id: "Jumat", en: "Friday" },
};

const toMemberRows = (names: string[]): MemberRow[] =>
  names.map((name) => ({
    id: `m-${name}`,
    absen_no: 0,
    name,
    position: null,
    created_at: "",
    updated_at: "",
  }));

/** Isi sebuah bagian info (Pakaian/Bawaan/Catatan) — null bila kosong. */
function InfoCard({
  icon: Icon,
  label,
  value,
  multiline,
}: {
  icon: typeof Shirt;
  label: string;
  value: string | null;
  multiline?: boolean;
}) {
  if (!value) return null;
  const items = multiline
    ? value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="glass rounded-xl border border-border/60 p-5">
      <h3 className="kicker flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </h3>
      {items.length > 1 ? (
        <ul className="mt-3 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-[14.5px]">
              <span className="text-accent" aria-hidden>
                ·
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[14.5px] leading-relaxed">{value}</p>
      )}
    </section>
  );
}

export default function Daily() {
  const { t, locale } = useTranslation();
  usePageTitle(t.daily.pageTitle);
  const {
    targetDate,
    day,
    overview,
    pelajaran,
    piket,
    mbg,
    tugas,
    isLoading,
    error,
  } = useDailyOverview();

  const dayLabel = day ? (DAY_LABEL[day]?.[locale] ?? day) : null;
  const hasAutoContent =
    pelajaran.length > 0 ||
    piket.length > 0 ||
    mbg.length > 0 ||
    tugas.length > 0;
  const hasIntervention =
    Boolean(overview?.pakaian) ||
    Boolean(overview?.bawaan) ||
    Boolean(overview?.catatan);

  const renderScheduleTable = (rows: ScheduleRow[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[14px]">
        <thead className="kicker border-b border-border text-[10px]">
          <tr>
            <th className="py-2.5 pr-4 font-normal">{t.schedule.timeColumn}</th>
            <th className="py-2.5 px-4 font-normal">
              {t.schedule.subjectColumn}
            </th>
            <th className="py-2.5 pl-4 font-normal">{t.schedule.roomColumn}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((r) => {
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
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="09"
          label={t.nav.daily}
          title={t.daily.heading}
          description={t.daily.description}
        />

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            {error}
          </p>
        ) : (
          <>
            {/* Tanggal sasaran — konteks utama halaman */}
            <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/60 pb-5">
              <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {dayLabel ?? "—"}
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {labelTanggal(targetDate)}
              </span>
              {overview?.is_intervened && (
                <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                  {t.admin.interventionData}
                </span>
              )}
            </div>

            {!overview && !hasAutoContent && (
              <p className="mt-10 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
                {t.daily.notGenerated}
              </p>
            )}

            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {/* Kolom jadwal */}
              <div className="space-y-10 lg:col-span-2">
                <section>
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-xl font-medium tracking-tight">
                      {t.daily.scheduleSection}
                    </h3>
                    <span className="h-px flex-1 bg-border" aria-hidden />
                  </div>
                  <div className="mt-4">
                    {pelajaran.length > 0 ? (
                      renderScheduleTable(pelajaran)
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        {t.daily.noSchedule}
                      </p>
                    )}
                  </div>
                </section>

                {piket.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4">
                      <h3 className="font-display text-xl font-medium tracking-tight">
                        {t.daily.dutySection}
                      </h3>
                      <span className="h-px flex-1 bg-border" aria-hidden />
                    </div>
                    <div className="mt-4 space-y-4">
                      {piket.map((item) => (
                        <div key={item.id}>
                          <p className="kicker mb-2 text-[10px] text-muted-foreground">
                            {item.group_name}
                            {item.area ? ` · ${item.area}` : ""}
                          </p>
                          <MemberList members={toMemberRows(item.members)} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {mbg.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4">
                      <h3 className="font-display text-xl font-medium tracking-tight">
                        {t.daily.mbgSection}
                      </h3>
                      <span className="h-px flex-1 bg-border" aria-hidden />
                    </div>
                    <div className="mt-4 space-y-4">
                      {mbg.map((item) => (
                        <div key={item.id}>
                          {item.notes && (
                            <p className="kicker mb-2 text-[10px] text-muted-foreground">
                              {item.notes}
                            </p>
                          )}
                          <MemberList
                            members={toMemberRows(
                              item.menu
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Kolom tugas + info harian */}
              <div className="space-y-8">
                <section>
                  <h3 className="font-display text-lg font-medium">
                    {t.daily.tasksSection}
                  </h3>
                  {tugas.length === 0 ? (
                    <p className="mt-3 text-sm italic text-muted-foreground">
                      {t.daily.noTasks}
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {tugas.map((item) => (
                        <Link
                          key={item.id}
                          to={`/tugas/${taskSlug(item)}`}
                          className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40 hover:bg-card/60"
                        >
                          <span
                            className={`min-w-0 flex-1 text-sm font-medium ${
                              item.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                            {item.category}
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                <InfoCard
                  icon={Shirt}
                  label={t.daily.clothing}
                  value={overview?.pakaian ?? null}
                />
                <InfoCard
                  icon={Backpack}
                  label={t.daily.belongings}
                  value={overview?.bawaan ?? null}
                  multiline
                />
                <InfoCard
                  icon={StickyNote}
                  label={t.daily.note}
                  value={overview?.catatan ?? null}
                />

                {!hasIntervention && (
                  <p className="text-[12px] italic text-muted-foreground">
                    {t.daily.empty}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
