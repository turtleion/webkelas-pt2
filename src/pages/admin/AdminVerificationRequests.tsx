import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import {
  listVerificationRequests,
  reviewVerificationRequest,
} from "@/lib/db";
import { inisialNama, pecahTanggal } from "@/lib/tanggal";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type RequestWithUser = Awaited<
  ReturnType<typeof listVerificationRequests>
>[number];

function statusBadge(
  status: "pending" | "accepted" | "declined",
  label: string,
) {
  const cls =
    status === "pending"
      ? "bg-accent/20 text-accent border-accent/30"
      : status === "accepted"
        ? "bg-primary/20 text-primary border-primary/30"
        : "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default function AdminVerificationRequests() {
  const { t } = useTranslation();
  usePageTitle(`${t.adminVerificationRequests.title} — Panel`);

  const [requests, setRequests] = useState<RequestWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    request: RequestWithUser;
    accept: boolean;
  } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await listVerificationRequests();
      setRequests(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.adminVerificationRequests.error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const handleConfirm = async () => {
    if (!target) return;
    setIsReviewing(true);
    try {
      await reviewVerificationRequest(target.request.id, target.accept);
      const name =
        target.request.user_name ||
        target.request.user_email ||
        target.request.user_id.slice(0, 8);
      toast.success(
        target.accept
          ? t.adminVerificationRequests.acceptedToast.replace("{name}", name)
          : t.adminVerificationRequests.declinedToast.replace("{name}", name),
      );
      setTarget(null);
      await fetchRequests();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.adminVerificationRequests.error,
      );
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="VER"
          label={t.adminVerificationRequests.title}
          title={t.adminVerificationRequests.title}
          description={t.adminVerificationRequests.description}
          meta={
            pendingCount > 0
              ? t.adminVerificationRequests.pendingCount.replace(
                  "{count}",
                  String(pendingCount),
                )
              : undefined
          }
        />
      </div>

      <div className="mt-8">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={requests.length === 0}
          emptyMessage={t.adminVerificationRequests.empty}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">
                  {t.adminVerificationRequests.userColumn}
                </th>
                <th className="p-3">
                  {t.adminVerificationRequests.emailColumn}
                </th>
                <th className="p-3">
                  {t.adminVerificationRequests.requestDate}
                </th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {requests.map((r) => {
                const td = pecahTanggal(r.created_at.slice(0, 10));
                const name = r.user_name || "—";
                return (
                  <tr key={r.id} className="hover:bg-card/60 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-display text-xs italic">
                          {inisialNama(r.user_name || r.user_email || "?")}
                        </span>
                        <div>
                          <p className="font-display font-medium text-foreground">
                            {name}
                          </p>
                          <p
                            className={
                              r.accepted_agreements
                                ? "font-mono text-[9px] uppercase tracking-wider text-primary"
                                : "font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
                            }
                          >
                            {r.accepted_agreements
                              ? t.adminVerificationRequests.agreementsAccepted
                              : t.adminVerificationRequests.notAccepted}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[12px] text-muted-foreground">
                      {r.user_email || "—"}
                    </td>
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {td.hari} {td.bulanSingkat} {td.tahun}
                    </td>
                    <td className="p-3">
                      {statusBadge(r.status, t.adminVerificationRequests[
                        r.status === "pending"
                          ? "statusPending"
                          : r.status === "accepted"
                            ? "statusAccepted"
                            : "statusDeclined"
                      ])}
                    </td>
                    <td className="p-3 pr-4 whitespace-nowrap text-right">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() =>
                              setTarget({ request: r, accept: true })
                            }
                            className="h-7 cursor-pointer gap-1 bg-primary px-2.5 font-mono text-[10px] uppercase tracking-wider text-primary-foreground"
                          >
                            <Check className="size-3" />
                            {t.adminVerificationRequests.acceptBtn}
                          </Button>
                          <Button
                            onClick={() =>
                              setTarget({ request: r, accept: false })
                            }
                            variant="outline"
                            className="h-7 cursor-pointer gap-1 border-destructive/40 px-2.5 font-mono text-[10px] uppercase tracking-wider text-destructive hover:bg-destructive/10"
                          >
                            <X className="size-3" />
                            {t.adminVerificationRequests.declineBtn}
                          </Button>
                        </div>
                      ) : (
                        <ShieldCheck className="ml-auto size-4 text-muted-foreground/50" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DataTable>
      </div>

      {/* Accept/Decline confirmation */}
      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        title={
          target?.accept
            ? t.adminVerificationRequests.acceptConfirmTitle
            : t.adminVerificationRequests.declineConfirmTitle
        }
        description={(
          target?.accept
            ? t.adminVerificationRequests.acceptConfirmDesc
            : t.adminVerificationRequests.declineConfirmDesc
        ).replace(
          "{name}",
          target?.request.user_name || target?.request.user_email || "?",
        )}
        confirmLabel={
          target?.accept
            ? t.adminVerificationRequests.acceptBtn
            : t.adminVerificationRequests.declineBtn
        }
        destructive={!target?.accept}
        isLoading={isReviewing}
        onConfirm={handleConfirm}
      />

      {isReviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}
    </AdminLayout>
  );
}