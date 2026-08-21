import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

/**
 * Guard untuk route protected yang butuh user authenticated + verified
 * (anggota terdaftar lewat kode invitasi).
 *
 * Anonymous/guest  → /auth?returnTo=…
 * Authenticated,
 *   verified unknown / masih loading → spinner
 *   unverified      → /register?returnTo=…
 *   verified        → children
 *
 * Cek auth dasar dulu, lalu verified. Menuju /auth jika anon/guest,
 * /register jika authenticated tapi belum verified.
 */
export function RequireVerified({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, isVerified, user } = useAuth();
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

  // Authenticated, non-guest. mapUser sudah mengisi verified → boolean pasti.
  if (!isVerified) {
    return (
      <Navigate
        to={`/register?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}
