const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const BULAN_SINGKAT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

const HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

/** Pecah tanggal ISO (yyyy-mm-dd) menjadi bagian-bagian yang mudah ditampilkan. */
export function pecahTanggal(iso: string) {
  const [tahun, bulan, hari] = iso.split("-").map(Number);
  return {
    tahun,
    bulan,
    hari,
    bulanNama: BULAN[bulan - 1] ?? "",
    bulanSingkat: BULAN_SINGKAT[bulan - 1] ?? "",
    hariNama: HARI[new Date(tahun, bulan - 1, hari).getDay()],
    teks: `${hari} ${BULAN[bulan - 1] ?? ""} ${tahun}`,
  };
}

/** Nama hari (mis. "Senin") dari tanggal ISO. */
export function hariNama(iso: string): string {
  const t = pecahTanggal(iso);
  return t.hariNama;
}

/** Inisial dari nama (dua kata pertama), untuk monogram. */
export function inisialNama(nama: string): string {
  const bagian = nama.trim().split(/\s+/);
  return ((bagian[0]?.[0] ?? "") + (bagian[1]?.[0] ?? "")).toUpperCase();
}

export function padNomor(no: number): string {
  return String(no).padStart(2, "0");
}
