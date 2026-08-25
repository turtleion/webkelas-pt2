import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { usePageTitle } from "@/hooks/use-page-title";
import { useMembers } from "@/hooks/use-members";
import { useTranslation } from "@/hooks/use-translation";
import { type MemberRow } from "@/lib/db";
import { padNomor, inisialNama } from "@/lib/tanggal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminMembers() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.members} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } = useMembers();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemberRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);

  const [absenNo, setAbsenNo] = useState<number>(1);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = data.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      String(m.absen_no).includes(search) ||
      (m.position && m.position.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreateModal = () => {
    setEditingItem(null);
    const nextNo =
      data.length > 0 ? Math.max(...data.map((m) => m.absen_no)) + 1 : 1;
    setAbsenNo(nextNo);
    setName("");
    setPosition("");
    setDialogOpen(true);
  };

  const openEditModal = (item: MemberRow) => {
    setEditingItem(item);
    setAbsenNo(item.absen_no);
    setName(item.name);
    setPosition(item.position || "");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !absenNo) {
      toast.error(t.admin.toastMemberRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, {
          absen_no: absenNo,
          name,
          position: position || null,
        });
        toast.success(t.admin.toastMemberUpdated);
      } else {
        await create({
          absen_no: absenNo,
          name,
          position: position || null,
        });
        toast.success(t.admin.toastMemberCreated);
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.admin.toastMemberSaveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(t.admin.toastMemberDeleted);
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error(t.admin.toastMemberDeleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="04"
          label={t.admin.manageModules}
          title={t.admin.members}
          description={t.admin.membersDesc}
        />
        <Button
          onClick={openCreateModal}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus className="size-4" /> {t.admin.addStudent}
        </Button>
      </div>

      {/* Search Input */}
      <div className="mt-8 flex items-center gap-2 max-w-md border-b border-border/80 pb-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t.common.search}...`}
          className="w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="mt-6">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={filteredData.length === 0}
          emptyMessage={
            search
              ? `Tidak ditemukan anggota dengan kata kunci "${search}".`
              : t.admin.membersEmpty
          }
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.absenNo}</th>
                <th className="p-3">Inisial</th>
                <th className="p-3">{t.admin.studentName}</th>
                <th className="p-3">{t.admin.positionLabel}</th>
                <th className="p-3 pr-4 text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredData.map((m) => (
                <tr key={m.id} className="hover:bg-card/60 transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px] font-semibold text-muted-foreground">
                    #{padNomor(m.absen_no)}
                  </td>
                  <td className="p-3">
                    <span className="flex size-8 items-center justify-center rounded border border-border bg-card font-display text-xs italic">
                      {inisialNama(m.name)}
                    </span>
                  </td>
                  <td className="p-3 font-display font-medium text-foreground">
                    {m.name}
                  </td>
                  <td className="p-3">
                    {m.position ? (
                      <span className="kicker rounded bg-accent/15 px-2 py-0.5 text-[9px] text-accent font-semibold">
                        {m.position}
                      </span>
                    ) : (
                      <span className="text-[12px] text-muted-foreground/60">—</span>
                    )}
                  </td>
                  <td className="p-3 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditModal(m)}
                        className="size-7 cursor-pointer hover:bg-background/80"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(m)}
                        className="size-7 cursor-pointer text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-md border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? t.admin.editStudent : t.admin.addStudent}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="kicker block text-[10px]">{t.admin.absenNo}</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={absenNo}
                  onChange={(e) => setAbsenNo(Number(e.target.value))}
                  className="mt-1 bg-background/50 font-mono text-sm"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="kicker block text-[10px]">
                  {t.admin.positionLabel}
                </label>
                <Input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder={t.admin.membersPlaceholderPosition}
                  className="mt-1 bg-background/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">{t.admin.studentName}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.admin.membersPlaceholderName}
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="font-mono text-[11px] uppercase tracking-wider"
              >
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                {t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t.admin.deleteConfirmTitle}
        description={t.admin.deleteConfirmDesc}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
