import Card from "./card";
import SectionHeading from "./section-heading";
import Button from "./button";
import { articles } from "../lib/data";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function Articles() {
  return (
    <section id="articles" className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Articles" />

      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.slug} className="flex flex-col p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
              {article.category}
            </p>
            <h3 className="mt-3 text-lg font-semibold leading-tight text-ink">{article.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{article.excerpt}</p>
            <p className="mt-6 text-xs text-ink/50">
              {formatDate(article.date)} · {article.readTime}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button href="#" variant="ghost">
          All articles →
        </Button>
      </div>
    </section>
  );
}
