import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useAgenda } from "@/hooks/use-agenda";
import { useMembers } from "@/hooks/use-members";
import { useGallery } from "@/hooks/use-gallery";
import { useOrganization } from "@/hooks/use-organization";
import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { HomeClassic } from "@/components/home/HomeClassic";
import { HomeBento } from "@/components/home/HomeBento";
import { HomeShowcase } from "@/components/home/HomeShowcase";

export default function Home() {
  const { t } = useTranslation();
  usePageTitle(t.nav.home);

  const { preferences } = usePreferences();
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: pengumuman } = useAnnouncements(true);
  const { data: agenda } = useAgenda();
  const { data: anggota } = useMembers();
  const { data: galeri } = useGallery();

  const faktaIdentitas: Array<[string, string]> = [
    ["Kelas", kelas.nama],
    ["Jurusan", kelas.jurusan],
    ["Sekolah", kelas.sekolah],
    ["Wali Kelas", `${kelas.waliKelas.nama}${kelas.waliKelas.gelar ? `, ${kelas.waliKelas.gelar}` : ""}`],
    ["Ketua Kelas", anggota.find((a) => a.position?.toLowerCase().includes("ketua"))?.name || anggota[0]?.name || "—"],
    ["Jumlah Siswa", `${kelas.jumlahSiswa || anggota.length} siswa`],
  ];

  const layoutProps = {
    kelas,
    pengumuman,
    agenda,
    anggota,
    galeri,
    faktaIdentitas,
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten">
        {preferences.homeLayout === "bento" ? (
          <HomeBento {...layoutProps} />
        ) : preferences.homeLayout === "showcase" ? (
          <HomeShowcase {...layoutProps} />
        ) : (
          <HomeClassic {...layoutProps} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
