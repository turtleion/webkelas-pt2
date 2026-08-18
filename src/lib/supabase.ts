import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk frontend.
 *
 * Hanya memakai kunci anon/publishable — aman di sisi klien.
 * Kunci service-role TIDAK PERNAH boleh masuk ke frontend.
 * RLS di sisi Supabase yang mengamankan akses data per-pengguna.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
);
