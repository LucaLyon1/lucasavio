import Card from "./card";
import type { Article } from "../lib/substack";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function ArticleCard({ article }: { article: Article }) {
  const date = formatDate(article.pubDate);

  return (
    <a href={article.link} target="_blank" rel="noreferrer">
      <Card className="flex h-full flex-col p-6 transition-colors hover:border-primary-600">
        <h3 className="text-lg font-semibold leading-tight text-ink">{article.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{article.excerpt}</p>
        <p className="mt-6 text-xs text-ink/50">
          {date ? `${date} · ` : ""}
          {article.readTime}
        </p>
      </Card>
    </a>
  );
}
