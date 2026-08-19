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
import { useAnnouncements } from "@/hooks/use-announcements";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { type AnnouncementRow } from "@/lib/db";
import { pecahTanggal } from "@/lib/tanggal";
import { Edit2, EyeOff, Globe, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminAnnouncements() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.announcements} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } =
    useAnnouncements(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementRow | null>(
    null,
  );

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Umum");
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setSummary("");
    setBody("");
    setCategory("Umum");
    setPublished(true);
    setDialogOpen(true);
  };

  const openEditModal = (item: AnnouncementRow) => {
    setEditingItem(item);
    setTitle(item.title);
    setSummary(item.summary);
    setBody(item.body || "");
    setCategory(item.category);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      toast.error("Judul dan ringkasan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, {
          title,
          summary,
          body: body || null,
          category,
          published,
        });
        toast.success("Pengumuman berhasil diperbarui.");
      } else {
        await create({
          title,
          summary,
          body: body || null,
          category,
          published,
        });
        toast.success("Pengumuman baru berhasil diterbitkan.");
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan pengumuman",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: AnnouncementRow) => {
    try {
      await update(item.id, { published: !item.published });
      toast.success(
        item.published
          ? "Pengumuman ditarik dari publik."
          : "Pengumuman berhasil dipublikasikan.",
      );
      await refresh();
    } catch {
      toast.error("Gagal mengubah status publikasi");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Pengumuman telah dihapus.");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Gagal menghapus pengumuman");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="01"
          label={t.admin.manageModules}
          title={t.admin.announcements}
          description={t.admin.announcementsDesc}
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
          emptyMessage={t.admin.announcementsEmpty}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.announcementsTableSearch}</th>
                <th className="p-3">{t.admin.announcementsTableCategory}</th>
                <th className="p-3">{t.admin.announcementsTableTitle}</th>
                <th className="p-3">{t.admin.announcementsTableStatus}</th>
                <th className="p-3 pr-4 text-right">
                  {t.admin.announcementsTableAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((p) => {
                const dateIso = p.published_at || p.created_at;
                const td = pecahTanggal(dateIso.slice(0, 10));
                return (
                  <tr key={p.id} className="hover:bg-card/60 transition-colors">
                    <td className="p-3 pl-4 font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      {td.hari} {td.bulanSingkat} {td.tahun}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="kicker text-[9px] text-accent">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <p className="font-display font-medium text-foreground">
                        {p.title}
                      </p>
                      <p className="line-clamp-1 text-[12.5px] text-muted-foreground">
                        {p.summary}
                      </p>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                          p.published
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {p.published ? (
                          <>
                            <Globe className="size-3" /> Terbit
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3" /> Draf
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3 pr-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditModal(p)}
                          className="size-7 cursor-pointer hover:bg-background/80"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(p)}
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
              {editingItem ? "Ubah Pengumuman" : "Buat Pengumuman Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="kicker block text-[10px]">Kategori</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="misal: Akademik, Kelas, Kegiatan"
                className="mt-1 bg-background/50 text-sm"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Judul Pengumuman
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul ringkas dan jelas"
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Ringkasan Singkat
              </label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="1-2 kalimat pengantar yang tampil di halaman depan..."
                className="mt-1 h-20 bg-background/50 text-[13.5px]"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Isi Lengkap ({t.common.optional})
              </label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Rincian lengkap pengumuman jika diperlukan..."
                className="mt-1 h-28 bg-background/50 text-[13.5px]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="size-4 rounded border-border"
              />
              <label
                htmlFor="published"
                className="text-[13px] cursor-pointer text-foreground"
              >
                Terbitkan sekarang (bisa dilihat oleh publik)
              </label>
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
