import { useEffect, useState, useCallback } from "react";
import {
  getGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  type GalleryPhotoRow,
} from "@/lib/db";
import { deleteGalleryImage } from "@/lib/storage";
import { galeri as mockGaleri } from "@/data/kelas";

export function useGallery() {
  const [data, setData] = useState<GalleryPhotoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getGalleryPhotos();
      if (rows.length === 0) {
        const fallback: GalleryPhotoRow[] = mockGaleri.map((g, idx) => ({
          id: g.id,
          title: g.judul,
          description: null,
          category: g.kategori,
          date: g.tanggal,
          image_url: "",
          storage_path: "",
          aspect: g.aspect ?? "4 / 3",
          sort_order: idx,
          created_at: `${g.tanggal}T00:00:00.000Z`,
          updated_at: `${g.tanggal}T00:00:00.000Z`,
          created_by: null,
        }));
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useGallery] fallback ke mock karena query gagal:", err);
      const fallback: GalleryPhotoRow[] = mockGaleri.map((g, idx) => ({
        id: g.id,
        title: g.judul,
        description: null,
        category: g.kategori,
        date: g.tanggal,
        image_url: "",
        storage_path: "",
        aspect: g.aspect ?? "4 / 3",
        sort_order: idx,
        created_at: `${g.tanggal}T00:00:00.000Z`,
        updated_at: `${g.tanggal}T00:00:00.000Z`,
        created_by: null,
      }));
      setData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  const remove = useCallback(
    async (id: string, storagePath?: string) => {
      if (storagePath) {
        await deleteGalleryImage(storagePath);
      }
      await deleteGalleryPhoto(id);
      await fetchGallery();
    },
    [fetchGallery]
  );

  return {
    data,
    isLoading,
    error,
    refresh: fetchGallery,
    create: createGalleryPhoto,
    update: updateGalleryPhoto,
    remove,
  };
}
