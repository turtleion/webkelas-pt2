import { Link } from "react-router";
import { Capacitor } from "@capacitor/core";
import { Download, ArrowUpRight, Smartphone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { FadeIn } from "@/components/site/FadeIn";

const REPO_RELEASES =
  (import.meta.env.VITE_APP_DOWNLOAD_URL as string | undefined) ??
  "https://github.com/turtleion/webkelas-pt2/releases/latest";

/**
 * Section "Unduh Aplikasi" untuk semua layout beranda — WEB ONLY.
 * Tidak dirender sama sekali di build Android (Capacitor), jadi tidak
 * ada tautan/download yang bocor ke pengguna Android.
 */
export function HomeDownloadSection() {
  const { t } = useTranslation();
  if (Capacitor.isNativePlatform()) return null;

  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-[10px]">No. 09 — {t.nav.download}</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                {t.download.heading}
              </h2>
            </div>
            <Link
              to="/download"
              className="group inline-flex items-center gap-1.5 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.download.allReleases}
              <ArrowUpRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FadeIn delay={80}>
            <div className="flex h-full flex-col justify-between border border-border bg-background p-6">
              <div>
                <Smartphone className="size-6 text-primary" />
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                  {t.download.description}
                </p>
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {t.download.requirement}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="flex h-full flex-col justify-between border border-border bg-background p-6">
              <div className="flex items-center gap-3">
                <span className="kicker text-[10px]">
                  {t.download.stepsTitle}
                </span>
              </div>
              <ol className="mt-4 space-y-2.5">
                {[t.download.step1, t.download.step2, t.download.step3].map(
                  (step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[14px] leading-relaxed"
                    >
                      <span className="kicker w-5 shrink-0 text-[10px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ),
                )}
              </ol>
              <a
                href={REPO_RELEASES}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="size-4" />
                {t.download.downloadApk}
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
