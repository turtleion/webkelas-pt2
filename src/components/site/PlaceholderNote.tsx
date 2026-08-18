import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Catatan tipis bahwa data pada halaman ini masih contoh (placeholder). */
export function PlaceholderNote({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "glass flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4",
        className,
      )}
    >
      <span className="kicker shrink-0 text-[9px] text-accent">Catatan</span>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {children ??
          "Data pada halaman ini masih contoh (placeholder) dan belum menggambarkan data asli kelas. Ganti dengan data sebenarnya sebelum dipublikasikan."}
      </p>
    </aside>
  );
}
