import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Edge Function: ambil update APK aktif terbaru.
 *
 * Publik (verify_jwt = false) — data update tidak sensitif, dipanggil app
 * tanpa auth. Hanya mengembalikan baris app_updates dengan is_active = true,
 * version_code tertinggi.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data, error } = await sb
      .from("app_updates")
      .select("version_code, version_name, apk_url, notes, is_forced")
      .eq("is_active", true)
      .order("version_code", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return json({ ok: false, error: error.message }, 500);
    if (!data) return json({ ok: true, update: null });

    return json({ ok: true, update: data });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});