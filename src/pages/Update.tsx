import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { fetchLatestUpdate } from "@/lib/update";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Download, AlertTriangle, CheckCircle } from "lucide-react";

const UPDATE_PREF_KEY = "ak-update-popup-disabled";

export default function UpdatePage() {
  const { t } = useTranslation();
  const [currentVersion, setCurrentVersion] = useState<string>("v1.0");
  const [currentCode, setCurrentCode] = useState<number>(0);
  const [latestVersion, setLatestVersion] = useState<string>("");
  const [latestCode, setLatestCode] = useState<number>(0);
  const [apkUrl, setApkUrl] = useState<string>("");
  const [releaseNotes, setReleaseNotes] = useState<string | null>(null);
  const [isForced, setIsForced] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [disablePopup, setDisablePopup] = useState(() => {
    try {
      return localStorage.getItem(UPDATE_PREF_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const getVersion = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { version, build } = await App.getInfo();
          setCurrentVersion(version);
          const code = parseInt(build, 10);
          if (!Number.isNaN(code)) setCurrentCode(code);
        } catch {
          setCurrentVersion("v1.0");
        }
      } else {
        setCurrentVersion("v1.0 (web)");
      }
    };
    void getVersion();
  }, []);

  // Background update check on mount (delayed, non-blocking)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setTimeout(() => {
        void checkForUpdates(true);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkForUpdates = useCallback(
    async (silent = false) => {
      if (!silent) setIsChecking(true);
      setError(null);

      try {
        const info = await fetchLatestUpdate();

        if (!info) {
          setLatestVersion("");
          setApkUrl("");
          setUpdateAvailable(false);
          return;
        }

        setLatestVersion(info.version_name);
        setLatestCode(info.version_code);
        setApkUrl(info.apk_url);
        setReleaseNotes(info.notes);
        setIsForced(info.is_forced);

        const hasUpdate = info.version_code > currentCode;
        setUpdateAvailable(hasUpdate);

        if (hasUpdate && !silent && (!disablePopup || info.is_forced)) {
          setShowUpdatePopup(true);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (!silent) setError(msg);
      } finally {
        if (!silent) setIsChecking(false);
      }
    },
    [currentCode, disablePopup],
  );

  const handleDownloadAndInstall = async () => {
    if (!Capacitor.isNativePlatform()) {
      if (apkUrl) {
        await Browser.open({ url: apkUrl });
      }
      return;
    }

    if (!apkUrl) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const fileName = "tkj1smknice-update.apk";
      const filePath = `${fileName}`;

      const response = await fetch(apkUrl);
      if (!response.ok) throw new Error("Download failed");

      const contentLength = parseInt(
        response.headers.get("content-length") || "0",
        10,
      );
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength > 0) {
          setDownloadProgress(
            Math.round((receivedLength / contentLength) * 100),
          );
        }
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // Chunked base64 — hindari stack overflow String.fromCharCode(...) pada APK besar
      let binary = "";
      const CHUNK = 0x8000;
      for (let i = 0; i < combined.length; i += CHUNK) {
        binary += String.fromCharCode(...combined.subarray(i, i + CHUNK));
      }
      const base64 = btoa(binary);

      await Filesystem.writeFile({
        path: filePath,
        data: base64,
        directory: Directory.Documents,
        recursive: true,
      });

      const { uri } = await Filesystem.getUri({
        directory: Directory.Documents,
        path: fileName,
      });

      await Browser.open({ url: uri });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Download/install failed";
      toast.error(msg);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handlePopupDismiss = (dontShowAgain: boolean) => {
    setShowUpdatePopup(false);
    if (dontShowAgain) {
      setDisablePopup(true);
      try {
        localStorage.setItem(UPDATE_PREF_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  const handleToggleDisablePopup = (checked: boolean) => {
    setDisablePopup(checked);
    try {
      localStorage.setItem(UPDATE_PREF_KEY, checked ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SiteHeader />
        <main className="flex-1">
          <div className="text-center p-8">
            <AlertTriangle className="size-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-medium">
              Update page is Android only
            </h2>
            <p className="mt-2 text-muted-foreground">
              This page is only available in the Android app.
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten" className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display text-2xl font-medium tracking-tight">
            {t.nav.update}
          </h1>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl border border-border/60 bg-card/80 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.update.currentVersion}
                </p>
                <p className="mt-1 font-display text-lg font-medium">
                  {currentVersion}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.update.latestVersion}
                </p>
                <p className="mt-1 font-display text-lg font-medium">
                  {latestVersion ||
                    (isChecking ? t.update.checking : t.update.unknown)}
                </p>
              </div>
            </div>

            {releaseNotes && updateAvailable && (
              <div className="mt-4 rounded border border-border/60 bg-background/40 p-3 text-sm text-muted-foreground">
                <p className="font-mono text-[10px] uppercase tracking-wider">
                  {t.update.notes}
                </p>
                <p className="mt-1 whitespace-pre-line">{releaseNotes}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => void checkForUpdates(false)}
                disabled={isChecking}
                className="flex items-center gap-2"
              >
                {isChecking && <Loader2 className="size-4 animate-spin" />}
                <Download className="size-4" />
                {isChecking ? t.update.checking : t.update.checkForUpdates}
              </Button>

              {error && (
                <span className="flex items-center gap-1.5 text-red-500 text-sm">
                  <AlertTriangle className="size-4" />
                  {error}
                </span>
              )}

              {updateAvailable && !isChecking && (
                <span className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
                  <CheckCircle className="size-4" />
                  {t.update.updateAvailable}
                </span>
              )}

              {!updateAvailable && latestVersion && !isChecking && !error && (
                <span className="flex items-center gap-1.5 text-green-500 text-sm font-medium">
                  <CheckCircle className="size-4" />
                  {t.update.upToDate}
                </span>
              )}
            </div>

            {updateAvailable && !isChecking && !isDownloading && (
              <Button
                onClick={handleDownloadAndInstall}
                className="mt-4 w-full"
                size="lg"
              >
                <Download className="size-4 mr-2" />
                {t.update.installUpdate}
              </Button>
            )}

            {isDownloading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t.update.downloading}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2">
              <Checkbox
                id="disable-popup"
                checked={disablePopup}
                onCheckedChange={handleToggleDisablePopup}
                disabled={isForced}
              />
              <label
                htmlFor="disable-popup"
                className="text-sm text-muted-foreground"
              >
                {t.update.dontShowAgain}
              </label>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{t.update.note1}</p>
            <p className="mt-1">{t.update.note2}</p>
          </div>
        </div>
      </main>
      <SiteFooter />

      {/* Update Popup */}
      {showUpdatePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isForced && handlePopupDismiss(false)}
        >
          <div
            className="glass w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-medium">
              {t.update.popupTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t.update.popupBody}
            </p>

            {isForced && (
              <p className="mt-2 text-sm font-medium text-destructive">
                {t.update.forced}
              </p>
            )}

            {releaseNotes && (
              <div className="mt-3 rounded border border-border/60 bg-background/40 p-3 text-sm text-muted-foreground">
                <p className="font-mono text-[10px] uppercase tracking-wider">
                  {t.update.notes}
                </p>
                <p className="mt-1 whitespace-pre-line">{releaseNotes}</p>
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t.update.currentVersion}
                </span>
                <span className="font-medium">{currentVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t.update.latestVersion}
                </span>
                <span className="font-medium">{latestVersion}</span>
              </div>
            </div>

            {!isForced && (
              <div className="mt-4 flex items-center gap-2">
                <Checkbox
                  id="popup-disable"
                  checked={false}
                  onCheckedChange={(checked: boolean) =>
                    handlePopupDismiss(checked)
                  }
                />
                <label
                  htmlFor="popup-disable"
                  className="text-sm text-muted-foreground"
                >
                  {t.update.dontShowAgain}
                </label>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              {!isForced && (
                <Button
                  variant="outline"
                  onClick={() => handlePopupDismiss(false)}
                  className="flex-1"
                >
                  {t.update.cancel}
                </Button>
              )}
              <Button onClick={handleDownloadAndInstall} className="flex-1">
                <Download className="size-4 mr-2" />
                {t.update.update}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}