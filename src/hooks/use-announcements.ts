import { useEffect, useState, useCallback } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type AnnouncementRow,
} from "@/lib/db";
import { pengumuman as mockPengumuman } from "@/data/kelas";

export function useAnnouncements(publishedOnly = true) {
  const [data, setData] = useState<AnnouncementRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getAnnouncements(publishedOnly);
      if (rows.length === 0 && publishedOnly) {
        // Fallback ke mock bila database Supabase belum diisi/di-seed
        const fallback: AnnouncementRow[] = mockPengumuman.map((p) => ({
          id: p.id,
          title: p.judul,
          summary: p.ringkasan,
          body: null,
          category: p.kategori,
          published: true,
          published_at: `${p.tanggal}T00:00:00.000Z`,
          created_at: `${p.tanggal}T00:00:00.000Z`,
          updated_at: `${p.tanggal}T00:00:00.000Z`,
          created_by: null,
        }));
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useAnnouncements] fallback ke mock karena query gagal:", err);
      if (publishedOnly) {
        const fallback: AnnouncementRow[] = mockPengumuman.map((p) => ({
          id: p.id,
          title: p.judul,
          summary: p.ringkasan,
          body: null,
          category: p.kategori,
          published: true,
          published_at: `${p.tanggal}T00:00:00.000Z`,
          created_at: `${p.tanggal}T00:00:00.000Z`,
          updated_at: `${p.tanggal}T00:00:00.000Z`,
          created_by: null,
        }));
        setData(fallback);
      } else {
        setError(err instanceof Error ? err.message : "Gagal memuat pengumuman");
      }
    } finally {
      setIsLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchAnnouncements,
    create: createAnnouncement,
    update: updateAnnouncement,
    remove: deleteAnnouncement,
  };
}
