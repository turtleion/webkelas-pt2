import { useEffect, useState, useCallback } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type TaskRow,
} from "@/lib/db";
import { agenda as mockAgenda } from "@/data/kelas";

export function useTasks() {
  const [data, setData] = useState<TaskRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getTasks();
      if (rows.length === 0) {
        const fallback: TaskRow[] = mockAgenda.map((a, idx) => ({
          id: `mock-${idx}`,
          date: a.tanggal,
          title: a.judul,
          description: a.keterangan ?? null,
          category: a.kategori,
          subject: a.kategori,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: null,
        }));
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useTasks] fallback ke mock karena query gagal:", err);
      const fallback: TaskRow[] = mockAgenda.map((a, idx) => ({
        id: `mock-${idx}`,
        date: a.tanggal,
        title: a.judul,
        description: a.keterangan ?? null,
        category: a.kategori,
        subject: a.kategori,
        completed: false,
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
    void fetchTasks();
  }, [fetchTasks]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchTasks,
    create: createTask,
    update: updateTask,
    remove: deleteTask,
  };
}
