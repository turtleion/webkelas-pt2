import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { useTasks } from "@/hooks/use-tasks";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pecahTanggal } from "@/lib/tanggal";
import { ArrowLeft } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { taskSlug } from "./Tugas";
import type { TaskRow } from "@/lib/db";

export default function TugasDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: agendaItems } = useTasks();

  const [task, setTask] = useState<TaskRow | null>(null);

  usePageTitle(task?.title ?? t.tasks.pageTitle);

  useEffect(() => {
    if (!slug) return;
    const found = agendaItems.find((item) => taskSlug(item) === slug);
    setTask(found ?? null);
  }, [slug, agendaItems]);

  const td = task ? pecahTanggal(task.date) : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten" className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <Link to="/tugas" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" />
          {t.tasks.allTasks}
        </Link>

        {!task ? (
          <p className="py-12 text-center font-display text-xl italic text-muted-foreground">
            {t.tasks.empty}
          </p>
        ) : (
          <article>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {td?.hari} {td?.bulanSingkat} {td?.tahun}
              </span>
              <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                {task.category}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {task.title}
            </h1>

            <div className="mt-8 border-t border-border/60 pt-8">
              {task.description ? (
                <div
                  className="prose prose-sm max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(task.description) }}
                />
              ) : (
                <p className="italic text-muted-foreground">
                  {t.tasks.empty}
                </p>
              )}
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
