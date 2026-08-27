import { useEffect, useState, useCallback } from "react";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  type ArticleRow,
} from "@/lib/db";

export function useArticles() {
  const [data, setData] = useState<ArticleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getArticles(true);
      setData(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchArticles();
  }, [fetchArticles]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchArticles,
    getBySlug: getArticleBySlug,
    create: createArticle,
    update: updateArticle,
    remove: deleteArticle,
  };
}
