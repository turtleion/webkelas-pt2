import { useEffect, useState, useCallback } from "react";
import {
  getAgendaItems,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
  type AgendaRow,
} from "@/lib/db";
import { agenda as mockAgenda } from "@/data/kelas";

export function useAgenda() {
  const [data, setData] = useState<AgendaRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgenda = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getAgendaItems();
      if (rows.length === 0) {
        const fallback: AgendaRow[] = mockAgenda.map((a, idx) => ({
          id: `mock-${idx}`,
          date: a.tanggal,
          title: a.judul,
          description: a.keterangan ?? null,
          category: a.kategori,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: null,
        }));
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useAgenda] fallback ke mock karena query gagal:", err);
      const fallback: AgendaRow[] = mockAgenda.map((a, idx) => ({
        id: `mock-${idx}`,
        date: a.tanggal,
        title: a.judul,
        description: a.keterangan ?? null,
        category: a.kategori,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
      }));
      setData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAgenda();
  }, [fetchAgenda]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchAgenda,
    create: createAgendaItem,
    update: updateAgendaItem,
    remove: deleteAgendaItem,
  };
}
