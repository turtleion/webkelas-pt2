import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KelasMark } from "@/components/site/KelasMark";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useOrganization } from "@/hooks/use-organization";
import { resolveInternalRedirect } from "@/lib/redirect";
import { redeemInvitationCode } from "@/lib/db";
import {
  displayNormalized,
  hashCode,
  normalizeCodeInput,
} from "@/lib/invitation-codes";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function Register() {
  const { t } = useTranslation();
  usePageTitle(t.register.pageTitle);
  const {
    isLoading,
    isAuthenticated,
    isVerified,
    user,
    signIn,
    signOut,
  } = useAuth();
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = resolveInternalRedirect(searchParams.get("returnTo"), "/");

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  // Sudah terdaftar → keluar dari /register ke tujuan.
  if (!isLoading && isAuthenticated && isVerified) {
    return <Navigate to={returnTo} replace />;
  }

  // Guest tidak boleh aktivasi. Halaman ini akan tampilkan pesan
  // "Anda login sebagai tamu" dengan tombol ke /auth (logout dulu),
  // sehingga guest tidak bisa submit kode undangan.
  const isGuest = !!user?.guest;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeCodeInput(code);
    if (normalized.length === 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const hash = await hashCode(normalized);
      const result = await redeemInvitationCode(hash);
      if (result === "ok") {
        setSucceeded(true);
        toast.success(t.register.successTitle);
        // Full reload agar useAuth (per-component state) dan halaman tujuan
        // melihat verified = true tanpa state basi. Sesi Supabase tetap.
        setTimeout(() => {
          window.location.assign(returnTo);
        }, 900);
      } else {
        // Pisahkan error jaringan dari hasil RPC valid.
        // Pesan generik — tidak membocorkan apakah kode ada/terpakai.
        setError(t.register.errorGeneric);
      }
    } catch {
      // Network / RPC error → pesan berbeda dari kode invalid.
      setError(t.register.errorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading spinner sambil auth state resolving.
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <Link
        to="/"
        className="group inline-flex items-center gap-3"
        aria-label={t.register.backHome}
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
          {succeeded ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="size-12 text-accent" />
              <h1 className="mt-4 font-display text-2xl font-medium tracking-tight">
                {t.register.successTitle}
              </h1>
              <p className="mt-2 font-mono text-[12px] uppercase tracking-wider text-muted-foreground">
                {t.register.successDesc}
              </p>
            </div>
          ) : !isAuthenticated ? (
            // Anonymous/guest — minta Google dulu.
            <div className="py-6">
              <p className="kicker text-[10px]">{t.register.badge}</p>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
                {t.register.googlePromptTitle}
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {t.register.googlePromptDesc}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-7 h-11 w-full cursor-pointer border-border/80 bg-background/40 font-mono text-[12px] uppercase tracking-[0.14em]"
                onClick={() => void signIn()}
              >
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
                {t.register.googleBtn}
              </Button>
            </div>
          ) : isGuest ? (
            // Guest tidak boleh aktivasi.
            <div className="py-6">
              <p className="kicker text-[10px]">{t.register.badge}</p>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
                {t.register.guestBlockTitle}
             </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {t.register.guestBlockDesc}
             </p>
              <Button
                type="button"
                className="mt-7 h-11 w-full cursor-pointer bg-primary font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground"
                onClick={() => void handleSignOut()}
              >
                {t.register.guestBlockCta}
             </Button>
           </div>
          ) : (
            // Authenticated, unverified — form kode undangan.
            <>
              <p className="kicker text-[10px]">{t.register.badge}</p>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
                {t.register.heading}
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {t.register.description}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                <div>
                  <label
                    className="kicker block text-[10px]"
                    htmlFor="invitation-code"
                  >
                    {t.register.codeLabel}
                  </label>
                  <Input
                    id="invitation-code"
                    value={code ? displayNormalized(normalizeCodeInput(code)) : ""}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t.register.codePlaceholder}
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    className="mt-1 bg-background/50 font-mono text-center text-base tracking-[0.2em] uppercase"
                    disabled={isSubmitting}
                  />
                </div>

                {error && (
                  <p className="text-center text-[13px] text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer bg-primary font-mono text-[12px] uppercase tracking-[0.14em] text-primary-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t.register.submitting}
                    </>
                  ) : (
                    t.register.submitBtn
                  )}
                </Button>
              </form>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="mt-5 w-full text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {t.register.signOutLink}
              </button>
            </>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/"
              className="font-mono text-[11px] uppercase tracking-wider text-accent underline underline-offset-4 hover:text-accent/80"
            >
              {t.register.backHome}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
