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
import { usePageTitle } from "@/hooks/use-page-title";
import { useSchedule } from "@/hooks/use-schedule";
import { useTranslation } from "@/hooks/use-translation";
import { type ScheduleRow } from "@/lib/db";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS: Array<ScheduleRow["day"]> = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];
const DAY_I18N_KEYS: Record<ScheduleRow["day"], string> = {
  Senin: "admin.scheduleDayMonday",
  Selasa: "admin.scheduleDayTuesday",
  Rabu: "admin.scheduleDayWednesday",
  Kamis: "admin.scheduleDayThursday",
  Jumat: "admin.scheduleDayFriday",
};

export default function AdminSchedule() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.schedule} — Panel`);
  const { data, isLoading, error, refresh, create, update, remove } =
    useSchedule();

  const [selectedDay, setSelectedDay] = useState<ScheduleRow["day"]>("Senin");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleRow | null>(null);

  const [day, setDay] = useState<ScheduleRow["day"]>("Senin");
  const [timeStart, setTimeStart] = useState("07:00");
  const [timeEnd, setTimeEnd] = useState("07:45");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [isBreak, setIsBreak] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = data.filter((s) => s.day === selectedDay);

  const openCreateModal = () => {
    setEditingItem(null);
    setDay(selectedDay);
    setTimeStart("07:00");
    setTimeEnd("07:45");
    setSubject("");
    setTeacher("");
    setIsBreak(false);
    setSortOrder(filteredData.length);
    setDialogOpen(true);
  };

  const openEditModal = (item: ScheduleRow) => {
    setEditingItem(item);
    setDay(item.day);
    setTimeStart(item.time_start);
    setTimeEnd(item.time_end || "");
    setSubject(item.subject);
    setTeacher(item.teacher || "");
    setIsBreak(item.is_break);
    setSortOrder(item.sort_order);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !timeStart.trim()) {
      toast.error("Mata pelajaran dan jam mulai wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await update(editingItem.id, {
          day,
          time_start: timeStart,
          time_end: timeEnd || null,
          subject,
          teacher: teacher || null,
          is_break: isBreak,
          sort_order: sortOrder,
        });
        toast.success("Jadwal pelajaran berhasil diperbarui.");
      } else {
        await create({
          day,
          time_start: timeStart,
          time_end: timeEnd || null,
          subject,
          teacher: teacher || null,
          is_break: isBreak,
          sort_order: sortOrder,
        });
        toast.success("Mata pelajaran baru berhasil ditambahkan.");
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan jadwal",
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
      toast.success("Jadwal pelajaran berhasil dihapus.");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Gagal menghapus jadwal");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="03"
          label={t.admin.manageModules}
          title={t.admin.schedule}
          description={t.admin.scheduleDesc}
        />
        <Button
          onClick={openCreateModal}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
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
        <DataTable
          isLoading={isLoading}
          error={error}
          isEmpty={filteredData.length === 0}
          emptyMessage={`Belum ada jadwal pelajaran untuk hari ${selectedDay}.`}
        >
          <table className="w-full text-left text-sm">
            <thead className="kicker border-b border-border/80 bg-background/50 text-[10px]">
              <tr>
                <th className="p-3 pl-4">{t.admin.scheduleTableOrder}</th>
                <th className="p-3">{t.admin.scheduleTableTime}</th>
                <th className="p-3">{t.admin.scheduleTableSubject}</th>
                <th className="p-3">{t.admin.scheduleTableTeacher}</th>
                <th className="p-3 pr-4 text-right">
                  {t.admin.scheduleTableAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-card/60 transition-colors ${
                    item.is_break
                      ? "bg-muted/30 italic text-muted-foreground"
                      : ""
                  }`}
                >
                  <td className="p-3 pl-4 font-mono text-[11px] text-muted-foreground">
                    #{item.sort_order + 1}
                  </td>
                  <td className="p-3 font-mono text-[11.5px] whitespace-nowrap">
                    {item.time_start}{" "}
                    {item.time_end ? `— ${item.time_end}` : ""}
                  </td>
                  <td className="p-3 font-display font-medium text-foreground">
                    {item.subject}
                    {item.is_break && (
                      <span className="kicker ml-2 text-[9px] text-muted-foreground">
                        (Istirahat)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-[13px] text-muted-foreground">
                    {item.teacher || "—"}
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
              ))}
            </tbody>
          </table>
        </DataTable>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-lg border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="kicker block text-[10px]">Hari</label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as ScheduleRow["day"])}
                  className="mt-1 w-full rounded border border-border bg-background/50 p-2 font-mono text-sm"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="kicker block text-[10px]">Mulai</label>
                <Input
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  placeholder="07:00"
                  className="mt-1 bg-background/50 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="kicker block text-[10px]">Selesai</label>
                <Input
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  placeholder="07:45"
                  className="mt-1 bg-background/50 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">Mata Pelajaran</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="misal: Pemrograman Web, Matematika, Istirahat"
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Guru Pengampu ({t.common.optional})
              </label>
              <Input
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="misal: Rina Wijayanti, S.Kom."
                className="mt-1 bg-background/50 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBreak"
                  checked={isBreak}
                  onChange={(e) => setIsBreak(e.target.checked)}
                  className="size-4 rounded border-border"
                />
                <label
                  htmlFor="isBreak"
                  className="text-[13px] cursor-pointer text-foreground"
                >
                  Ini sesi istirahat
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="kicker text-[9px]">Urutan:</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-16 rounded border border-border bg-background/50 p-1 font-mono text-xs"
                />
              </div>
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
