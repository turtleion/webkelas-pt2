import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { Download, ArrowUpRight } from "lucide-react";

/**
 * Halaman unduh APK — WEB ONLY.
 *
 * Route ini hanya didaftarkan di main.tsx ketika berjalan di web
 * (`!Capacitor.isNativePlatform()`), jadi build Android tidak punya
 * halaman ini sama sekali.
 */

const REPO_RELEASES =
  (import.meta.env.VITE_APP_DOWNLOAD_URL as string | undefined) ??
  "https://github.com/turtleion/webkelas-pt2/releases/latest";

const ALL_RELEASES = "https://github.com/turtleion/webkelas-pt2/releases";

export default function DownloadPage() {
  const { t } = useTranslation();
  usePageTitle(t.download.pageTitle);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="10"
          label={t.nav.download}
          title={t.download.heading}
          description={t.download.description}
        />

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={REPO_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="size-4" />
            {t.download.downloadApk}
          </a>
          <a
            href={ALL_RELEASES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.download.allReleases}
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t.download.requirement}
        </p>

        <section className="mt-12">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-medium tracking-tight">
              {t.download.stepsTitle}
            </h2>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <ol className="mt-4 space-y-3">
            {[t.download.step1, t.download.step2, t.download.step3].map(
              (step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[14.5px] leading-relaxed"
                >
                  <span className="kicker w-6 shrink-0 text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ),
            )}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
