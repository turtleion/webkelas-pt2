import { FadeIn } from "./FadeIn";

type PageHeaderProps = {
  /** Nomor halaman arsip, mis. "02" */
  nomor: string;
  /** Label bagian, mis. "Anggota" */
  label: string;
  title: string;
  description?: string;
  meta?: string;
};

/** Kepala halaman bergaya arsip: kicker mono, judul serif besar, garis ganda. */
export function PageHeader({
  nomor,
  label,
  title,
  description,
  meta,
}: PageHeaderProps) {
  return (
    <FadeIn>
      <header>
        <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
          <span>Arsip kelas — Hal. {nomor}</span>
          <span aria-hidden>·</span>
          <span>{label}</span>
          {meta && (
            <>
              <span aria-hidden>·</span>
              <span>{meta}</span>
            </>
          )}
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="rule-double mt-10 md:mt-12" aria-hidden />
      </header>
    </FadeIn>
  );
}
