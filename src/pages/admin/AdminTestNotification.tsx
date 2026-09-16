import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { Capacitor } from "@capacitor/core";
import {
  Smartphone,
  Globe,
  Layers,
  Loader2,
  Send,
  Bell,
} from "lucide-react";
import { toast } from "sonner";

const IS_NATIVE = Capacitor.isNativePlatform();

const SEND_PUSH_URL =
  "https://xnykaajlwcznjbkjyyrf.supabase.co/functions/v1/send-push";

const PUSH_SECRET = "df0f2a9e6d853a1994ca550c8e36c806df838dbc12c6386c";

type PushTarget = "android" | "web" | "both";

export default function AdminTestNotification() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.notification} — Test`);

  const [title, setTitle] = useState("Pemberitahuan Hari Esok");
  const [body, setBody] = useState(
    "Pemberitahuan Hari Esok telah ada, yuk lihat!",
  );
  const [loading, setLoading] = useState<PushTarget | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);

  /** Push ke Android via FCM (Edge Function send-push) */
  async function pushAndroid(): Promise<boolean> {
    try {
      const resp = await fetch(
        `${SEND_PUSH_URL}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&target_date=${new Date().toISOString().slice(0, 10)}`,
        {
          headers: { Authorization: `Bearer ${PUSH_SECRET}` },
        },
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? `HTTP ${resp.status}`);
      const msg = `Android: ${data.sent ?? 0} terkirim, ${data.failed ?? 0} gagal`;
      setLastResult(msg);
      toast.success(msg);
      return true;
    } catch (err) {
      const msg = `Android gagal: ${err instanceof Error ? err.message : String(err)}`;
      setLastResult(msg);
      toast.error(msg);
      return false;
    }
  }

  /** Push ke Web via browser Notification API (OS notification) */
  async function pushWeb(): Promise<boolean> {
    try {
      if (!("Notification" in window)) {
        toast.error("Browser tidak mendukung notifikasi");
        setLastResult("Web: browser tidak mendukung Notification API");
        return false;
      }

      let perm = Notification.permission;
      if (perm === "default") {
        perm = await Notification.requestPermission();
      }
      if (perm !== "granted") {
        toast.error("Izin notifikasi ditolak");
        setLastResult("Web: izin notifikasi ditolak");
        return false;
      }

      new Notification(title, {
        body,
        icon: "/logo.svg",
        badge: "/logo.svg",
        tag: "test-notification",
      });
      const msg = "Web: notifikasi browser terkirim";
      setLastResult(msg);
      toast.success(msg);
      return true;
    } catch (err) {
      const msg = `Web gagal: ${err instanceof Error ? err.message : String(err)}`;
      setLastResult(msg);
      toast.error(msg);
      return false;
    }
  }

  async function handlePush(target: PushTarget) {
    setLoading(target);
    setLastResult(null);

    const promises: Promise<boolean>[] = [];

    if (target === "android" || target === "both") {
      promises.push(pushAndroid());
    }
    if (target === "web" || target === "both") {
      promises.push(pushWeb());
    }

    await Promise.all(promises);
    setLoading(null);
  }

  return (
    <AdminLayout>
      <PageHeader
        nomor="09"
        label={t.admin.notification}
        title="Test Notifikasi"
        description="Kirim notifikasi test ke Android (FCM) atau Web (browser notification)."
      />

      <div className="mt-10 grid max-w-2xl gap-6">
        {/* Preview notifikasi */}
        <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 p-4">
          <Bell className="mt-0.5 size-5 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15px] font-medium">
              {title || "(tanpa judul)"}
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
              {body || "(tanpa deskripsi)"}
            </p>
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="notif-title" className="kicker text-[10px]">
            Title
          </Label>
          <Input
            id="notif-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Pemberitahuan Hari Esok"
            className="mt-2"
          />
        </div>

        {/* Body */}
        <div>
          <Label htmlFor="notif-body" className="kicker text-[10px]">
            Description
          </Label>
          <Textarea
            id="notif-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Pemberitahuan Hari Esok telah ada, yuk lihat!"
            className="mt-2"
          />
        </div>

        {/* Push buttons */}
        <div className="grid gap-3 border-t border-border/60 pt-6 sm:grid-cols-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading !== null || IS_NATIVE}
            onClick={() => void handlePush("android")}
            className="gap-2"
          >
            {loading === "android" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Smartphone className="size-4" />
            )}
            PUSH ANDROID
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={loading !== null}
            onClick={() => void handlePush("web")}
            className="gap-2"
          >
            {loading === "web" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Globe className="size-4" />
            )}
            PUSH WEB
          </Button>

          <Button
            type="button"
            disabled={loading !== null}
            onClick={() => void handlePush("both")}
            className="gap-2"
          >
            {loading === "both" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Layers className="size-4" />
            )}
            PUSH BOTH
          </Button>
        </div>

        {/* Status */}
        {lastResult && (
          <div className="flex items-center gap-2 rounded border border-border/60 bg-card/40 px-4 py-3 font-mono text-[12px] text-muted-foreground">
            <Send className="size-3.5 shrink-0" />
            {lastResult}
          </div>
        )}

        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Android push mengirim via FCM ke semua device yang terdaftar.
          Web push menggunakan browser Notification API (izin diperlukan).
          PUSH BOTH menjalankan keduanya secara paralel.
        </p>
      </div>
    </AdminLayout>
  );
}
