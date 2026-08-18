import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceholderNote } from "@/components/site/PlaceholderNote";
import { PhotoPlate } from "@/components/site/PhotoPlate";
import { usePageTitle } from "@/hooks/use-page-title";
import { useGallery } from "@/hooks/use-gallery";
import { useOrganization } from "@/hooks/use-organization";
import { padNomor, pecahTanggal } from "@/lib/tanggal";
import { Loader2 } from "lucide-react";

export default function Galeri() {
  usePageTitle("Galeri");
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: galeri, isLoading } = useGallery();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main
        id="konten"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <PageHeader
          nomor="07"
          label="Galeri"
          title="Dokumentasi kelas"
          description={`Dokumentasi kegiatan ${kelas.nama} semester ${kelas.semester}. Foto diurutkan dari momen terbaru; rasio bingkai dibuat tidak seragam agar galeri terasa seperti album, bukan susunan kotak.`}
          meta={`${galeri.length} dokumen`}
        />

        <PlaceholderNote className="mt-8">
          Dokumentasi foto diunggah langsung oleh sie humas & dokumentasi melalui penyimpanan Supabase Storage.
        </PlaceholderNote>

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : galeri.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            Belum ada dokumentasi foto yang diunggah saat ini.
          </p>
        ) : (
          <ul className="mt-12 columns-2 gap-4 md:columns-3 md:gap-6 [&>li]:mb-4 md:[&>li]:mb-6">
            {galeri.map((g, i) => (
              <li key={g.id} className="break-inside-avoid">
                <PhotoPlate
                  aspect={g.aspect || "4 / 3"}
                  src={g.image_url || undefined}
                  label={`Dok. ${padNomor(i + 1)} — ${g.category}`}
                  caption={g.title}
                  date={g.date ? pecahTanggal(g.date).teks : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
