import { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { LoadingScreen } from "../components/Loading";
import CalendarCard from "@/src/components/Calendar";
import { fetchDb, mapCalendar } from "@/src/database/services";
import COLORS from "@/src/vars/colors";
import FIXED_SCHEDULE from "@/src/data/schedule.json";
import useMountEntrance from "@/src/components/hooks/useMountEntrance";
import SpiralBinding from "@/src/components/SpiralBinding";
import BookLine from "@/src/components/BookLine";
const ACCENTS = [COLORS.yellow, COLORS.coral, COLORS.green];
const MONTHS = [
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
];
const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// placeholder sama persis dengan admin/Tugas.jsx, biar datanya nyambung
// const FIXED_SCHEDULE = {
//   0: { subjects: [], piketKelas: [], piketMBG: [], seragam: [] },
//   1: {
//     subjects: ["Matematika", "Pemrograman Web", "PPKn", "Basis Data"],
//     piketKelas: ["Reza Ardiansyah", "Nabila Putri"],
//     piketMBG: ["Fajar Nugroho", "Salsa Amelia"],
//     seragam: ["Seragam OSIS", "Atribut lengkap"],
//   },
//   2: {
//     subjects: [
//       "Bahasa Indonesia",
//       "KKA",
//       "Pemrograman Berorientasi Objek",
//       "Olahraga",
//     ],
//     piketKelas: ["Wahyu Setiawan", "Dinda Ayu"],
//     piketMBG: ["Bagas Prasetyo", "Intan Permata"],
//     seragam: ["Seragam Olahraga"],
//   },
//   3: {
//     subjects: ["Basis Data", "Bahasa Inggris", "Sejarah", "DDPK 2"],
//     piketKelas: ["Yoga Pratama", "Citra Lestari"],
//     piketMBG: ["Rendra Saputra", "Melati Wijaya"],
//     seragam: ["Seragam OSIS", "Atribut lengkap"],
//   },
//   4: {
//     subjects: ["Pemrograman Web", "Matematika", "Agama", "Basis Data"],
//     piketKelas: ["Fikri Ramadhan", "Ayu Anjani"],
//     piketMBG: ["Dimas Aditya", "Putri Rahmawati"],
//     seragam: ["Seragam OSIS", "Atribut lengkap"],
//   },
//   5: {
//     subjects: ["Infor", "KKA", "Bahasa Inggris", "DDPK 2"],
//     piketKelas: ["Ishma Nur", "Henis Nova", "Handayani Puspita"],
//     piketMBG: ["Abdina Putri", "Aurelia Dwi"],
//     seragam: ["Seragam Pramuka", "Atribut lengkap"],
//   },
//   6: {
//     subjects: ["Ekstrakurikuler", "Proyek Kelas"],
//     piketKelas: ["Bima Setiadi", "Karina Salsabila"],
//     piketMBG: [],
//     seragam: ["Bebas rapi"],
//   },
// };

function formatKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function TugasPage() {
  const mounted = useMountEntrance();
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 3));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [detailTask, setDetailTask] = useState(null); // task object saat popup terbuka, null saat tertutup

  const dateKey = formatKey(selectedDate);
  const dayData = data[dateKey] || { tasks: [], notes: "" };
  const fixedInfo = FIXED_SCHEDULE[selectedDate.getDay()];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchDb();

        // Pastikan format yang dikembalikan sesuai (Object dengan properti tasks dan calendars)
        if (result) {
          setData(mapCalendar(result.tasks, result.calendars));
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []); // Array kosong berarti ini hanya berjalan 1 kali saat page dibuka

  if (loading) {
    return (
      <LoadingScreen
        mode="light"
        title="Memuat Tugas..."
        subtitle="Harap tunggu sebentar"
        visible={loading}
      />
    );
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden mt-6 pb-12"
      style={{
        backgroundColor: COLORS.LIGHT_BG,
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(27,42,74,0.06) 0px, rgba(27,42,74,0.06) 1px, transparent 1px, transparent 32px)",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <style>{`
        .focus-ring:focus-visible { outline: 3px solid ${COLORS.yellow}; outline-offset: 2px; }
      `}</style>

      <SpiralBinding />
      <BookLine />
      <div className="relative px-6 sm:px-10 lg:pl-24 lg:pr-14 py-16 sm:py-20 max-w-3xl mx-auto w-full">
        {/* header */}
        <p
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: COLORS.coral,
            letterSpacing: "0.05em",
          }}
          className="text-sm sm:text-base mb-3"
        >
          // lihat jadwal & tugas kelas
        </p>
        <h1 className="relative inline-block mb-10 sm:mb-14">
          <span
            className="block text-3xl sm:text-4xl md:text-5xl leading-none"
            style={{
              fontFamily: '"Archivo Black", sans-serif',
              color: COLORS.navy,
            }}
          >
            Tugas & Deadline
          </span>
          <svg
            width="100%"
            height="16"
            viewBox="0 0 320 16"
            className="absolute left-0 -bottom-2"
            style={{ overflow: "visible" }}
          >
            <path
              d="M2 10 Q 80 2, 160 8 T 318 6"
              stroke={COLORS.yellow}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 340,
                strokeDashoffset: mounted ? 0 : 340,
                transition: "stroke-dashoffset 1.1s ease-out 0.3s",
              }}
            />
          </svg>
        </h1>

        {/* calendar, kartu terang senada sama kartu lain */}
        <CalendarCard
          variant="light"
          markedDates={data}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <p
          className="text-xs sm:text-sm mb-4"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            color: COLORS.grey,
          }}
        >
          🔒 otomatis dari jadwal tetap kelas
        </p>

        {/* fixed data, gaya sama seperti JadwalSection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div
            className="rotate-1 hover:rotate-0 hover:-translate-y-1 transition-transform duration-200 rounded-xl border-2 shadow-lg p-5"
            style={{ backgroundColor: "#FFFFFF", borderColor: COLORS.navy }}
          >
            <p
              className="text-sm mb-3"
              style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: COLORS.navy,
              }}
            >
              📚 Mata Pelajaran
            </p>
            {fixedInfo.subjects.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: COLORS.navy, opacity: 0.6 }}
              >
                Tidak ada jadwal.
              </p>
            ) : (
              <ol className="space-y-2">
                {fixedInfo.subjects.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: COLORS.navy }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div
            className="-rotate-1 hover:rotate-0 hover:-translate-y-1 transition-transform duration-200 rounded-xl border-2 shadow-lg p-5"
            style={{ backgroundColor: "#FFFFFF", borderColor: COLORS.navy }}
          >
            <p
              className="text-sm mb-3"
              style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: COLORS.navy,
              }}
            >
              👔 Seragam
            </p>
            {fixedInfo.seragam.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: COLORS.navy, opacity: 0.6 }}
              >
                Belum ditentukan.
              </p>
            ) : (
              <ul className="space-y-2">
                {fixedInfo.seragam.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: COLORS.navy }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: COLORS.green }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className="rotate-1 hover:rotate-0 hover:-translate-y-1 transition-transform duration-200 rounded-xl border-2 shadow-lg p-5 mb-4"
          style={{ backgroundColor: "#FFFFFF", borderColor: COLORS.navy }}
        >
          <p
            className="text-sm mb-3"
            style={{
              fontFamily: '"Archivo Black", sans-serif',
              color: COLORS.navy,
            }}
          >
            🧹 Piket Kelas
          </p>
          <div className="flex flex-wrap gap-2">
            {fixedInfo.piketKelas.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: COLORS.navy, opacity: 0.6 }}
              >
                Tidak ada piket.
              </p>
            ) : (
              fixedInfo.piketKelas.map((name, i) => (
                <span
                  key={i}
                  className="text-sm rounded-full px-3 py-1"
                  style={{
                    backgroundColor: COLORS.LIGHT_BG,
                    color: COLORS.navy,
                    border: `1px solid ${COLORS.navy}22`,
                  }}
                >
                  {name}
                </span>
              ))
            )}
          </div>
        </div>

        <div
          className="rounded-xl border-2 shadow-lg p-5 mb-10 sm:mb-14"
          style={{ backgroundColor: "#FFFFFF", borderColor: COLORS.navy }}
        >
          <p
            className="text-sm mb-3"
            style={{
              fontFamily: '"Archivo Black", sans-serif',
              color: COLORS.navy,
            }}
          >
            🍽️ Piket MBG
          </p>
          <div className="flex flex-wrap gap-2">
            {fixedInfo.piketMbg.length === 0 ? (
              <p
                className="text-sm"
                style={{ color: COLORS.navy, opacity: 0.6 }}
              >
                Tidak ada piket.
              </p>
            ) : (
              fixedInfo.piketMbg.map((name, i) => (
                <span
                  key={i}
                  className="text-sm rounded-full px-3 py-1"
                  style={{
                    backgroundColor: COLORS.LIGHT_BG,
                    color: COLORS.navy,
                    border: `1px solid ${COLORS.navy}22`,
                  }}
                >
                  {name}
                </span>
              ))
            )}
          </div>
        </div>

        {/* tugas aktif, readonly */}
        <p
          className="text-lg sm:text-xl mb-4"
          style={{
            fontFamily: '"Archivo Black", sans-serif',
            color: COLORS.navy,
          }}
        >
          Tugas Aktif
        </p>

        <div
          className="rounded-xl border-2 shadow-lg p-5 sm:p-6 mb-6"
          style={{ backgroundColor: "#FFFFFF", borderColor: COLORS.navy }}
        >
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {dayData.tasks.length === 0 ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: COLORS.grey }}
              >
                Belum ada tugas buat tanggal ini.
              </p>
            ) : (
              dayData.tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setDetailTask(task)}
                  className="focus-ring w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-transform duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: COLORS.LIGHT_BG,
                    border: `1px solid ${COLORS.navy}22`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-bold text-sm sm:text-base truncate"
                      style={{ color: COLORS.navy }}
                    >
                      {task.title}
                    </p>
                    <p
                      className="text-xs mt-0.5 truncate"
                      style={{ color: COLORS.grey }}
                    >
                      {task.note ? task.note : "Tidak ada penjelasan tambahan."}
                    </p>
                  </div>
                  <span
                    className="text-xs sm:text-sm flex-shrink-0"
                    style={{ color: COLORS.navy, opacity: 0.6 }}
                  >
                    {task.mapel}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* catatan, readonly, cuma muncul kalau ada isinya */}
        {dayData.notes && (
          <div
            className="relative rounded-lg p-5 sm:p-6 rotate-1"
            style={{
              backgroundColor: "#FFF6D9",
              border: `2px dashed ${COLORS.navy}40`,
            }}
          >
            <div
              className="hidden sm:block absolute -top-3 left-8 w-14 h-5 -rotate-3 opacity-80"
              style={{ backgroundColor: COLORS.yellow }}
            />
            <p
              className="text-base mb-2"
              style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: COLORS.navy,
              }}
            >
              📝 Catatan
            </p>
            <p className="text-sm" style={{ color: COLORS.navy }}>
              {dayData.notes}
            </p>
          </div>
        )}
      </div>

      {/* popup detail tugas, readonly */}
      {detailTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={() => setDetailTask(null)}
        >
          <div
            className="w-full max-w-md rounded-xl shadow-2xl p-6 sm:p-7 relative"
            style={{
              backgroundColor: "#FFFFFF",
              border: `2px solid ${COLORS.navy}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailTask(null)}
              aria-label="Tutup"
              className="focus-ring absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ color: COLORS.navy }}
            >
              <X className="w-5 h-5" />
            </button>

            <p
              className="text-xl sm:text-2xl mb-2 pr-8"
              style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: COLORS.navy,
              }}
            >
              {detailTask.title}
            </p>
            <span
              className="inline-block text-xs rounded-full px-3 py-1 mb-5"
              style={{
                backgroundColor: `${COLORS.coral}1A`,
                color: COLORS.coral,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {detailTask.mapel}
            </span>

            <p
              className="text-xs mb-1"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: COLORS.grey,
              }}
            >
              Deadline
            </p>
            <p className="text-sm mb-5" style={{ color: COLORS.navy }}>
              {DAY_NAMES[selectedDate.getDay()]}, {selectedDate.getDate()}{" "}
              {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </p>

            <p
              className="text-xs mb-1"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                color: COLORS.grey,
              }}
            >
              Penjelasan
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: COLORS.navy, opacity: 0.85 }}
            >
              {detailTask.note
                ? detailTask.note
                : "Tidak ada penjelasan tambahan."}
            </p>

            <button
              type="button"
              onClick={() => setDetailTask(null)}
              className="focus-ring w-full rounded-lg py-3 font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.navy, color: COLORS.paper }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
