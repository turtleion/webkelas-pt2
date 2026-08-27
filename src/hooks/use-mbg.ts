import { useEffect, useState, useCallback } from "react";
import {
  getMbgSchedule,
  createMbgSchedule,
  updateMbgSchedule,
  deleteMbgSchedule,
  type MbgScheduleRow,
} from "@/lib/db";

export function useMbgSchedule() {
  const [data, setData] = useState<MbgScheduleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getMbgSchedule();
      setData(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat jadwal MBG");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refresh: fetch,
    create: createMbgSchedule,
    update: updateMbgSchedule,
    remove: deleteMbgSchedule,
  };
}
