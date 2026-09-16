import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { StatusBar } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";
import { SplashScreen } from "@capacitor/splash-screen";
import { PushNotifications } from "@capacitor/push-notifications";
import { GoogleSignIn } from "@capawesome/capacitor-google-sign-in";
import { supabase } from "./supabase";

const isAndroid = Capacitor.getPlatform() === "android";

// Web Client ID dari Google Cloud Console (type "Web application", bukan Android)
const GOOGLE_WEB_CLIENT_ID = import.meta.env
  .VITE_GOOGLE_WEB_CLIENT_ID as string;

let fcmToken: string | null = null;

/** Simpan token FCM ke Supabase — pakai upsert, aman dijalankan ulang. */
async function persistFcmToken(token: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return; // belum login → tidak ada user_id untuk token
  await supabase
    .from("push_tokens")
    .upsert(
      { user_id: user.id, token, platform: "android" },
      { onConflict: "token" },
    );
}

// Kalau token sudah ada (registrasi terjadi sebelum login), persist setelah
// user masuk. Auth state listener aktif terus di native.
if (Capacitor.isNativePlatform()) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && fcmToken) {
      void persistFcmToken(fcmToken);
    }
  });
}

async function registerPush() {
  if (!Capacitor.isNativePlatform() || !isAndroid) return;

  // Android 13+: butuh izin runtime (POST_NOTIFICATIONS) sebelum bisa terima.
  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") return;

  await PushNotifications.register();
}

async function refreshBannerAndToken() {
  // Re-register kalau token berubah (FCM bisa rotate token).
  if (fcmToken) {
    await persistFcmToken(fcmToken);
  } else {
    await registerPush();
  }
}

/**
 * Inisialisasi Capacitor — native-only. Dipanggil sekali dari src/main.tsx
 * dalam blok `if (Capacitor.isNativePlatform())`.
 */
export function initCapacitorNative() {
  if (!Capacitor.isNativePlatform()) return;

  // --- Android back button: history dulu, exit hanya kalau sudah di root ---
  void App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  // --- Refresh sesi + banner saat app kembali aktif (auto-refresh) ----------
  void App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) {
      void supabase.auth.getSession();
      void refreshBannerAndToken();
    }
  });

  // --- FCM: daftar token + listener notifikasi ------------------------------
  void registerPush();
  PushNotifications.addListener("registration", ({ value }) => {
    fcmToken = value;
    void persistFcmToken(value);
  });
  PushNotifications.addListener("registrationError", ({ error }) => {
    console.warn("[FCM] registration error:", error);
  });
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    // App aktif: tampilkan via banner in-app (bukan notif OS ganda).
    console.log("[FCM] received:", notification);
  });
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    // User tap notif OS → buka /daily. Reload penuh: app bisa mati saat itu.
    const path = (action.notification.data?.path as string) ?? "/daily";
    window.location.href = `${window.location.origin}${path}`;
  });

  // --- Status bar: ikuti tema (default web: paper cream #f4eddd) ---
  if (isAndroid) {
    void StatusBar.setOverlaysWebView({ overlay: false });
    void StatusBar.setBackgroundColor({ color: "#f4eddd" });
  }

  // --- Keyboard: (resize diatur di capacitor.config.ts) ---
  Keyboard.addListener("keyboardWillShow", (info) => {
    document.documentElement.style.setProperty(
      "--keyboard-height",
      `${info.keyboardHeight}px`,
    );
  });
  Keyboard.addListener("keyboardWillHide", () => {
    document.documentElement.style.removeProperty("--keyboard-height");
  });

  // --- Splash: sembunyikan manual setelah layout pertama siap ---
  window.addEventListener("load", () => {
    setTimeout(() => {
      void SplashScreen.hide();
    }, 500);
  });

  // --- Google Sign-In plugin: inisialisasi (butuh Web Client ID) ---
  if (GOOGLE_WEB_CLIENT_ID) {
    void GoogleSignIn.initialize({
      clientId: GOOGLE_WEB_CLIENT_ID,
    });
  }

  // --- Deep link handler: fallback kalau OAuth redirect kembali ke app ---
  void App.addListener("appUrlOpen", ({ url }) => {
    if (url.includes("access_token=") || url.includes("code=")) {
      const hash = url.includes("#") ? url.split("#")[1] : url.split("?")[1];
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        if (accessToken) {
          const refreshToken = params.get("refresh_token") ?? undefined;
          void supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? "",
          });
        }
      }
    }
  });
}

/** Buka link eksternal di Custom Tab (native) — bukan di dalam WebView. */
export function openExternalLink(url: string) {
  if (Capacitor.isNativePlatform()) {
    void Browser.open({ url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/** Intercept anchor clicks → Custom Tab (native only). */
export function setupExternalLinkInterceptor() {
  if (!Capacitor.isNativePlatform()) return;
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.('a[href^="http"]') as HTMLAnchorElement | null;
    if (!anchor || !anchor.href) return;
    e.preventDefault();
    void Browser.open({ url: anchor.href });
  });
}