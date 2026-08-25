import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgenda } from "@/hooks/use-agenda";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { type AgendaRow } from "@/lib/db";
import { hariNama, pecahTanggal } from "@/lib/tanggal";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminAgenda() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.agenda} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } =
    useAgenda();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AgendaRow | null>(null);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setDate(new Date().toISOString().slice(0, 10));
    setTitle("");
    setDescription("");
    setCategory("Kegiatan");
    setDialogOpen(true);
  };

  const openEditModal = (item: AgendaRow) => {
    setEditingItem(item);
    setDate(item.date);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error(t.admin.toastAgendaRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, {
          date,
          title,
          description: description || null,
          category,
        });
        toast.success(t.admin.toastAgendaUpdated);
      } else {
        await create({
          date,
          title,
          description: description || null,
          category,
        });
        toast.success(t.admin.toastAgendaCreated);
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.admin.toastAgendaSaveError,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(t.admin.toastAgendaDeleted);
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error(t.admin.toastAgendaDeleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="02"
          label={t.admin.manageModules}
          title={t.admin.agenda}
          description={t.admin.agendaDesc}
        />
        <Button
          onClick={openCreateModal}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus className="size-4" /> {t.common.add}
        </Button>
      </div>

      <div className="mt-8">
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={data.length === 0}
          emptyMessage={t.admin.agendaEmpty}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.agendaTableDate}</th>
                <th className="p-3">{t.admin.agendaTableCategory}</th>
                <th className="p-3">{t.admin.agendaTableDesc}</th>
                <th className="p-3 pr-4 text-right">
                  {t.admin.agendaTableAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((item) => {
                const td = pecahTanggal(item.date);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-card/60 transition-colors"
                  >
                    <td className="p-3 pl-4 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {td.hari} {td.bulanSingkat} {td.tahun}
                      </span>{" "}
                      ({hariNama(item.date)})
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="kicker text-[9px] text-accent">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-display font-medium text-foreground">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="line-clamp-1 text-[12.5px] text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditModal(item)}
                          className="size-7 cursor-pointer hover:bg-background/80"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(item)}
                          className="size-7 cursor-pointer text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DataTable>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-lg border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? t.admin.agendaFormTitle : t.admin.agendaFormCreateTitle}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="kicker block text-[10px]">Tanggal</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 bg-background/50 text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="kicker block text-[10px]">Kategori</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t.admin.agendaPlaceholderCategory}
                  className="mt-1 bg-background/50 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">Judul Agenda</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.admin.agendaPlaceholderTitle}
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Keterangan Tambahan ({t.common.optional})
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.admin.agendaPlaceholderDesc}
                className="mt-1 h-24 bg-background/50 text-[13.5px]"
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
                {isSubmitting && (
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                )}
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
