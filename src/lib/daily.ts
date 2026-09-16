import type { ScheduleRow } from "./db";

/**
 * Logika tanggal harian — satu sumber kebenaran untuk "hari sekolah berikutnya".
 * Dipakai oleh /daily, /admin/notification, dan banner notifikasi.
 * Zona waktu eksplisit: Asia/Jakarta (WIB, UTC+7).
 */

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const HARI_SEKOLAH: Array<ScheduleRow["day"]> = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];

/** Tanggal ISO (YYYY-MM-DD) hari ini menurut zona Asia/Jakarta. */
export function todayWIB(now: Date = new Date()): string {
  return new Date(now.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

/** Tambah `days` hari ke sebuah tanggal ISO. */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** Indeks hari JS (0=Minggu … 6=Sabtu) untuk tanggal ISO. */
export function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Hari sekolah berikutnya (Senin–Jumat), atau null kalau besok akhir pekan.
 *
 *   Minggu → Senin      Kamis → Jumat
 *   Senin  → Selasa     Jumat → null
 *   Selasa → Rabu       Sabtu → null
 *   Rabu   → Kamis
 */
export function nextSchoolDay(now: Date = new Date()): string | null {
  const besok = addDaysISO(todayWIB(now), 1);
  const dow = weekdayOf(besok);
  return dow >= 1 && dow <= 5 ? besok : null;
}

/** Nama hari sekolah ("Senin".."Jumat") dari tanggal ISO, atau null. */
export function dayNameOf(iso: string): ScheduleRow["day"] | null {
  const dow = weekdayOf(iso);
  return dow >= 1 && dow <= 5 ? HARI_SEKOLAH[dow - 1] : null;
}

/** Label panjang berbahasa Indonesia, mis. "Senin, 14 September 2026". */
export function labelTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
