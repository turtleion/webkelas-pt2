import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
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
import { usePageTitle } from "@/hooks/use-page-title";
import { useTasks } from "@/hooks/use-tasks";
import { useTranslation } from "@/hooks/use-translation";
import { type TaskRow } from "@/lib/db";
import { pecahTanggal } from "@/lib/tanggal";
import { Edit2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { taskSlug } from "../Tugas";

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_ID = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const DAYS_EN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AdminTugas() {
  const { t, locale } = useTranslation();
  usePageTitle(`${t.tasks.heading} — Panel`);
  const { data: agendaItems, isLoading, error, refresh, create, update, remove } =
    useTasks();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaskRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskRow | null>(null);

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const months = locale === "en" ? MONTHS_EN : MONTHS_ID;
  const dayNames = locale === "en" ? DAYS_EN : DAYS_ID;
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskRow[]> = {};
    agendaItems.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [agendaItems]);

  const navigateMonth = (delta: number) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  const calendarDays: Array<{ date: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push({ date: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({ date: d, dateStr });
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const openCreateModal = () => {
    setEditingItem(null);
    setDate(selectedDate ?? todayStr);
    setTitle("");
    setDescription("");
    setCategory("Kegiatan");
    setDialogOpen(true);
  };

  const openEditModal = (item: TaskRow) => {
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
      toast.error("Judul dan tanggal wajib diisi.");
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
        toast.success("Tugas berhasil diperbarui.");
      } else {
        await create({
          date,
          title,
          description: description || null,
          category,
        });
        toast.success("Tugas baru berhasil ditambahkan.");
      }
      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan tugas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success("Tugas berhasil dihapus.");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Gagal menghapus tugas");
    } finally {
      setIsDeleting(false);
    }
  };

  const dayTasks = selectedDate ? tasksByDate[selectedDate] ?? [] : [];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="TGS"
          label={t.nav.agenda}
          title={t.tasks.heading}
          description={t.tasks.description}
        />
        <Button
          onClick={openCreateModal}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus className="size-4" /> {t.common.add}
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Calendar — same UX as /tugas */}
          <div className="lg:col-span-2">
            <div className="glass rounded-xl border border-border/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <button type="button" onClick={() => navigateMonth(-1)} className="rounded px-3 py-1 font-mono text-sm text-muted-foreground hover:bg-card/80 hover:text-foreground">←</button>
                <h2 className="font-display text-xl font-medium">{months[currentMonth]} {currentYear}</h2>
                <button type="button" onClick={() => navigateMonth(1)} className="rounded px-3 py-1 font-mono text-sm text-muted-foreground hover:bg-card/80 hover:text-foreground">→</button>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center min-h-[260px]">
                {dayNames.map((d) => (
                  <div key={d} className="py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{d}</div>
                ))}
                {calendarDays.map((cell, i) => {
                  if (cell.date === null) return <div key={`empty-${i}`} className="py-3" />;
                  const hasTasks = cell.dateStr && tasksByDate[cell.dateStr]?.length;
                  const isToday = cell.dateStr === todayStr;
                  const isSelected = cell.dateStr === selectedDate;
                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg py-3 text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/20 ring-2 ring-primary font-semibold text-primary"
                          : isToday
                            ? "bg-primary/10 font-semibold text-primary"
                            : hasTasks
                              ? "bg-accent/5 font-medium text-foreground hover:bg-accent/10"
                              : "text-muted-foreground hover:bg-muted/30"
                      }`}
                    >
                      <span>{cell.date}</span>
                      {hasTasks && (
                        <div className="mt-0.5 flex gap-0.5">
                          {tasksByDate[cell.dateStr!].slice(0, 3).map((_, j) => (
                            <span key={j} className="inline-block size-1 rounded-full bg-accent" />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
              {t.tasks.clickDayHint}
            </p>
          </div>

          {/* Selected date tasks + admin actions */}
          <div className="block">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">
                {selectedDate ? pecahTanggal(selectedDate).hari + " " + pecahTanggal(selectedDate).bulanSingkat + " " + pecahTanggal(selectedDate).tahun : "Pilih tanggal"}
              </h3>
              <span className="font-mono text-[10px] uppercase text-muted-foreground">{selectedDate}</span>
            </div>

            {error ? (
              <p className="text-sm italic text-destructive">{error}</p>
            ) : dayTasks.length === 0 ? (
              <p className="text-sm italic text-muted-foreground">{t.tasks.empty}</p>
            ) : (
              <div className="space-y-3">
                {dayTasks.map((item) => (
                  <div
                    key={item.id}
                    className="glass group rounded-xl border border-border/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className={`font-display text-base font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                          {item.title}
                        </h4>
                        <span className="mt-1 inline-block rounded bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                          {item.category}
                        </span>
                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-[13px] text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <Link
                          to={`/tugas/${taskSlug(item)}`}
                          title="Buka detail tugas"
                          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/80 hover:text-primary"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(item)} className="size-7 cursor-pointer hover:bg-background/80">
                          <Edit2 className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(item)} className="size-7 cursor-pointer text-destructive hover:bg-destructive/10">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-lg border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? "Ubah Tugas" : "Tambah Tugas"}
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
                  placeholder="Kegiatan, Tugas, Ujian..."
                  className="mt-1 bg-background/50 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">Judul Tugas</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="misal: PR Matematika, Ujian Tengah Semester"
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Deskripsi — Markdown ({t.common.optional})
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan tambahan tugas..."
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
