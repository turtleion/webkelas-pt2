import { usePageTitle } from "@/hooks/use-page-title";
import { useArticles } from "@/hooks/use-articles";
import { useTranslation } from "@/hooks/use-translation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { useOrganization } from "@/hooks/use-organization";
import { Loader2, Pin } from "lucide-react";
import { Link } from "react-router";
import { pecahTanggal } from "@/lib/tanggal";

export default function Artikel() {
  const { t } = useTranslation();
  usePageTitle(t.articles.pageTitle);
  const { data: orgData } = useOrganization();
  const { kelas } = orgData;
  const { data: articles, isLoading, error } = useArticles();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten" className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <PageHeader
          nomor="01"
          label={t.nav.articles}
          title={t.articles.heading}
          description={t.articles.description.replace("{kelas}", kelas.nama || "")}
        />

        {isLoading ? (
          <div className="mt-16 flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="mt-14 text-center font-display text-xl text-destructive">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-14 font-display text-xl italic text-muted-foreground">
            {t.articles.empty}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const td = pecahTanggal(article.created_at.slice(0, 10));
              return (
                <Link
                  key={article.id}
                  to={`/artikel/${article.slug}`}
                  className="group glass glass-hover flex flex-col overflow-hidden rounded-xl border border-border/60 transition-all"
                >
                  {article.cover_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                      <span className="font-display text-4xl font-bold text-primary/20">
                        {article.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {article.is_pinned && (
                      <span className="mb-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        <Pin className="size-3" />
                        {t.articles.pinned}
                      </span>
                    )}
                    <h3 className="font-display text-lg font-medium leading-snug transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {article.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {td.hari} {td.bulanSingkat} {td.tahun}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
