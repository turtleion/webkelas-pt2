import { useMemo, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { useTasks } from "@/hooks/use-tasks";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { useOrganization } from "@/hooks/use-organization";
import { Loader2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { pecahTanggal } from "@/lib/tanggal";
import { Link } from "react-router";
import type { TaskRow } from "@/lib/db";

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_ID = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Max tasks shown in the compact right-side list. Change here to adjust.
const TASK_LIST_CAP = 6;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
export function taskSlug(item: TaskRow) {
  const slugified = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${item.date}--${item.id.slice(0, 8)}--${slugified}`;
}

export default function Tugas() {
  const { t, locale } = useTranslation();
  usePageTitle(t.tasks.pageTitle);
  const { data: orgData } = useOrganization();
  const { data: agendaItems, isLoading } = useTasks();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  // Auto-select today on open, using the same YYYY-MM-DD format as the cells
  const [selectedDate, setSelectedDate] = useState<string | null>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );
  const [showAll, setShowAll] = useState(false);

  const months = locale === "en" ? MONTHS_EN : MONTHS_ID;
  const dayNames = locale === "en" ? DAYS_EN : DAYS_ID;
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskRow[]> = {};
    agendaItems.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [agendaItems]);

  const navigateMonth = (delta: number) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const calendarDays: Array<{ date: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push({ date: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ date: d, dateStr });
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const filteredTasks = useMemo(() => {
    return agendaItems
      .filter((item) => {
        const d = new Date(item.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [agendaItems, currentYear, currentMonth]);

  const cappedTasks = filteredTasks.slice(0, TASK_LIST_CAP);
  const exceeded = filteredTasks.length > TASK_LIST_CAP;

  const renderTaskList = (tasks: TaskRow[]) => {
    const grouped = Object.entries(
      tasks.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
      }, {} as Record<string, TaskRow[]>)
    ).sort(([a], [b]) => a.localeCompare(b));

    return (
      <div>
        {grouped.map(([date, items]) => (
          <div key={date} className="mb-3 last:mb-0">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {pecahTanggal(date).hari} {pecahTanggal(date).bulanSingkat} {pecahTanggal(date).tahun}
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/tugas/${taskSlug(item)}`}
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40 hover:bg-card/60"
                >
                  <span className={`min-w-0 flex-1 text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </span>
                  <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                    {item.category}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten" className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <PageHeader
          nomor="02"
          label={t.nav.agenda}
          title={t.tasks.heading}
          description={t.tasks.description}
        />

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className={`mt-8 grid gap-8 ${showAll ? "lg:grid-cols-1" : "lg:grid-cols-3"}`}>
              {/* Calendar — main area */}
              <div className={showAll ? "" : "lg:col-span-2"}>
                <div className="glass rounded-xl border border-border/60 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <button type="button" onClick={() => navigateMonth(-1)} className="rounded px-3 py-1 font-mono text-sm text-muted-foreground hover:bg-card/80 hover:text-foreground">←</button>
                    <h2 className="font-display text-xl font-medium">{months[currentMonth]} {currentYear}</h2>
                    <button type="button" onClick={() => navigateMonth(1)} className="rounded px-3 py-1 font-mono text-sm text-muted-foreground hover:bg-card/80 hover:text-foreground">→</button>
                  </div>

                  {/* Balanced date cells: py matches horizontal gap */}
                  <div className={`grid grid-cols-7 gap-1.5 text-center ${showAll ? "min-h-[300px]" : "min-h-[240px]"}`}>
                    {dayNames.map((d) => (
                      <div key={d} className="py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{d}</div>
                    ))}
                    {calendarDays.map((cell, i) => {
                      if (cell.date === null) return <div key={`empty-${i}`} className="py-3" />;
                      const hasTasks = cell.dateStr && tasksByDate[cell.dateStr]?.length;
                      const isToday = cell.dateStr === todayStr;
                      const isSelected = cell.dateStr === selectedDate;
                      return (
                        <button
                          key={cell.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(cell.dateStr === selectedDate ? null : cell.dateStr)}
                          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg py-3 text-sm transition-colors ${
                            isSelected
                              ? "bg-primary/20 ring-2 ring-primary font-semibold text-primary"
                              : isToday
                                ? "bg-primary/10 font-semibold text-primary"
                                : hasTasks
                                  ? "bg-accent/5 font-medium text-foreground hover:bg-accent/10"
                                  : "text-muted-foreground hover:bg-muted/30"
                          }`}
                        >
                          <span>{cell.date}</span>
                          {hasTasks && (
                            <div className="mt-0.5 flex gap-0.5">
                              {tasksByDate[cell.dateStr!].slice(0, 3).map((_, j) => (
                                <span key={j} className="inline-block size-1 rounded-full bg-accent" />
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
                  {t.tasks.clickDayHint}
                </p>
              </div>

              {/* Right-side task list (capped) — only when collapsed */}
              {!showAll && (
                <div className="block">
                  <h3 className="mb-3 font-display text-lg font-medium">{t.tasks.allTasks}</h3>
                  <p className="mb-3 text-[12px] text-muted-foreground">{t.tasks.clickTaskHint}</p>
                  {cappedTasks.length === 0 ? (
                    <p className="text-sm italic text-muted-foreground">{t.tasks.empty}</p>
                  ) : (
                    <>
                      {renderTaskList(cappedTasks)}
                      {exceeded && (
                        <button
                          type="button"
                          onClick={() => setShowAll(true)}
                          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border/60 bg-card/30 py-2 text-[11px] text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground cursor-pointer"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Expanded full task list below calendar */}
            {showAll && (
              <div className="mt-8 border-t border-border/60 pt-6">
                <h3 className="mb-1 font-display text-lg font-medium">{t.tasks.allTasks}</h3>
                <p className="mb-3 text-[12px] text-muted-foreground">{t.tasks.clickTaskHint}</p>
                {renderTaskList(filteredTasks)}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll(false)}
                    className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/30 px-4 py-2 text-[11px] text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground cursor-pointer"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Selected date tasks */}
            {selectedDate && tasksByDate[selectedDate]?.length ? (
              <div className="mt-10 border-t border-border/60 pt-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" aria-hidden />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {selectedDate}
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                </div>
                <div className="space-y-6">
                  {tasksByDate[selectedDate].map((item) => {
                    const td = pecahTanggal(item.date);
                    return (
                      <Link
                        key={item.id}
                        to={`/tugas/${taskSlug(item)}`}
                        className="group block glass rounded-xl border border-border/60 p-6 transition-colors hover:border-primary/40 hover:bg-card/40"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-display text-2xl font-medium leading-tight tracking-tight md:text-3xl">
                            {item.title}
                          </h3>
                          <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                          {td.hari} {td.bulanSingkat} {td.tahun}
                        </div>
                        {item.description && (
                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : selectedDate ? (
              <div className="mt-10 border-t border-border/60 pt-8 text-center">
                <p className="text-sm italic text-muted-foreground">{t.tasks.empty}</p>
              </div>
            ) : null}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
