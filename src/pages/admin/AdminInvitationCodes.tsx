import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import {
  createInvitationCode,
  listInvitationCodes,
  type InvitationCodeRow,
} from "@/lib/db";
import {
  codePrefix,
  generateInvitationCode,
  hashCode,
} from "@/lib/invitation-codes";
import { pecahTanggal } from "@/lib/tanggal";
import { Loader2, Plus, Ticket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Status = "active" | "used" | "expired";

function deriveStatus(row: InvitationCodeRow): Status {
  if (row.used_at) return "used";
  if (new Date(row.server_now).getTime() >= new Date(row.expires_at).getTime())
    return "expired";
  return "active";
}

export default function AdminInvitationCodes() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.invitations} — Panel`);

  const [codes, setCodes] = useState<InvitationCodeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await listInvitationCodes();
      setCodes(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat kode");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCodes();
  }, [fetchCodes]);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const plaintext = generateInvitationCode();
      const hash = await hashCode(plaintext);
      const prefix = codePrefix(plaintext);
      await createInvitationCode(hash, prefix);
      toast.success(t.admin.invitationsCreatedToast);
      setCreatedCode(plaintext);
      await fetchCodes();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : t.admin.invitationsCreatedToastFail,
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t.admin.invitationsCopied);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  const statusBadge = (status: Status) => {
    const label =
      status === "active"
        ? t.admin.invitationsStatusActive
        : status === "used"
          ? t.admin.invitationsStatusUsed
          : t.admin.invitationsStatusExpired;
    const cls =
      status === "active"
        ? "bg-accent/20 text-accent border-accent/30"
        : status === "used"
          ? "bg-primary/20 text-primary border-primary/30"
          : "bg-muted text-muted-foreground border-border";
    return (
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${cls}`}
      >
        {label}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="INV"
          label={t.admin.usersManagement}
          title={t.admin.invitations}
          description={t.admin.invitationsDesc}
        />
        <Button
          onClick={() => void handleCreate()}
          disabled={isCreating}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
          {isCreating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {t.admin.invitationsCreateBtn}
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={codes.length === 0}
          emptyMessage={t.admin.invitationsEmpty}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.invitationsCode}</th>
                <th className="p-3">{t.admin.invitationsCreated}</th>
                <th className="p-3">{t.admin.invitationsExpires}</th>
                <th className="p-3">{t.admin.invitationsStatus}</th>
                <th className="p-3">{t.admin.invitationsUsedBy}</th>
                <th className="p-3 pr-4">{t.admin.invitationsUsedAt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {codes.map((row) => {
                const status = deriveStatus(row);
                const createdTd = pecahTanggal(row.created_at.slice(0, 10));
                const expiresTd = pecahTanggal(row.expires_at.slice(0, 10));
                const usedTd = row.used_at
                  ? pecahTanggal(row.used_at.slice(0, 10))
                  : null;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-card/60 transition-colors"
                  >
                    <td className="p-3 pl-4 font-mono text-[12px] text-foreground">
                      <span className="rounded bg-muted/40 px-1.5 py-0.5">
                        {row.code_prefix}…
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {createdTd.hari} {createdTd.bulanSingkat} {createdTd.tahun}
                    </td>
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {expiresTd.hari} {expiresTd.bulanSingkat}{" "}
                      {expiresTd.tahun}
                    </td>
                    <td className="p-3">{statusBadge(status)}</td>
                    <td className="p-3 text-[12px] text-muted-foreground">
                      {row.used_by_name || row.used_by_email || "—"}
                    </td>
                    <td className="p-3 pr-4 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {usedTd
                        ? `${usedTd.hari} ${usedTd.bulanSingkat} ${usedTd.tahun}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DataTable>
      </div>

      <Dialog
        open={Boolean(createdCode)}
        onOpenChange={(open) => !open && setCreatedCode(null)}
      >
        <DialogContent className="glass glass-strong max-w-md border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-2xl font-medium tracking-tight">
              <Ticket className="size-6 text-accent" />
              {t.admin.invitationsStatusActive}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {t.admin.invitationsOnceNote}
          </p>
          <div className="mt-4 rounded-lg border border-border/80 bg-background/50 p-4 text-center">
            <code className="font-mono text-xl font-semibold tracking-[0.15em] text-foreground">
              {createdCode}
            </code>
          </div>
          <Button
            type="button"
            onClick={() => createdCode && void handleCopy(createdCode)}
            className="mt-4 w-full cursor-pointer gap-2 bg-primary font-mono text-[11px] uppercase tracking-wider text-primary-foreground"
          >
            {t.admin.invitationsCopyBtn}
          </Button>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
