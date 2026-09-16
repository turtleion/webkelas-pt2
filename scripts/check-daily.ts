/**
 * Cek mandiri untuk logika "hari sekolah berikutnya" (src/lib/daily.ts).
 * Jalankan: node scripts/check-daily.ts
 *
 * Tidak pakai framework — cukup assert dari stdlib.
 */
import assert from "node:assert/strict";
import {
  addDaysISO,
  dayNameOf,
  labelTanggal,
  nextSchoolDay,
  todayWIB,
} from "../src/lib/daily.ts";

/** Waktu pemicu penjadwal: 15:00 WIB (UTC+7). */
const wib = (iso: string, jam = 15) =>
  new Date(`${iso}T${String(jam).padStart(2, "0")}:00:00+07:00`);

// --- Siklus mingguan: Minggu→Senin … Kamis→Jumat, Jumat/Sabtu → null -------
assert.equal(nextSchoolDay(wib("2026-09-13")), "2026-09-14", "Minggu → Senin");
assert.equal(nextSchoolDay(wib("2026-09-14")), "2026-09-15", "Senin → Selasa");
assert.equal(nextSchoolDay(wib("2026-09-15")), "2026-09-16", "Selasa → Rabu");
assert.equal(nextSchoolDay(wib("2026-09-16")), "2026-09-17", "Rabu → Kamis");
assert.equal(nextSchoolDay(wib("2026-09-17")), "2026-09-18", "Kamis → Jumat");
assert.equal(nextSchoolDay(wib("2026-09-18")), null, "Jumat → tidak ada");
assert.equal(nextSchoolDay(wib("2026-09-19")), null, "Sabtu → tidak ada");

// --- Zona waktu: pukul 23:30 WIB masih hari yang sama ----------------------
assert.equal(
  nextSchoolDay(new Date("2026-09-13T16:30:00Z")), // = Minggu 23:30 WIB
  "2026-09-14",
  "23:30 WIB tetap memakai tanggal WIB",
);

// --- todayWIB: server UTC tidak boleh menggeser tanggal --------------------
assert.equal(todayWIB(new Date("2026-09-14T08:00:00Z")), "2026-09-14");
assert.equal(todayWIB(new Date("2026-09-14T20:00:00Z")), "2026-09-15");

// --- Nama hari + aritmetika tanggal ---------------------------------------
assert.equal(dayNameOf("2026-09-14"), "Senin");
assert.equal(dayNameOf("2026-09-18"), "Jumat");
assert.equal(dayNameOf("2026-09-19"), null, "Sabtu bukan hari sekolah");
assert.equal(addDaysISO("2026-09-30", 1), "2026-10-01", "lintas bulan");
assert.match(labelTanggal("2026-09-14"), /Senin.*14.*September.*2026/);

// --- Bertahan berulang (tidak ada efek samping antar panggilan) -----------
assert.equal(nextSchoolDay(wib("2026-09-18")), null);
assert.equal(nextSchoolDay(wib("2026-09-18")), null);

console.log("OK — logika hari sekolah lolos semua cek.");
