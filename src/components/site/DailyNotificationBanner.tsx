import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Bell, X } from "lucide-react";
import { getCurrentDailyOverview, type DailyOverviewRow } from "@/lib/db";
import { todayWIB } from "@/lib/daily";
import { useTranslation } from "@/hooks/use-translation";

const DISMISS_KEY = "ak-daily-notice-dismissed";

/**
 * Pemberitahuan "Hari Esok" dalam aplikasi.
 *
 * Sumber datanya baris `daily_overview` yang dibuat penjadwal server
 * (pg_cron, 15:00 WIB). Yang dicatat di sini hanya status "sudah dibaca"
 * per tanggal sasaran — bukan timer, bukan penjadwal.
 */
export function DailyNotificationBanner() {
  const { t } = useTranslation();
  const location = useLocation();
  const [overview, setOverview] = useState<DailyOverviewRow | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(DISMISS_KEY),
  );

  useEffect(() => {
    let mounted = true;
    void getCurrentDailyOverview(todayWIB())
      .then((row) => {
        if (mounted) setOverview(row);
      })
      .catch((err) => {
        console.warn(
          "[DailyNotificationBanner] gagal memuat pemberitahuan:",
          err,
        );
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!overview?.notified_at) return null;
  if (dismissed === overview.target_date) return null;
  if (location.pathname === "/daily") return null;

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, overview.target_date);
    setDismissed(overview.target_date);
  };

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center md:inset-x-auto md:right-6 md:justify-end">
      <div className="glass pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-lg">
        <Bell className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-medium">
            {t.daily.bannerTitle}
          </p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
            {t.daily.bannerBody}
          </p>
          <Link
            to="/daily"
            className="mt-2 inline-block font-mono text-[10px] uppercase tracking-wider text-primary underline-offset-4 hover:underline"
          >
            {t.daily.bannerCta}
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t.daily.bannerDismiss}
          className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
