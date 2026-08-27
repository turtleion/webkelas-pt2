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
import { useDutySchedule } from "@/hooks/use-duty";
import { type DutyScheduleRow } from "@/lib/db";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export default function AdminDuty() {
  const { t } = useTranslation();
  usePageTitle(`${t.duty.heading} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } = useDutySchedule();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DutyScheduleRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DutyScheduleRow | null>(null);

  const [day, setDay] = useState<string>("Senin");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [area, setArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null); setDay("Senin"); setDate(new Date().toISOString().slice(0, 10));
    setGroupName(""); setMembers(""); setArea(""); setDialogOpen(true);
  };

  const openEditModal = (item: DutyScheduleRow) => {
    setEditingItem(item); setDay(item.day); setDate(item.date);
    setGroupName(item.group_name); setMembers(item.members.join(", ")); setArea(item.area);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !date) { toast.error("Kelompok dan tanggal wajib diisi."); return; }
    setIsSubmitting(true);
    const membersList = members.split(",").map((m) => m.trim()).filter(Boolean);
    try {
      if (editingItem) {
        await update(editingItem.id, { day, date, group_name: groupName, members: membersList, area });
        toast.success("Jadwal piket berhasil diperbarui.");
      } else {
        await create({ day, date, group_name: groupName, members: membersList, area });
        toast.success("Jadwal piket baru berhasil ditambahkan.");
      }
      setDialogOpen(false); await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan jadwal piket");
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await remove(deleteTarget.id); toast.success("Jadwal piket berhasil dihapus."); setDeleteTarget(null); await refresh(); }
    catch { toast.error("Gagal menghapus jadwal piket"); }
    finally { setIsDeleting(false); }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader nomor="PKT" label={t.duty.heading} title={t.duty.heading} description={t.duty.description} />
        <Button onClick={openCreateModal} className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider">
          <Plus className="size-4" /> {t.common.add}
        </Button>
      </div>
      <div className="mt-8">
        <DataTable isLoading={isLoading} error={error} isEmpty={data.length === 0} emptyMessage="Belum ada jadwal piket.">
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">Hari</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kelompok</th>
                <th className="p-3">Anggota</th>
                <th className="p-3">Area</th>
                <th className="p-3 pr-4 text-right">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-card/60 transition-colors">
                  <td className="p-3 pl-4 font-mono text-[11px]">{item.day}</td>
                  <td className="p-3 font-mono text-[11px]">{item.date}</td>
                  <td className="p-3 font-display font-medium">{item.group_name}</td>
                  <td className="p-3 text-[12px]">{item.members.join(", ")}</td>
                  <td className="p-3 text-[12px] text-muted-foreground">{item.area || "—"}</td>
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
          <DialogHeader><DialogTitle className="font-display text-2xl font-medium tracking-tight">{editingItem ? "Ubah Jadwal Piket" : "Tambah Jadwal Piket"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="kicker block text-[10px]">Hari</label>
                <select value={day} onChange={(e) => setDay(e.target.value)} className="mt-1 w-full rounded border border-border bg-background/50 p-2 font-mono text-sm">{DAYS.map((d) => <option key={d} value={d}>{d}</option>)}</select>
              </div>
              <div><label className="kicker block text-[10px]">Tanggal</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 bg-background/50 text-sm font-mono" required />
              </div>
            </div>
            <div><label className="kicker block text-[10px]">Kelompok</label>
              <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="mt-1 bg-background/50 font-display text-base" required placeholder="misal: Kelompok 1" />
            </div>
            <div><label className="kicker block text-[10px]">Anggota (pisahkan koma)</label>
              <Input value={members} onChange={(e) => setMembers(e.target.value)} className="mt-1 bg-background/50 text-sm" placeholder="Budi, Ani, Cahya" />
            </div>
            <div><label className="kicker block text-[10px]">Area</label>
              <Input value={area} onChange={(e) => setArea(e.target.value)} className="mt-1 bg-background/50 text-sm" placeholder="misal: Kelas, Lab, Halaman" />
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
