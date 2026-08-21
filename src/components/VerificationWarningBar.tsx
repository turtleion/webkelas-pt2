import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { resolveInternalRedirect } from "@/lib/redirect";
import { AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

/**
 * Bar merah permanen untuk akun authenticated yang belum terverifikasi.
 * Dirender di SiteHeader + AdminLayout. Klik → /register?returnTo=current.
 * Tidak muncul untuk: anonymous, guest, verified.
 */
export function VerificationWarningBar() {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (user?.guest) return null;
  if (isVerified) return null;

  // Sembunyikan di /register dan /auth (sudah di halaman aktivasi/login).
  const p = location.pathname;
  if (p === "/register" || p === "/auth") return null;

  const ret = resolveInternalRedirect(p + location.search, "/dashboard");
  const href = `/register?returnTo=${encodeURIComponent(ret)}`;

  return (
    <button
      type="button"
      onClick={() => navigate(href, { replace: true })}
      className="block w-full cursor-pointer border-b border-destructive/40 bg-destructive/15 px-4 py-2.5 text-left text-foreground transition-colors hover:bg-destructive/25"
      aria-label={t.verificationBar.cta}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="flex-1 leading-snug">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-destructive">
            {t.verificationBar.title}
         </p>
          <p className="mt-0.5 text-[12.5px] text-foreground/80">
            {t.verificationBar.description}{" "}
            <span className="font-medium text-destructive underline underline-offset-2">
              {t.verificationBar.cta}
           </span>
            .
         </p>
       </div>
     </div>
   </button>
  );
}
