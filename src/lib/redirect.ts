/**
 * Helper bersama untuk validasi tujuan redirect internal.
 *
 * Mencegah open-redirect: hanya menerima path yang dimulai dengan "/" dan
 * bukan "//" atau skema seperti "http". Dipakai oleh /auth, /register, dan
 * guard RequireVerified.
 */
export function resolveInternalRedirect(
  returnTo: string | null,
  fallback = "/",
): string {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}
