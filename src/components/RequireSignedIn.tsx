import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

/**
 * Guard untuk halaman yang butuh real authenticated user — TIDAK guest.
 *
 * - Anonymous       → /auth?returnTo=…
 * - Guest           → /auth?returnTo=…  (guest flags dibersihkan oleh /auth flow)
 * - Authenticated (verified ATAU unverified) → children
 *
 * Bedanya dengan RequireVerified: komponen ini TIDAK meminta status
 * verifikasi. User yang sudah Google-login tapi belum aktivasi kode
 * undangan tetap boleh masuk (mereka akan melihat VerificationWarningBar
 * di layout). Pemblokiran "/jadwal, /pengumuman, /agenda" terhadap
 * unverified Google user adalah bug, bukan fitur.
 */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
     </main>
    );
  }

  if (!isAuthenticated || user?.guest) {
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
