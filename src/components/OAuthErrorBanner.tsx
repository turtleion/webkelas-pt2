import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { X, OctagonX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

/**
 * Global OAuth error banner — ditampilkan di SEMUA halaman
 * saat URL mengandung error dari Supabase OAuth redirect.
 *
 * Supabase redirect ke root URL dengan ?error=...&error_description=...
 * Component ini membersihkan query params setelah error ditampilkan.
 */
export function OAuthErrorBanner() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const desc = searchParams.get("error_description");
    if (desc) {
      setMessage(decodeURIComponent(desc));
      // Bersihkan error dari URL tanpa reload
      const params = new URLSearchParams(searchParams);
      params.delete("error");
      params.delete("error_code");
      params.delete("error_description");
      params.delete("sb");
      setSearchParams(params, { replace: true });
      return;
    }
    const err = searchParams.get("error");
    if (err) {
      setMessage(`Login error: ${decodeURIComponent(err)}`);
      const params = new URLSearchParams(searchParams);
      params.delete("error");
      params.delete("error_code");
      params.delete("error_description");
      params.delete("sb");
      setSearchParams(params, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-destructive/40 bg-destructive/15 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <OctagonX className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="flex-1 leading-snug">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-destructive">
            {t.auth.errorGoogle}
          </p>
          <p className="mt-0.5 text-[12.5px] text-foreground/80">{message}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMessage(null)}
          className="shrink-0 text-foreground/60 hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
