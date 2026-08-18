import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth } from "@/hooks/use-auth";
import { getAllProfiles, updateProfileRole, type ProfileRow } from "@/lib/db";
import { inisialNama, pecahTanggal } from "@/lib/tanggal";
import { ShieldCheck, ShieldAlert, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  usePageTitle("Manajemen User & Hak Akses — Owner");
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
        err instanceof Error ? err.message : "Gagal memuat daftar pengguna"
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
        `Peran ${roleChangeTarget.profile.name || roleChangeTarget.profile.email} diubah menjadi ${roleChangeTarget.newRole}.`
      );
      setRoleChangeTarget(null);
      await fetchProfiles();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memperbarui peran pengguna"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        nomor="OWN"
        label="Khusus Owner"
        title="Manajemen Pengguna & Peran"
        description="Kelola akun Google yang telah mendaftar ke arsip kelas. Tingkatkan hak akses siswa menjadi Admin atau Owner untuk memberi izin pengelolaan."
      />

      <div className="mt-8">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={profiles.length === 0}
          emptyMessage="Belum ada pengguna yang masuk melalui Google OAuth."
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">Pengguna</th>
                <th className="p-3">Email</th>
                <th className="p-3">Terdaftar</th>
                <th className="p-3">Peran Saat Ini</th>
                <th className="p-3 pr-4 text-right">Ubah Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {profiles.map((p) => {
                const isSelf = currentUser?.id === p.id;
                const t = pecahTanggal(p.created_at.slice(0, 10));

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
                            {inisialNama(p.name || p.email || "User")}
                          </span>
                        )}
                        <div>
                          <p className="font-display font-medium text-foreground">
                            {p.name || "Tanpa Nama"}
                            {isSelf && (
                              <span className="ml-2 font-mono text-[9px] text-accent">
                                (Anda)
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
                      {t.hari} {t.bulanSingkat} {t.tahun}
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
                          Terkunci (Akun Anda)
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
                            <option value="member">member (Anggota)</option>
                            <option value="admin">admin (Pengurus)</option>
                            <option value="owner">owner (Pemilik)</option>
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
        title="Konfirmasi Perubahan Hak Akses"
        description={`Apakah Anda yakin ingin mengubah peran "${
          roleChangeTarget?.profile.name || roleChangeTarget?.profile.email
        }" menjadi "${roleChangeTarget?.newRole.toUpperCase()}"?`}
        confirmLabel="Ubah Peran"
        destructive={false}
        isLoading={isUpdating}
        onConfirm={handleConfirmRoleChange}
      />
    </AdminLayout>
  );
}
