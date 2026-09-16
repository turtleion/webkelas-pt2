import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useVerificationRequest } from "@/hooks/use-verification-request";
import { resolveInternalRedirect } from "@/lib/redirect";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

/**
 * Bar merah permanen untuk akun authenticated yang belum terverifikasi.
 * Dirender di SiteHeader + AdminLayout.
 *
 * - Klik teks utama → /register?returnTo=current (alur kode undangan).
 * - Tombol "Notify Admin" → alur permintaan verifikasi manual
 *   (sama dengan WelcomeModal, via useVerificationRequest).
 * - Jika sudah ada request pending → tampilkan status menunggu,
 *   bukan tombol duplikat.
 * - Tidak muncul untuk: anonymous, guest, verified.
 */
export function VerificationWarningBar() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    request,
    isSubmitting,
    requestVerification,
  } = useVerificationRequest();

  const hasPending = request?.status === "pending";

  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (user?.guest) return null;
  if (isVerified) return null;

  // Sembunyikan di /register dan /auth (sudah di halaman aktivasi/login).
  const p = location.pathname;
  if (p === "/register" || p === "/auth") return null;

  const ret = resolveInternalRedirect(p + location.search, "/dashboard");
  const href = `/register?returnTo=${encodeURIComponent(ret)}`;

  const handleNotifyAdmin = async () => {
    if (!user || hasPending) return;
    try {
      await requestVerification(user);
      toast.success(t.welcome.notified);
    } catch (err) {
      toast.error(
        err instanceof Error && err.message ? err.message : t.welcome.error,
      );
    }
  };

  return (
    <div className="block w-full cursor-pointer border-b border-destructive/40 bg-destructive/15 text-left text-foreground transition-colors hover:bg-destructive/25">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="flex-1 leading-snug">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-destructive">
            {t.verificationBar.title}
          </p>
          <p className="mt-0.5 text-[12.5px] text-foreground/80">
            {t.verificationBar.description}{" "}
            <button
              type="button"
              onClick={() => navigate(href, { replace: true })}
              className="font-medium text-destructive underline underline-offset-2 hover:text-destructive/80"
              aria-label={t.verificationBar.cta}
            >
              {t.verificationBar.cta}
            </button>
            .
          </p>
        </div>

        {/* Notify Admin / pending state */}
        {hasPending ? (
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded border border-accent/30 bg-accent/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            <ShieldCheck className="size-3.5" />
            {t.verificationBar.pending}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void handleNotifyAdmin()}
            disabled={isSubmitting}
            className="mt-0.5 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded border border-destructive/40 bg-destructive/25 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-destructive transition-colors hover:bg-destructive/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              t.verificationBar.notifyAdmin
            )}
          </button>
        )}
      </div>
    </div>
  );
}