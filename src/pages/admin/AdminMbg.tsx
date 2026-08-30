import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { useMbgSchedule } from "@/hooks/use-mbg";
import { type MbgScheduleRow } from "@/lib/db";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export default function AdminMbg() {
  const { t } = useTranslation();
  usePageTitle(`${t.mbg.heading} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } = useMbgSchedule();

  const [selectedDay, setSelectedDay] = useState<string>("Senin");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MbgScheduleRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MbgScheduleRow | null>(null);

  const [day, setDay] = useState<string>("Senin");
  const [menu, setMenu] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = data.filter((item) => item.day === selectedDay);

  const openCreateModal = () => {
    setEditingItem(null); setDay(selectedDay);
    setMenu(""); setNotes(""); setDialogOpen(true);
  };

  const openEditModal = (item: MbgScheduleRow) => {
    setEditingItem(item); setDay(item.day);
    setMenu(item.menu); setNotes(item.notes || ""); setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu.trim()) { toast.error("Anggota wajib diisi."); return; }
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, { day, menu, notes: notes || null });
        toast.success("Jadwal MBG berhasil diperbarui.");
      } else {
        await create({ day, menu, notes: notes || null });
        toast.success("Jadwal MBG baru berhasil ditambahkan.");
      }
      setDialogOpen(false); await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan jadwal MBG");
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await remove(deleteTarget.id); toast.success("Jadwal MBG berhasil dihapus."); setDeleteTarget(null); await refresh(); }
    catch { toast.error("Gagal menghapus jadwal MBG"); }
    finally { setIsDeleting(false); }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader nomor="MBG" label={t.mbg.heading} title={t.mbg.heading} description={t.mbg.description} />
        <Button onClick={openCreateModal} className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider">
          <Plus className="size-4" /> {t.common.add}
        </Button>
      </div>
      {/* Tabs Filter Hari */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-border/80 pb-3">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setSelectedDay(d)}
            className={`cursor-pointer rounded px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              selectedDay === d
                ? "bg-primary font-medium text-primary-foreground shadow-xs"
                : "border border-border/70 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DataTable isLoading={isLoading} error={error} isEmpty={filteredData.length === 0} emptyMessage="Belum ada jadwal MBG.">
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">Hari</th>
                <th className="p-3">Anggota</th>
                <th className="p-3">Catatan</th>
                <th className="p-3 pr-4 text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-card/60 transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px]">{item.day}</td>
                  <td className="p-3 font-display font-medium">{item.menu}</td>
                  <td className="p-3 text-[12px] text-muted-foreground">{item.notes || "—"}</td>
                  <td className="p-3 pr-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(item)} className="size-7 cursor-pointer"><Edit2 className="size-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(item)} className="size-7 cursor-pointer text-destructive"><Trash2 className="size-3.5" /></Button>
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
          <DialogHeader><DialogTitle className="font-display text-2xl font-medium tracking-tight">{editingItem ? "Ubah Jadwal MBG" : "Tambah Jadwal MBG"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div><label className="kicker block text-[10px]">Hari</label>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="mt-1 w-full rounded border border-border bg-background/50 p-2 font-mono text-sm">{DAYS.map((d) => <option key={d} value={d}>{d}</option>)}</select>
            </div>
            <div><label className="kicker block text-[10px]">Anggota</label>
              <Input value={menu} onChange={(e) => setMenu(e.target.value)} className="mt-1 bg-background/50 font-display text-base" required />
            </div>
            <div><label className="kicker block text-[10px]">Catatan (opsional)</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 bg-background/50 text-sm" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="font-mono text-[11px] uppercase tracking-wider">{t.common.cancel}</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider">
                {isSubmitting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}{t.common.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title={t.admin.deleteConfirmTitle} description={t.admin.deleteConfirmDesc} isLoading={isDeleting} onConfirm={handleDelete} />
    </AdminLayout>
  );
}
