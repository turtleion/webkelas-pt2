import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PhotoPlate } from "@/components/site/PhotoPlate";
import { usePageTitle } from "@/hooks/use-page-title";
import { useGallery } from "@/hooks/use-gallery";
import { uploadGalleryImage, validateImageFile } from "@/lib/storage";
import { type GalleryPhotoRow } from "@/lib/db";
import { pecahTanggal, padNomor } from "@/lib/tanggal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminGallery() {
  usePageTitle("Kelola Galeri — Panel");
  const { data, isLoading, error, refresh, create, update, remove } = useGallery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryPhotoRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhotoRow | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dokumentasi");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [aspect, setAspect] = useState("4 / 3");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setCategory("Dokumentasi");
    setDate(new Date().toISOString().slice(0, 10));
    setAspect("4 / 3");
    setSelectedFile(null);
    setPreviewUrl(null);
    setDialogOpen(true);
  };

  const openEditModal = (item: GalleryPhotoRow) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category);
    setDate(item.date);
    setAspect(item.aspect || "4 / 3");
    setSelectedFile(null);
    setPreviewUrl(item.image_url || null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (validation) {
      toast.error(validation);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul foto wajib diisi.");
      return;
    }

    if (!editingItem && !selectedFile) {
      toast.error("Silakan pilih file gambar untuk diunggah.");
      return;
    }

    setIsUploading(true);
    try {
      if (editingItem) {
        let imageUrl = editingItem.image_url;
        let storagePath = editingItem.storage_path;

        if (selectedFile) {
          const uploaded = await uploadGalleryImage(selectedFile);
          imageUrl = uploaded.imageUrl;
          storagePath = uploaded.storagePath;
        }

        await update(editingItem.id, {
          title,
          description: description || null,
          category,
          date,
          aspect,
          image_url: imageUrl,
          storage_path: storagePath,
        });
        toast.success("Dokumentasi foto berhasil diperbarui.");
      } else if (selectedFile) {
        const uploaded = await uploadGalleryImage(selectedFile);
        await create({
          title,
          description: description || null,
          category,
          date,
          aspect,
          image_url: uploaded.imageUrl,
          storage_path: uploaded.storagePath,
        });
        toast.success("Foto baru berhasil diunggah ke galeri Supabase.");
      }

      setDialogOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id, deleteTarget.storage_path);
      toast.success("Foto telah dihapus dari galeri dan storage.");
      setDeleteTarget(null);
      await refresh();
    } catch {
      toast.error("Gagal menghapus foto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          nomor="05"
          label="Modul"
          title="Kelola Galeri Foto"
          description="Unggah dokumentasi momen kelas langsung ke Supabase Storage dan atur judul serta keterangannya."
        />
        <Button
          onClick={openCreateModal}
          className="cursor-pointer gap-2 self-start bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
        >
          <Plus className="size-4" /> Unggah Foto Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-10 flex min-h-[260px] items-center justify-center border border-border/70 bg-card/30">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Memuat galeri foto...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="mt-10 border border-destructive/40 bg-destructive/5 p-6 text-center text-destructive">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="mt-10 border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg italic text-muted-foreground">
            Belum ada dokumentasi tersimpan. Klik 'Unggah Foto Baru' untuk memulai.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((g, i) => {
            const t = pecahTanggal(g.date);
            return (
              <div
                key={g.id}
                className="glass glass-hover flex flex-col justify-between p-4"
              >
                <div>
                  <PhotoPlate
                    aspect={g.aspect || "4 / 3"}
                    src={g.image_url || undefined}
                    label={`Dok. ${padNomor(i + 1)} — ${g.category}`}
                    caption={g.title}
                    date={t.teks}
                  />
                  {g.description && (
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      {g.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    {g.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditModal(g)}
                      className="size-7 cursor-pointer hover:bg-background/80"
                    >
                      <Edit2 className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteTarget(g)}
                      className="size-7 cursor-pointer text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass glass-strong max-w-lg border-border/80 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              {editingItem ? "Ubah Informasi Foto" : "Unggah Foto Dokumentasi"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* File Upload Box */}
            <div>
              <label className="kicker block text-[10px]">Pilih Berkas Foto</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex cursor-pointer flex-col items-center justify-center border border-dashed border-border/90 bg-background/40 p-4 text-center hover:bg-card/60 transition-colors"
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-36 rounded object-cover shadow-xs"
                    />
                    <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                      Klik untuk ganti gambar
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="size-6 text-muted-foreground mb-1" />
                    <p className="font-display text-sm font-medium">
                      Pilih foto dari perangkat
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      JPG, PNG, WebP · Maks 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">Judul Foto / Momen</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="misal: Praktik Jaringan LAN di Lab 2"
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
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
                  placeholder="Kegiatan, MPLS"
                  className="mt-1 bg-background/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="kicker block text-[10px]">Rasio Bingkai</label>
                <select
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-background/50 p-2 font-mono text-xs"
                >
                  <option value="4 / 3">4:3 (Lanskap)</option>
                  <option value="16 / 9">16:9 (Lebar)</option>
                  <option value="1 / 1">1:1 (Kotak)</option>
                  <option value="3 / 4">3:4 (Potret)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="kicker block text-[10px]">
                Keterangan Foto (Opsional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan singkat tentang siapa saja dalam foto atau suasana acara..."
                className="mt-1 h-20 bg-background/50 text-[13.5px]"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="font-mono text-[11px] uppercase tracking-wider"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
              >
                {isUploading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                {isUploading ? "Mengunggah..." : "Simpan Foto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Foto Dokumentasi?"
        description={`Apakah Anda yakin ingin menghapus foto "${deleteTarget?.title}"? Foto ini juga akan dihapus dari Supabase Storage.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
