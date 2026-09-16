import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Edge Function: kirim push FCM ke semua perangkat yang punya token.
 *
 * Dipanggil oleh Supabase internal (pg_net trigger) setelah daily_overview
 * dibuat — bukan dipanggil browser/kliien. Keamanan: mengharuskan
 * `Authorization: Bearer <service_role>` (hanya dikenal server internal).
 *
 * Konfigurasi (Supabase Secrets):
 *   FCM_SERVICE_ACCOUNT  — JSON service account key Firebase (string)
 *   SUPABASE_SERVICE_ROLE_KEY
 */

interface TokenRow {
  token: string;
}

// --- Ambil access token FCM dari service account (JWT) -----------------------
async function getFcmAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const body = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  // Encode base64url
  const enc = (o: object) =>
    btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unsigned = `${enc(header)}.${enc(body)}`;
  // Tanda tangan RS256 pakai Web Crypto (subtle) — butuh DER dari PEM key.
  const pem = sa.private_key;
  const der = pemToDer(pem);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const b64sig = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const jwt = `${unsigned}.${b64sig}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await resp.json();
  return data.access_token;
}

// PEM → DER (hapus header/footer + base64 decode)
function pemToDer(pem: string): Uint8Array {
  const b64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// --- Kirim ke satu token -----------------------------------------------------
async function sendToToken(
  accessToken: string,
  token: string,
  title: string,
  body: string,
  targetDate: string,
): Promise<boolean> {
  const projectId = Deno.env.get("FCM_PROJECT_ID") ?? "arsip-kelas";
  const resp = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data: { target_date: targetDate, path: "/daily" },
          android: { priority: "HIGH" },
        },
      }),
    },
  );
  return resp.ok;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/** Helper — response JSON dengan CORS headers otomatis. */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(async (req) => {
  // Preflight CORS (browser kirim OPTIONS dulu untuk cross-origin).
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // --- Auth: service role (internal) ATAU PUSH_API_SECRET (trigger DB) -------
  const auth = req.headers.get("authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const pushSecret = Deno.env.get("PUSH_API_SECRET") ?? "";
  const valid =
    (serviceKey && auth === `Bearer ${serviceKey}`) ||
    (pushSecret && auth === `Bearer ${pushSecret}`);
  if (!valid) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const title = url.searchParams.get("title") ?? "Pemberitahuan Hari Esok";
    const body =
      url.searchParams.get("body") ??
      "Pemberitahuan Hari Esok telah ada, yuk lihat!";
    const targetDate = url.searchParams.get("target_date") ?? "";

    const sb = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: tokens, error } = await sb
      .from("push_tokens")
      .select("token");

    if (error || !tokens) {
      return json(
        { ok: false, error: error?.message ?? "no tokens" },
        500,
      );
    }

    const sa = Deno.env.get("FCM_SERVICE_ACCOUNT");
    if (!sa)
      return json({ ok: false, error: "FCM_SERVICE_ACCOUNT missing" }, 500);

    try {
      const access = await getFcmAccessToken(sa);
      const results = await Promise.all(
        (tokens as TokenRow[]).map((t) =>
          sendToToken(access, t.token, title, body, targetDate),
        ),
      );
      const ok = results.filter(Boolean).length;
      return json({ ok: true, sent: ok, failed: results.length - ok });
    } catch (e) {
      return json({ ok: false, error: String(e) }, 500);
    }
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});
