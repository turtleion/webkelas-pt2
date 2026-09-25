/**
 * Pengambilan info update APK untuk halaman Update & popup.
 * Data dari Edge Function fetch-update (bukan GitHub API) — diatur admin
 * lewat /admin/update-configuration.
 */

export interface AppUpdateInfo {
  version_code: number;
  version_name: string;
  apk_url: string;
  notes: string | null;
  is_forced: boolean;
}

const FETCH_UPDATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-update`;

export async function fetchLatestUpdate(): Promise<AppUpdateInfo | null> {
  try {
    const resp = await fetch(FETCH_UPDATE_URL);
    if (!resp.ok) throw new Error(`fetch-update error: ${resp.status}`);
    const data = await resp.json();
    return data?.update ?? null;
  } catch (err) {
    // Jangan ganggu UX saat API update mati — halaman tetap tampil versi lokal
    console.warn("[update] fetchLatestUpdate gagal:", err);
    return null;
  }
}