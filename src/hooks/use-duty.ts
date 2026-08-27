import { useEffect, useState, useCallback } from "react";
import {
  getDutySchedule,
  createDutySchedule,
  updateDutySchedule,
  deleteDutySchedule,
  type DutyScheduleRow,
} from "@/lib/db";

export function useDutySchedule() {
  const [data, setData] = useState<DutyScheduleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getDutySchedule();
      setData(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat jadwal piket");
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
    create: createDutySchedule,
    update: updateDutySchedule,
    remove: deleteDutySchedule,
  };
}
