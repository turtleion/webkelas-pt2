import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getArticleBySlug, type ArticleRow } from "@/lib/db";
import { pecahTanggal } from "@/lib/tanggal";
import { renderMarkdown } from "@/lib/markdown";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ArtikelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [article, setArticle] = useState<ArticleRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  usePageTitle(article?.title ?? t.articles.pageTitle);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setIsLoading(true);
    setError(null);
    getArticleBySlug(slug)
      .then((a) => {
        if (mounted) setArticle(a);
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Gagal memuat artikel");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [slug]);

  const td = article ? pecahTanggal(article.created_at.slice(0, 10)) : null;

  // Render article body as Markdown, same as Task descriptions (/tugas).
  const contentHtml = useMemo(() => {
    if (!article?.content) return null;
    return renderMarkdown(article.content);
  }, [article]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="konten" className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <Link
          to="/artikel"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t.articles.backToList}
        </Link>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="py-12 text-center font-display text-xl text-destructive">{error}</p>
        ) : !article ? (
          <p className="py-12 text-center font-display text-xl italic text-muted-foreground">
            {t.articles.empty}
          </p>
        ) : (
          <article>
            {article.cover_url && (
              <div className="mb-8 aspect-[16/9] overflow-hidden rounded-xl border border-border/60">
                <img
                  src={article.cover_url}
                  alt={article.title}
                  className="size-full object-cover"
                />
              </div>
            )}

            <div className="mb-6">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {td?.hari} {td?.bulanSingkat} {td?.tahun}
              </span>
              {article.is_pinned && (
                <span className="ml-3 rounded bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-accent">
                  {t.articles.pinned}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {article.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {article.description}
            </p>

            <div className="mt-8 border-t border-border/60 pt-8">
              {contentHtml ? (
                <div
                  className="prose prose-sm max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <p className="italic text-muted-foreground">
                  {t.articles.contentPlaceholder}
                </p>
              )}
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
