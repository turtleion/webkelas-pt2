import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { useArticles } from "@/hooks/use-articles";
import { type ArticleRow } from "@/lib/db";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminArticles() {
  const { t } = useTranslation();
  usePageTitle(`${t.articles.heading} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } = useArticles();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArticleRow | null>(null);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setSlug(""); setTitle(""); setDescription(""); setContent("");
    setCoverUrl(""); setIsPinned(false);
    setDialogOpen(true);
  };

  const openEditModal = (item: ArticleRow) => {
    setEditingItem(item);
    setSlug(item.slug); setTitle(item.title); setDescription(item.description);
    setContent(item.content); setCoverUrl(item.cover_url); setIsPinned(item.is_pinned);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Judul, slug, dan konten wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, { slug, title, description, content, cover_url: coverUrl, is_pinned: isPinned });
        toast.success("Artikel berhasil diperbarui.");
      } else {
        await create({ slug, title, description, content, cover_url: coverUrl, is_pinned: isPinned, published: true });
        toast.success("Artikel baru berhasil diterbitkan.");
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Artikel berhasil dihapus.");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Gagal menghapus artikel");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader nomor="ART" label={t.nav.articles} title={t.articles.heading} description={t.articles.description} />
        <Button onClick={openCreateModal} className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider">
          <Plus className="size-4" /> {t.common.add}
        </Button>
      </div>

      <div className="mt-8">
        <DataTable isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyMessage="Belum ada artikel.">
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">Judul</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-card/60 transition-colors">
                  <td className="p-3 pl-4 font-display font-medium">{item.title}</td>
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">/{item.slug}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${item.published ? "bg-accent/20 text-accent border-accent/30" : "bg-muted text-muted-foreground"}`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(item)} className="size-7 cursor-pointer hover:bg-background/80">
                        <Edit2 className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(item)} className="size-7 cursor-pointer text-destructive hover:bg-destructive/10">
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-lg border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? "Ubah Artikel" : "Tambah Artikel Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="kicker block text-[10px]">Judul</label>
              <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!editingItem) setSlug(slugify(e.target.value)); }} className="mt-1 bg-background/50 font-display text-base" required />
            </div>
            <div>
              <label className="kicker block text-[10px]">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 bg-background/50 font-mono text-sm" required />
            </div>
            <div>
              <label className="kicker block text-[10px]">Deskripsi</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 h-16 bg-background/50 text-sm" />
            </div>
            <div>
              <label className="kicker block text-[10px]">Konten</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 h-32 bg-background/50 text-sm" required />
            </div>
            <div>
              <label className="kicker block text-[10px]">Cover URL (opsional)</label>
              <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="mt-1 bg-background/50 text-sm" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPinned" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="size-4 rounded border-border" />
              <label htmlFor="isPinned" className="text-[13px] cursor-pointer">Sematkan artikel ini</label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="font-mono text-[11px] uppercase tracking-wider">{t.common.cancel}</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider">
                {isSubmitting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                {t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title={t.admin.deleteConfirmTitle} description={t.admin.deleteConfirmDesc} isLoading={isDeleting} onConfirm={handleDelete} />
    </AdminLayout>
  );
}
