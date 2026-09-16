import { useTranslation } from "@/hooks/use-translation";
import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Layout dokumen legal (ToS / Privacy) — halaman public, gaya arsip.
 * Dipakai bersama oleh /agreements/tos dan /agreements/privacy.
 */
export function AgreementLayout({
  nomor,
  label,
  title,
  intro,
  children,
}: {
  nomor: string;
  label: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-14">
      <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
        <span>Arsip kelas — Hal. {nomor}</span>
        <span aria-hidden>·</span>
        <span>{label}</span>
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {t.agreements.updatedLabel.replace(
          "{date}",
          new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date("2026-09-16")),
        )}
      </p>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        {intro}
      </p>
      <div className="rule-double mt-8" aria-hidden />

      <article className="mt-8 flex flex-col gap-7">{children}</article>

      <div className="mt-12 border-t border-border/70 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent underline underline-offset-4 hover:text-accent/80"
        >
          ← {t.agreements.backHome}
        </Link>
      </div>
    </main>
  );
}

export function AgreementSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section>
      <h2 className="font-display text-lg font-medium tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-foreground/80">
        {body}
      </p>
    </section>
  );
}