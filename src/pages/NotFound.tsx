import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { KelasMark } from "@/components/site/KelasMark";
import { usePageTitle } from "@/hooks/use-page-title";
import { useOrganization } from "@/hooks/use-organization";
import { useTranslation } from "@/hooks/use-translation";

export default function NotFound() {
  const { t } = useTranslation();
  usePageTitle(t.notFound.pageTitle);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
      <KelasMark className="size-16 text-primary" />
      <p className="kicker mt-8 text-[10px]">
        {kelas.nama || t.nav.home}
      </p>
      <h1 className="mt-4 font-display text-[clamp(4rem,12vw,8rem)] font-medium leading-none tracking-[-0.03em]">
        404
      </h1>
      <p className="mt-4 font-display text-2xl italic text-muted-foreground">
        {t.notFound.heading}
      </p>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
        {t.notFound.description}
      </p>
      <Link
        to="/"
        className="group mt-9 inline-flex items-center gap-2 bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
      >
        <ArrowLeft
          className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5"
          aria-hidden
        />
        {t.notFound.backHome}
      </Link>
    </main>
  );
}
