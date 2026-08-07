import SectionHeading from "./section-heading";
import Button from "./button";
import ArticleCard from "./article-card";
import type { Article } from "../lib/substack";

export default function Articles({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Articles" />

      {articles.length === 0 ? (
        <p className="text-sm text-ink/50">No articles published yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.link} article={article} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Button href="/articles" variant="ghost">
          All articles →
        </Button>
      </div>
    </section>
  );
}
