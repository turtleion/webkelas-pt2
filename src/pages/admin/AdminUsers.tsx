import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { getAllProfiles, updateProfileRole, type ProfileRow } from "@/lib/db";
import { inisialNama, pecahTanggal } from "@/lib/tanggal";
import { ShieldCheck, ShieldAlert, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.usersManagement} — Panel`);
  const { user: currentUser } = useAuth();

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    profile: ProfileRow;
    newRole: "admin" | "member" | "owner";
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getAllProfiles();
      setProfiles(rows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.admin.toastUsersLoadError
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfiles();
  }, [fetchProfiles]);

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    setIsUpdating(true);
    try {
      await updateProfileRole(roleChangeTarget.profile.id, roleChangeTarget.newRole);
      toast.success(
        t.admin.usersRoleToastSuccess
          .replace("{name}", roleChangeTarget.profile.name || roleChangeTarget.profile.email || "")
          .replace("{role}", roleChangeTarget.newRole)
      );
      setRoleChangeTarget(null);
      await fetchProfiles();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.admin.toastUsersRoleUpdateError
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        nomor="OWN"
        label={t.admin.usersManagement}
        title={t.admin.usersTitle}
        description={t.admin.usersDescription}
      />

      <div className="mt-8">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={profiles.length === 0}
          emptyMessage={t.admin.usersEmpty}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.usersColUser}</th>
                <th className="p-3">{t.admin.usersColEmail}</th>
                <th className="p-3">{t.admin.usersColRegistered}</th>
                <th className="p-3">{t.admin.usersColCurrentRole}</th>
                <th className="p-3 pr-4 text-right">{t.admin.usersColChangeRole}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {profiles.map((p) => {
                const isSelf = currentUser?.id === p.id;
                const td = pecahTanggal(p.created_at.slice(0, 10));

                return (
                  <tr key={p.id} className="hover:bg-card/60 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=""
                            className="size-8 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card font-display text-xs italic">
                            {inisialNama(p.name || p.email || t.admin.usersNameFallback)}
                          </span>
                        )}
                        <div>
                          <p className="font-display font-medium text-foreground">
                            {p.name || t.admin.usersNoName}
                            {isSelf && (
                              <span className="ml-2 font-mono text-[9px] text-accent">
                                ({t.admin.usersSelfTag})
                              </span>
                            )}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            ID: {p.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[12px] text-muted-foreground">
                      {p.email || "—"}
                    </td>

                    <td className="p-3 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {td.hari} {td.bulanSingkat} {td.tahun}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${
                          p.role === "owner"
                            ? "bg-accent/20 text-accent border border-accent/30"
                            : p.role === "admin"
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.role === "owner" ? (
                          <ShieldAlert className="size-3" />
                        ) : p.role === "admin" ? (
                          <ShieldCheck className="size-3" />
                        ) : (
                          <UserIcon className="size-3" />
                        )}
                        {p.role}
                      </span>
                    </td>

                    <td className="p-3 pr-4 text-right whitespace-nowrap">
                      {isSelf ? (
                        <span className="font-mono text-[10px] text-muted-foreground italic">
                          {t.admin.usersSelfLocked}
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={p.role}
                            onChange={(e) =>
                              setRoleChangeTarget({
                                profile: p,
                                newRole: e.target.value as "admin" | "member" | "owner",
                              })
                            }
                            className="cursor-pointer rounded border border-border bg-background/50 px-2 py-1 font-mono text-xs text-foreground outline-none"
                          >
                            <option value="member">{t.admin.usersRoleMember}</option>
                            <option value="admin">{t.admin.usersRoleAdmin}</option>
                            <option value="owner">{t.admin.usersRoleOwner}</option>
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DataTable>
      </div>

      {/* Role Change Confirmation */}
      <ConfirmDialog
        open={Boolean(roleChangeTarget)}
        onOpenChange={(open) => !open && setRoleChangeTarget(null)}
        title={t.admin.usersRoleConfirmTitle}
        description={
          t.admin.usersRoleConfirmDesc
            .replace("{name}", roleChangeTarget?.profile.name || roleChangeTarget?.profile.email || "")
            .replace("{role}", roleChangeTarget?.newRole?.toUpperCase() || "")
        }
        confirmLabel={t.admin.usersRoleConfirmLabel}
        destructive={false}
        isLoading={isUpdating}
        onConfirm={handleConfirmRoleChange}
      />
    </AdminLayout>
  );
}
