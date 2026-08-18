// ============================================================================
// DATA KELAS — X TKJ 1 · SMK Negeri 1 Cerme · T.A. 2026/2027
// ----------------------------------------------------------------------------
// PERHATIAN: seluruh data di berkas ini adalah CONTOH (placeholder) agar
// tampilan website terlihat utuh. Ganti dengan data asli kelas sebelum
// dipublikasikan. Nama siswa, guru, dan kontak di bawah ini fiktif.
// ============================================================================

export interface KelasInfo {
  nama: string;
  jurusan: string;
  jurusanSingkat: string;
  sekolah: string;
  alamatSekolah: string;
  tahunAjaran: string;
  semester: string;
  waliKelas: { nama: string; gelar: string; peran: string };
  jumlahSiswa: number;
  ruang: string;
  diperbarui: string; // ISO
  kontak: {
    instagram: string;
    instagramUrl: string;
    email: string;
    whatsapp: string;
  };
}

// PLACEHOLDER — ganti dengan identitas kelas yang sebenarnya
export const kelas: KelasInfo = {
  nama: "X TKJ 1",
  jurusan: "Teknik Komputer dan Jaringan",
  jurusanSingkat: "TKJ",
  sekolah: "SMK Negeri 1 Cerme",
  alamatSekolah:
    "Jl. Raya Cerme Kidul No. 12, Cerme, Kab. Gresik, Jawa Timur 61171",
  tahunAjaran: "2026/2027",
  semester: "Gasal",
  waliKelas: {
    nama: "Rina Wijayanti",
    gelar: "S.Kom.",
    peran: "Guru Produktif TKJ — konsultasi akademik dan kelas",
  },
  jumlahSiswa: 36,
  ruang: "Lab Komputer 2",
  diperbarui: "2026-08-14",
  kontak: {
    instagram: "@x.tkj1.smkn1cerme",
    instagramUrl: "https://instagram.com/", // PLACEHOLDER — ganti dengan tautan asli
    email: "x.tkj1@smkn1cerme.sch.id", // PLACEHOLDER — ganti dengan surel asli
    whatsapp: "+62 812-3456-7890", // PLACEHOLDER — ganti dengan nomor asli
  },
};

// ---------------------------------------------------------------------------
// ANGGOTA — 36 siswa (nama fiktif / placeholder)
// ---------------------------------------------------------------------------
export interface Anggota {
  no: number; // nomor absen
  nama: string;
  jabatan?: string;
}

// PLACEHOLDER — ganti dengan daftar siswa asli
export const anggota: Anggota[] = [
  { no: 1, nama: "Aditya Pramana Putra", jabatan: "Ketua Kelas" },
  { no: 2, nama: "Bunga Citra Lestari", jabatan: "Wakil Ketua" },
  { no: 3, nama: "Chandra Wijaya", jabatan: "Sekretaris I" },
  { no: 4, nama: "Dewi Ayu Safitri", jabatan: "Sekretaris II" },
  { no: 5, nama: "Eka Ramadhani", jabatan: "Bendahara I" },
  { no: 6, nama: "Fajar Nugroho", jabatan: "Bendahara II" },
  { no: 7, nama: "Gita Puspita Sari" },
  { no: 8, nama: "Hadi Prasetyo" },
  { no: 9, nama: "Intan Permata Dewi" },
  { no: 10, nama: "Joko Susilo" },
  { no: 11, nama: "Karina Aulia Rahma" },
  { no: 12, nama: "Lutfi Hakim" },
  { no: 13, nama: "Mega Ayu Lestari" },
  { no: 14, nama: "Nanda Pratama" },
  { no: 15, nama: "Olivia Salsabila" },
  { no: 16, nama: "Putra Ramadhan" },
  { no: 17, nama: "Qistina Nur Fadhilah" },
  { no: 18, nama: "Rizky Ananda" },
  { no: 19, nama: "Salsabila Zahra" },
  { no: 20, nama: "Tegar Firmansyah" },
  { no: 21, nama: "Umar Faruq" },
  { no: 22, nama: "Vina Amelia Putri" },
  { no: 23, nama: "Wahyu Hidayat" },
  { no: 24, nama: "Yasmin Putri Maharani" },
  { no: 25, nama: "Zaki Maulana" },
  { no: 26, nama: "Alif Ramadhan" },
  { no: 27, nama: "Bayu Saputra" },
  { no: 28, nama: "Citra Kirana" },
  { no: 29, nama: "Dimas Anggara" },
  { no: 30, nama: "Elsa Nur Aini" },
  { no: 31, nama: "Farhan Maulana" },
  { no: 32, nama: "Galih Prakoso" },
  { no: 33, nama: "Hana Salsabilla" },
  { no: 34, nama: "Iqbal Ramadhan" },
  { no: 35, nama: "Jihan Nabila" },
  { no: 36, nama: "Kevin Pratama" },
];

export function cariAnggota(no: number): Anggota {
  return anggota.find((a) => a.no === no) ?? { no, nama: "—" };
}

// ---------------------------------------------------------------------------
// STRUKTUR ORGANISASI KELAS
// ---------------------------------------------------------------------------
export interface Pengurus {
  jabatan: string;
  nomor: number[]; // nomor absen yang memegang jabatan
}

// PLACEHOLDER — hasil pemilihan pengurus kelas 21 Juli 2026
export const pengurusInti: Pengurus[] = [
  { jabatan: "Ketua Kelas", nomor: [1] },
  { jabatan: "Wakil Ketua", nomor: [2] },
  { jabatan: "Sekretaris", nomor: [3, 4] },
  { jabatan: "Bendahara", nomor: [5, 6] },
];

export const sie: Pengurus[] = [
  { jabatan: "Sie Keamanan & Ketertiban", nomor: [7, 8] },
  { jabatan: "Sie Kebersihan", nomor: [9, 10] },
  { jabatan: "Sie Kesehatan", nomor: [11, 12] },
  { jabatan: "Sie Kesenian", nomor: [13, 14] },
  { jabatan: "Sie Olahraga", nomor: [15, 16] },
  { jabatan: "Sie Kerohanian", nomor: [17, 18] },
  { jabatan: "Sie Humas & Dokumentasi", nomor: [19, 20] },
  { jabatan: "Sie Perlengkapan", nomor: [21, 22] },
];

// ---------------------------------------------------------------------------
// JADWAL PELAJARAN — semester gasal (placeholder)
// ---------------------------------------------------------------------------
export interface JadwalRow {
  waktu: string;
  pelajaran: string;
  guru: string;
  istirahat?: boolean;
}

export interface JadwalHari {
  hari: string;
  rows: JadwalRow[];
}

// PLACEHOLDER — jadwal sementara; ganti dengan jadwal resmi dari sekolah
export const jadwal: JadwalHari[] = [
  {
    hari: "Senin",
    rows: [
      { waktu: "07.00–07.45", pelajaran: "Upacara Bendera", guru: "—" },
      { waktu: "07.45–09.15", pelajaran: "Matematika", guru: "Pak Agus Santoso, S.Pd." },
      { waktu: "09.15–09.45", pelajaran: "Istirahat", guru: "", istirahat: true },
      { waktu: "09.45–11.15", pelajaran: "Dasar-dasar Kejuruan TKJ", guru: "Bu Rina Wijayanti, S.Kom." },
      { waktu: "11.15–12.00", pelajaran: "Bahasa Indonesia", guru: "Bu Siti Nurhaliza, M.Pd." },
      { waktu: "12.00–12.45", pelajaran: "Istirahat & ibadah", guru: "", istirahat: true },
      { waktu: "12.45–14.15", pelajaran: "PPKn", guru: "Bu Anisa Rahmawati, S.Pd." },
    ],
  },
  {
    hari: "Selasa",
    rows: [
      { waktu: "07.00–08.30", pelajaran: "Bahasa Inggris", guru: "Pak Dedi Kurniawan, S.Pd." },
      { waktu: "08.30–09.15", pelajaran: "Dasar-dasar Kejuruan TKJ", guru: "Bu Rina Wijayanti, S.Kom." },
      { waktu: "09.15–09.45", pelajaran: "Istirahat", guru: "", istirahat: true },
      { waktu: "09.45–11.15", pelajaran: "Dasar-dasar Kejuruan TKJ", guru: "Bu Rina Wijayanti, S.Kom." },
      { waktu: "11.15–12.00", pelajaran: "Informatika", guru: "Pak Eko Prasetyo, S.Kom." },
      { waktu: "12.00–12.45", pelajaran: "Istirahat & ibadah", guru: "", istirahat: true },
      { waktu: "12.45–14.15", pelajaran: "Seni Budaya", guru: "Bu Lestari Putri, S.Sn." },
    ],
  },
  {
    hari: "Rabu",
    rows: [
      { waktu: "07.00–08.30", pelajaran: "Matematika", guru: "Pak Agus Santoso, S.Pd." },
      { waktu: "08.30–09.15", pelajaran: "Bahasa Indonesia", guru: "Bu Siti Nurhaliza, M.Pd." },
      { waktu: "09.15–09.45", pelajaran: "Istirahat", guru: "", istirahat: true },
      { waktu: "09.45–11.15", pelajaran: "Sejarah", guru: "Pak Bambang Sutrisno, M.Pd." },
      { waktu: "11.15–12.00", pelajaran: "PJOK", guru: "Pak Yudi Prasetyo, S.Pd." },
      { waktu: "12.00–12.45", pelajaran: "Istirahat & ibadah", guru: "", istirahat: true },
      { waktu: "12.45–14.15", pelajaran: "Projek IPAS", guru: "Bu Ratna Dewi, M.Si." },
    ],
  },
  {
    hari: "Kamis",
    rows: [
      { waktu: "07.00–08.30", pelajaran: "Dasar-dasar Kejuruan TKJ", guru: "Bu Rina Wijayanti, S.Kom." },
      { waktu: "08.30–09.15", pelajaran: "Bahasa Inggris", guru: "Pak Dedi Kurniawan, S.Pd." },
      { waktu: "09.15–09.45", pelajaran: "Istirahat", guru: "", istirahat: true },
      { waktu: "09.45–11.15", pelajaran: "PAI & Budi Pekerti", guru: "Pak Ahmad Fauzi, S.Ag." },
      { waktu: "11.15–12.00", pelajaran: "Informatika", guru: "Pak Eko Prasetyo, S.Kom." },
      { waktu: "12.00–12.45", pelajaran: "Istirahat & ibadah", guru: "", istirahat: true },
      { waktu: "12.45–14.15", pelajaran: "Bimbingan Konseling", guru: "Bu Maya Kartika, S.Pd." },
    ],
  },
  {
    hari: "Jumat",
    rows: [
      { waktu: "07.00–07.45", pelajaran: "Tadarus & literasi", guru: "—" },
      { waktu: "07.45–09.15", pelajaran: "PPKn", guru: "Bu Anisa Rahmawati, S.Pd." },
      { waktu: "09.15–09.45", pelajaran: "Istirahat", guru: "", istirahat: true },
      { waktu: "09.45–11.15", pelajaran: "PJOK", guru: "Pak Yudi Prasetyo, S.Pd." },
      { waktu: "11.15–12.00", pelajaran: "Projek IPAS", guru: "Bu Ratna Dewi, M.Si." },
    ],
  },
];

// ---------------------------------------------------------------------------
// PENGUMUMAN (terbaru di atas)
// ---------------------------------------------------------------------------
export interface Pengumuman {
  id: string;
  judul: string;
  tanggal: string; // ISO yyyy-mm-dd
  kategori: string;
  ringkasan: string;
}

// PLACEHOLDER — ganti dengan pengumuman asli kelas
export const pengumuman: Pengumuman[] = [
  {
    id: "p-06",
    judul: "Piket kelas minggu ini: kelompok 3",
    tanggal: "2026-08-14",
    kategori: "Kelas",
    ringkasan:
      "Mulai Senin, kelompok 3 bertugas piket (kelas & lab). Daftar anggota kelompok terlampir di papan informasi. Jangan lupa piket sebelum bel masuk.",
  },
  {
    id: "p-05",
    judul: "Latihan upacara 17 Agustus",
    tanggal: "2026-08-10",
    kategori: "Sekolah",
    ringkasan:
      "Seluruh siswa kelas X TKJ 1 diminta hadir latihan baris-berbaris di lapangan utama, Kamis 14 Agustus pukul 14.30. Seragam: batik lengkap.",
  },
  {
    id: "p-04",
    judul: "Pengumpulan tugas Pemrograman Dasar",
    tanggal: "2026-08-03",
    kategori: "Tugas",
    ringkasan:
      "Tugas flowchart & pseudocode dikumpulkan paling lambat 20 Agustus melalui Google Classroom. Terlambat = nilai dikurangi 10 poin per hari.",
  },
  {
    id: "p-03",
    judul: "Jadwal pelajaran semester gasal terbit",
    tanggal: "2026-07-28",
    kategori: "Akademik",
    ringkasan:
      "Jadwal resmi semester gasal 2026/2027 sudah keluar dan dapat dilihat di halaman Jadwal. Cek kembali setiap awal bulan karena dapat berubah.",
  },
  {
    id: "p-02",
    judul: "Pemilihan pengurus kelas",
    tanggal: "2026-07-21",
    kategori: "Kelas",
    ringkasan:
      "Pemilihan pengurus kelas (ketua, wakil, sekretaris, bendahara, dan sie) dilaksanakan Selasa 21 Juli di jam terakhir. Kandidat boleh mencalonkan diri sendiri.",
  },
  {
    id: "p-01",
    judul: "MPLS 2026 dimulai",
    tanggal: "2026-07-14",
    kategori: "Sekolah",
    ringkasan:
      "Masa Pengenalan Lingkungan Sekolah dimulai hari ini, 14–16 Juli 2026. Datang sebelum 06.45 di lapangan utama, lengkap dengan atribut MPLS.",
  },
];

// ---------------------------------------------------------------------------
// AGENDA / KEGIATAN (kronologis)
// ---------------------------------------------------------------------------
export interface AgendaItem {
  tanggal: string; // ISO yyyy-mm-dd
  judul: string;
  kategori: string;
  keterangan?: string;
}

// PLACEHOLDER — ganti dengan agenda asli kelas
export const agenda: AgendaItem[] = [
  {
    tanggal: "2026-08-17",
    judul: "Upacara HUT ke-81 RI",
    kategori: "Sekolah",
    keterangan:
      "Upacara bendera di lapangan utama, pukul 07.00. Seragam: putih-putih lengkap dengan topi.",
  },
  {
    tanggal: "2026-08-20",
    judul: "Pengumpulan tugas Pemrograman Dasar",
    kategori: "Tugas",
    keterangan:
      "Batas akhir pengumpulan flowchart & pseudocode melalui Google Classroom.",
  },
  {
    tanggal: "2026-08-25",
    judul: "Kerja bakti kelas",
    kategori: "Kelas",
    keterangan:
      "Membersihkan kelas dan Lab Komputer 2 bersama. Membawa lap dan ember sendiri.",
  },
  {
    tanggal: "2026-09-09",
    judul: "Ulangan harian Matematika",
    kategori: "Akademik",
    keterangan: "Materi: bilangan real dan operasi aljabar. Pelajari lagi catatan Bab 1.",
  },
  {
    tanggal: "2026-09-16",
    judul: "Kunjungan industri",
    kategori: "TKJ",
    keterangan:
      "Observasi jaringan di kantor layanan internet setempat. Izin orang tua diserahkan H-3.",
  },
  {
    tanggal: "2026-11-25",
    judul: "Peringatan Hari Guru",
    kategori: "Sekolah",
    keterangan:
      "Kelas menyiapkan kejutan kecil untuk wali kelas dan guru produktif. Koordinasi dengan sie kesenian.",
  },
  {
    tanggal: "2026-12-18",
    judul: "Pembagian rapor semester gasal",
    kategori: "Akademik",
    keterangan: "Pengambilan rapor bersama orang tua di ruang kelas. Waktu menyusul.",
  },
];

// ---------------------------------------------------------------------------
// GALERI / DOKUMENTASI (placeholder — foto belum diunggah)
// ---------------------------------------------------------------------------
export interface GaleriItem {
  id: string;
  judul: string;
  tanggal: string; // ISO yyyy-mm-dd
  kategori: string;
  aspect: string; // rasio placeholder agar tata letak tidak kaku
}

// PLACEHOLDER — ganti dengan foto dokumentasi asli
export const galeri: GaleriItem[] = [
  { id: "g-01", judul: "MPLS — hari pertama", tanggal: "2026-07-14", kategori: "MPLS", aspect: "4 / 5" },
  { id: "g-02", judul: "Latihan baris-berbaris", tanggal: "2026-07-20", kategori: "Kegiatan", aspect: "3 / 2" },
  { id: "g-03", judul: "Pembentukan pengurus kelas", tanggal: "2026-07-21", kategori: "Kelas", aspect: "1 / 1" },
  { id: "g-04", judul: "Kerja bakti ruang kelas", tanggal: "2026-08-01", kategori: "Kelas", aspect: "3 / 2" },
  { id: "g-05", judul: "Latihan upacara 17 Agustus", tanggal: "2026-08-12", kategori: "Sekolah", aspect: "4 / 3" },
  { id: "g-06", judul: "Upacara 17 Agustus", tanggal: "2026-08-17", kategori: "Sekolah", aspect: "3 / 2" },
  { id: "g-07", judul: "Piket mingguan kelompok 3", tanggal: "2026-08-26", kategori: "Kelas", aspect: "1 / 1" },
  { id: "g-08", judul: "Praktik instalasi jaringan", tanggal: "2026-09-02", kategori: "TKJ", aspect: "4 / 5" },
];
