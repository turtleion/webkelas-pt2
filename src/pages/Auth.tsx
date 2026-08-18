import { Button } from "@/components/ui/button";
import { KelasMark } from "@/components/site/KelasMark";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

export default function Auth({ redirectAfterAuth }: AuthProps = {}) {
  usePageTitle("Masuk");
  const { isLoading, isAuthenticated, signIn, signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, redirect]);

  const handleGoogle = async () => {
    setError(null);
    try {
      await signIn();
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError(
        "Gagal memulai masuk dengan Google. Coba lagi, atau gunakan mode tamu.",
      );
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
      setError("Gagal masuk sebagai tamu. Coba lagi.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        to="/"
        className="group inline-flex items-center gap-3"
        aria-label="Kembali ke beranda"
      >
        <KelasMark className="size-11 text-primary transition-colors group-hover:text-accent" />
        <span className="text-left leading-tight">
          <span className="block font-display text-xl font-semibold tracking-tight">
            X TKJ 1
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Arsip Kelas Digital
          </span>
        </span>
      </Link>

      <section className="glass glass-hover mt-10 w-full max-w-md">
        <div className="px-7 py-9 sm:px-9">
          <p className="kicker text-[10px]">Area anggota</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
            Masuk ke arsip kelas
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Masuk dengan Google untuk menyimpan identitasmu. Belum punya akun
            Google? Kamu tetap bisa masuk sebagai tamu dan kembali lagi nanti.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer border-border/80 bg-background/40 font-mono text-[12px] uppercase tracking-[0.14em]"
              onClick={handleGoogle}
              disabled={isLoadingAction}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                aria-hidden
                fill="currentColor"
              >
                <path d="M12 5.04c1.6 0 3.04.55 4.17 1.62l3.1-3.1C17.48 1.86 14.94.86 12 .86 7.6.86 3.82 3.34 2 6.9l3.62 2.8C6.58 7.13 9.08 5.04 12 5.04z" />
                <path d="M22.06 12.24c0-.78-.07-1.53-.2-2.25H12v4.26h5.64c-.24 1.3-.98 2.4-2.09 3.14l3.36 2.6c1.96-1.81 3.15-4.48 3.15-7.75z" fill="#4285F4" />
              </svg>
              Lanjutkan dengan Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-border/70" />
              </div>
              <div className="relative flex justify-center">
                <span className="kicker bg-[var(--glass-bg-strong)] px-3 text-[9px]">
                  atau
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer border-border/80 bg-background/40 font-mono text-[12px] uppercase tracking-[0.14em]"
              onClick={handleGuest}
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Masuk sebagai tamu"
              )}
            </Button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] leading-snug text-destructive"
            >
              {error}
            </p>
          )}

          <p className="kicker mt-7 text-[9px] text-muted-foreground/80">
            Mode tamu hanya menandai sesi lokal — tidak membuat akun.
          </p>
        </div>
      </section>
    </main>
  );
}
