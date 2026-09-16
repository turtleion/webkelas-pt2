import { useCallback, useEffect, useState } from "react";
import {
  getCurrentDailyOverview,
  getDailyOverview,
  getDutySchedule,
  getMbgSchedule,
  getSchedules,
  getTasks,
  upsertDailyOverview,
  type DailyOverviewRow,
  type DutyScheduleRow,
  type MbgScheduleRow,
  type ScheduleRow,
  type TaskRow,
} from "@/lib/db";
import { dayNameOf, nextSchoolDay, todayWIB } from "@/lib/daily";

export interface DailyBundle {
  /** Tanggal yang jadi acuan overview ini (YYYY-MM-DD). */
  targetDate: string;
  /** Nama hari sekolah dari targetDate, atau null kalau akhir pekan. */
  day: ScheduleRow["day"] | null;
  /** Baris daily_overview untuk targetDate (null = belum dibuat otomatis). */
  overview: DailyOverviewRow | null;
  pelajaran: ScheduleRow[];
  piket: DutyScheduleRow[];
  mbg: MbgScheduleRow[];
  tugas: TaskRow[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Ringkasan hari sekolah berikutnya. Menggabungkan tabel yang sudah ada
 * (schedules / duty_schedule / mbg_schedule / tugas) dengan baris
 * `daily_overview` — tidak ada duplikasi data jadwal atau tugas.
 *
 * @param pinnedDate kalau diisi, pakai tanggal ini (dipakai panel admin).
 */
export function useDailyOverview(pinnedDate?: string): DailyBundle {
  const [targetDate, setTargetDate] = useState<string>(
    pinnedDate ?? todayWIB(),
  );
  const [overview, setOverview] = useState<DailyOverviewRow | null>(null);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [duty, setDuty] = useState<DutyScheduleRow[]>([]);
  const [mbg, setMbg] = useState<MbgScheduleRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(
    async (withLoader = true) => {
      if (withLoader) setIsLoading(true);
      setError(null);
      try {
        const [overviewRow, scheduleRows, dutyRows, mbgRows, taskRows] =
          await Promise.all([
            pinnedDate
              ? getDailyOverview(pinnedDate)
              : getCurrentDailyOverview(todayWIB()),
            getSchedules(),
            getDutySchedule(),
            getMbgSchedule(),
            getTasks(),
          ]);

        // Target: tanggal yang di-pin, atau tanggal overview terbaru yang
        // belum lewat. Kalau belum ada baris sama sekali, pakai hari sekolah
        // berikutnya supaya halaman tetap punya konteks tanggal.
        const resolved =
          pinnedDate ??
          overviewRow?.target_date ??
          nextSchoolDay() ??
          todayWIB();

        setTargetDate(resolved);
        setOverview(overviewRow);
        setSchedules(scheduleRows);
        setDuty(dutyRows);
        setMbg(mbgRows);
        setTasks(taskRows);
      } catch (err) {
        console.warn("[useDailyOverview] gagal memuat:", err);
        setError(
          err instanceof Error ? err.message : "Gagal memuat data harian",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [pinnedDate],
  );

  useEffect(() => {
    // Loading sudah true dari useState awal — jangan set sinkron di effect.
    void fetchAll(false);
  }, [fetchAll]);

  const day = dayNameOf(targetDate);

  return {
    targetDate,
    day,
    overview,
    pelajaran: day ? schedules.filter((s) => s.day === day) : [],
    piket: day ? duty.filter((d) => d.day === day) : [],
    mbg: day ? mbg.filter((m) => m.day === day) : [],
    tugas: tasks.filter((t) => t.date === targetDate),
    isLoading,
    error,
    refresh: fetchAll,
  };
}

/** Simpan data harian dari panel admin — re-export agar satu pintu. */
export { upsertDailyOverview };
