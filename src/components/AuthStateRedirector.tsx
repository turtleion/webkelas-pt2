import { useAuth } from "@/hooks/use-auth";
import { resolveInternalRedirect } from "@/lib/redirect";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

/**
 * Pengambil keputusan routing berdasarkan status auth.
 *
 * Tanggung jawab TUNGGAL: mengarahkan user dari /auth ke tujuan akhir
 * setelah Google login selesai. Tidak lagi mengarahkan user yang sedang
 * menjelajah halaman lain ke /register — itu melanggar model perizinan
 * (unverified bukan unauthorized).
 *
 * Aturan:
 *
 *   1. Saat user ada di /auth, dan setelah login statusnya authenticated
 *      (verified atau unverified), arahkan ke tujuan (returnTo dari URL
 *      /auth, atau /dashboard). Saat terarah ke /register dari halaman
 *      manapun SELAIN /auth, JANGAN sentuh — biarkan user bebas navigasi.
 *
 *   2. Anonymous yang mencoba halaman wajib-auth (/dashboard, /admin/*)
 *      diarahkan ke /auth?returnTo=… . Halaman publik lain tidak.
 *
 *   3. Guest TIDAK diarahkan oleh komponen ini. Guest-restricted route
 *      ditangani oleh RequireAuth/RequireVerified yang memanggil useAuth.
 */
export function AuthStateRedirector() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = `${location.pathname}${location.search}`;

  // Lacak apakah user "baru saja" sign-in — di-trigger dengan adanya sesi
  // baru saat location.pathname === "/auth". Setelah itu flag di-reset
  // supaya redirector tidak mengejar user ke mana-mana.
  const wasJustOnAuth = useRef(false);
  useEffect(() => {
    if (location.pathname === "/auth") {
      wasJustOnAuth.current = true;
    } else {
      wasJustOnAuth.current = false;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading) return;
    const isOnAuth = location.pathname === "/auth";
    const isOnRegister = location.pathname === "/register";
    const isOnDashboard = location.pathname === "/dashboard";
    const isOnAdmin = location.pathname.startsWith("/admin");

    // 1) Post-login routing: ketika user ada di /auth dan sudah
    //    authenticated, kirim ke tujuan (returnTo).
    //    Verified → langsung ke tujuan.
    //    Unverified → /register?returnTo=tujuan (alur aktivasi awal).
    if (isOnAuth && isAuthenticated && !user?.guest) {
      const ret = resolveInternalRedirect(
        new URLSearchParams(location.search).get("returnTo"),
        "/dashboard",
      );
      // Hindari loop kalau returnTo ternyata /auth atau /register.
      const target = `/register?returnTo=${encodeURIComponent(ret)}`;
      const verified = user?.verified === true;
      navigate(verified ? ret : target, { replace: true });
      return;
    }

    // 2) Anonymous → ke /auth hanya untuk halaman wajib-auth.
    if (!isAuthenticated && !isOnAuth && !isOnRegister) {
      const needsAuth = isOnDashboard || isOnAdmin;
      if (needsAuth) {
        navigate(`/auth?returnTo=${encodeURIComponent(path)}`, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, navigate, location, path]);

  // wasJustOnAuth hanya dipakai untuk memberi sinyal lain (mis. UI),
  // tidak memengaruhi logic lebih lanjut. Suppress unused warning.
  void wasJustOnAuth;

  return null;
}
