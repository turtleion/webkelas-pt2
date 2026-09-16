import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import {
  acceptAgreement,
  submitVerificationRequest,
} from "@/lib/db";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

/**
 * Modal onboarding untuk user baru (authenticated tapi belum verified).
 *
 * Muncul sekali saat user pertama login Google dan belum punya profil
 * terverifikasi: minta persetujuan Kebijakan Privasi + Ketentuan Layanan,
 * lalu kirim permintaan verifikasi ke admin.
 *
 * - Tidak muncul untuk: guest, verified, anonymous, user yang sudah
 *   menyetujui semua persyaratan + sudah pernah Notify Admin (pending).
 * - Idempotent: submit_verification_request() RPC tidak membuat duplikat.
 * - Submit hanya boleh saat kedua checkbox tercentang (guard UI + server).
 */
export function WelcomeModal() {
  const { t } = useTranslation();
  const { user, isAuthenticated, isVerified, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notified, setNotified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kondisi tampil: authenticated, non-guest, belum verified,
  // dan belum menyelesaikan onboarding (belum kirim permintaan).
  // Tampilkan selama ADA persetujuan yang belum diterima.
  // Sembunyikan di halaman agreements agar user bisa baca tanpa gangguan.
  const needsAgreement = !user?.acceptedTosAt || !user?.acceptedPrivacyAt;
  const isOnAgreements = location.pathname.startsWith("/agreements");
  const isOnRegister = location.pathname === "/register";
  const show =
    !isLoading &&
    isAuthenticated &&
    !user?.guest &&
    !isVerified &&
    needsAgreement &&
    !notified &&
    !isOnAgreements &&
    !isOnRegister;

  const handleSubmit = async () => {
    if (!agreePrivacy || !agreeTos) {
      setError(t.welcome.bothRequired);
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      // Simpan persetujuan dulu (kolom sendiri, column grant).
      if (!user.acceptedTosAt) {
        await acceptAgreement(user.id, "tos");
      }
      if (!user.acceptedPrivacyAt) {
        await acceptAgreement(user.id, "privacy");
      }
      // Kirim permintaan verifikasi (server idempotent).
      await submitVerificationRequest();
      setNotified(true);
      toast.success(t.welcome.notified);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : t.welcome.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <Dialog open onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        className="glass glass-strong max-w-md border-border/80 text-foreground"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
            <Sparkles className="size-6 text-accent" />
            {t.welcome.title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {t.welcome.description}
          </DialogDescription>
        </DialogHeader>

        {notified ? (
          // Success / pending state — user sudah kirim request, tinggal tunggu admin.
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <ShieldCheck className="size-12 text-accent" />
            <p className="font-display text-lg font-medium tracking-tight">
              {t.welcome.notified}
            </p>
            <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {t.welcome.pending}
            </p>
          </div>
        ) : (
          <>
            {/* Agreement checkboxes */}
            <div className="mt-2 flex flex-col gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded border border-border/70 bg-background/40 px-3.5 py-3 transition-colors hover:bg-background/60">
                <Checkbox
                  checked={agreeTos}
                  onCheckedChange={(v) => setAgreeTos(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[13px] leading-snug text-foreground">
                  {t.welcome.agreeTos}{" "}
                  <a
                    href="/agreements/tos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                  >
                    Ketentuan Layanan
                  </a>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded border border-border/70 bg-background/40 px-3.5 py-3 transition-colors hover:bg-background/60">
                <Checkbox
                  checked={agreePrivacy}
                  onCheckedChange={(v) => setAgreePrivacy(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[13px] leading-snug text-foreground">
                  {t.welcome.agreePrivacy}{" "}
                  <a
                    href="/agreements/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                  >
                    Kebijakan Privasi
                  </a>
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-center text-[12.5px] text-destructive">
                {error}
              </p>
            )}

            {/* Verification explanation */}
            <div className="rounded border border-accent/30 bg-accent/10 px-3.5 py-3">
              <p className="text-[12.5px] leading-relaxed text-foreground/80">
                {t.welcome.verificationHint}
              </p>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/register")}
                disabled={isSubmitting || !agreeTos || !agreePrivacy}
                className="h-11 cursor-pointer border-border/80 bg-background/40 font-mono text-[11px] uppercase tracking-[0.12em]"
              >
                {t.welcome.enterCode}
              </Button>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || !agreeTos || !agreePrivacy}
                className="h-11 cursor-pointer bg-primary font-mono text-[11px] uppercase tracking-[0.12em] text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t.welcome.loading}
                  </>
                ) : (
                  t.welcome.notifyAdmin
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}