import type { Metadata } from "next";
import SectionHeading from "../components/section-heading";
import ArticleCard from "../components/article-card";
import Button from "../components/button";
import { fetchArticles } from "../lib/substack";

export const metadata: Metadata = {
  title: "Articles — Luca Savio",
};

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Articles" title="All articles" />

      {articles.length === 0 ? (
        <p className="max-w-xl text-sm text-ink/50">
          No articles published yet — check back soon, or read along on Substack directly.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.link} article={article} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button href="https://lucasavio.substack.com" variant="ghost">
          Read on Substack →
        </Button>
      </div>
    </div>
  );
}
