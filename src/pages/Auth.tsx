import { Button } from "@/components/ui/button";
import { KelasMark } from "@/components/site/KelasMark";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useOrganization } from "@/hooks/use-organization";
import { resolveInternalRedirect } from "@/lib/redirect";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

export default function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { t } = useTranslation();
  usePageTitle(t.auth.pageTitle);
  const { isLoading, isAuthenticated, isVerified, signIn, signInAsGuest } =
    useAuth();
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToRaw = searchParams.get("returnTo");
  const redirect = resolveInternalRedirect(
    returnToRaw,
    redirectAfterAuth ?? "/dashboard",
  );
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setelah login, jika tujuan adalah route protected dan user belum
  // verified, arahkan ke /register dengan returnTo sama. Jika verified,
  // langsung ke tujuan. Tanpa returnTo, fallback default.
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const PROTECTED = ["/pengumuman", "/jadwal", "/agenda"];
    const isProtectedDest = PROTECTED.some((p) =>
      redirect === p || redirect.startsWith(p + "/"),
    );
    if (isProtectedDest && !isVerified) {
      const reg = `/register?returnTo=${encodeURIComponent(redirect)}`;
      navigate(reg, { replace: true });
    } else {
      navigate(redirect, { replace: true });
    }
  }, [isLoading, isAuthenticated, isVerified, navigate, redirect]);

  const handleGoogle = async () => {
    setError(null);
    try {
      await signIn();
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError(t.auth.errorGoogle);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setIsLoadingAction(true);
    try {
      await signInAsGuest();
      navigate(redirect, { replace: true });
    } catch (e) {
      console.error("Guest login error:", e);
      setError(t.auth.errorGuest);
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        to="/"
        className="group inline-flex items-center gap-3"
        aria-label={t.auth.backHome}
      >
        <KelasMark className="size-11 text-primary transition-colors group-hover:text-accent" />
        <span className="text-left leading-tight">
          <span className="block font-display text-xl font-semibold tracking-tight">
            {kelas.nama || "Arsip Kelas"}
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {t.nav.home}
          </span>
        </span>
      </Link>

      <section className="glass glass-hover mt-10 w-full max-w-md">
        <div className="px-7 py-9 sm:px-9">
          <p className="kicker text-[10px]">{t.auth.badge}</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
            {t.auth.heading}
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {t.auth.description}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer border-border/80 bg-background/40 font-mono text-[12px] uppercase tracking-[0.14em]"
              onClick={() => void handleGoogle()}
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="mr-2 size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {t.auth.googleBtn}
            </Button>

            <div className="relative my-1">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/70" />
              </span>
              <span className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t.auth.orSeparator}
                </span>
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer border-border/80 bg-background/40 font-mono text-[12px] uppercase tracking-[0.14em]"
              onClick={() => void handleGuest()}
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t.auth.guestBtn}
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-center text-[13px] text-destructive">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="font-mono text-[11px] uppercase tracking-wider text-accent underline underline-offset-4 hover:text-accent/80"
            >
              {t.auth.backHome}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
