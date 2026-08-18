import { useEffect, useState, useCallback } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  type ScheduleRow,
} from "@/lib/db";
import { jadwal as mockJadwal } from "@/data/kelas";

export function useSchedule() {
  const [data, setData] = useState<ScheduleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getSchedules();
      if (rows.length === 0) {
        const fallback: ScheduleRow[] = [];
        let order = 0;
        mockJadwal.forEach((dayGroup) => {
          dayGroup.rows.forEach((r) => {
            const times = r.waktu.split("-").map((s) => s.trim());
            fallback.push({
              id: `mock-${order}`,
              day: dayGroup.hari as ScheduleRow["day"],
              time_start: times[0] || "07:00",
              time_end: times[1] || null,
              subject: r.pelajaran,
              teacher: r.guru ?? null,
              is_break: Boolean(r.istirahat),
              sort_order: order++,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          });
        });
        setData(fallback);
      } else {
        setData(rows);
      }
    } catch (err) {
      console.warn("[useSchedule] fallback ke mock karena query gagal:", err);
      const fallback: ScheduleRow[] = [];
      let order = 0;
      mockJadwal.forEach((dayGroup) => {
        dayGroup.rows.forEach((r) => {
          const times = r.waktu.split("-").map((s) => s.trim());
          fallback.push({
            id: `mock-${order}`,
            day: dayGroup.hari as ScheduleRow["day"],
            time_start: times[0] || "07:00",
            time_end: times[1] || null,
            subject: r.pelajaran,
            teacher: r.guru ?? null,
            is_break: Boolean(r.istirahat),
            sort_order: order++,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });
      });
      setData(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSchedule();
  }, [fetchSchedule]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchSchedule,
    create: createSchedule,
    update: updateSchedule,
    remove: deleteSchedule,
  };
}
