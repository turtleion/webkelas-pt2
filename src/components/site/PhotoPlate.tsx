import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoPlateProps = {
  /** Rasio bingkai foto, mis. "4 / 3" */
  aspect?: string;
  /** Label kategori / nomor dokumen, mis. "Dok. 001" */
  label?: string;
  /** Keterangan foto, tampil di bawah bingkai */
  caption?: string;
  /** Tanggal, tampil di bawah bingkai (kanan) */
  date?: string;
  /** Jika diisi, menampilkan foto asli; kosongkan untuk placeholder */
  src?: string;
  alt?: string;
  /** Dipakai saat plat berada di bagian berlatar gelap agar keterangan terbaca */
  onDark?: boolean;
  className?: string;
};

/**
 * Bingkai foto bergaya arsip. Selama belum ada foto asli, menampilkan
 * placeholder sepia yang jujur ("foto belum diarsip") dengan tanda kurung
 * pojok dan tekstur kertas — bukan foto fiktif.
 */
export function PhotoPlate({
  aspect = "4 / 3",
  label = "Dokumentasi",
  caption,
  date,
  src,
  alt,
  onDark = false,
  className,
}: PhotoPlateProps) {
  return (
    <figure className={cn("group", className)}>
      <div
        className="plate relative overflow-hidden border border-border"
        style={{ aspectRatio: aspect }}
      >
        <div
          className="grain-overlay absolute inset-0 opacity-20 mix-blend-multiply"
          aria-hidden
        />
        {src ? (
          <img
            src={src}
            alt={alt ?? caption ?? "Foto kegiatan kelas"}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover sepia-[0.25] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <>
            <span
              className="absolute left-2.5 top-2.5 h-4 w-4 border-l border-t border-foreground/25"
              aria-hidden
            />
            <span
              className="absolute right-2.5 top-2.5 h-4 w-4 border-r border-t border-foreground/25"
              aria-hidden
            />
            <span
              className="absolute bottom-2.5 left-2.5 h-4 w-4 border-b border-l border-foreground/25"
              aria-hidden
            />
            <span
              className="absolute bottom-2.5 right-2.5 h-4 w-4 border-b border-r border-foreground/25"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <Camera className="size-5 text-foreground/35" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                Foto belum diarsip
              </span>
              <span className="font-mono text-[10px] text-foreground/35">{label}</span>
            </div>
          </>
        )}
      </div>
      {(caption || date) && (
        <figcaption className="mt-2 flex items-baseline justify-between gap-3">
          {caption && (
            <span
              className={
                onDark
                  ? "text-[13px] leading-snug text-primary-foreground/85"
                  : "text-[13px] leading-snug text-foreground/85"
              }
            >
              {caption}
            </span>
          )}
          {date && (
            <span
              className={
                onDark
                  ? "kicker shrink-0 text-[9px] tracking-[0.14em] text-primary-foreground/60"
                  : "kicker shrink-0 text-[9px] tracking-[0.14em]"
              }
            >
              {date}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
