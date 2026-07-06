import Link from "next/link";

type BlogPostCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export default function BlogPostCard({ slug, title, excerpt, date }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-2xl border border-black/13 bg-strat-bg3 p-7 transition-colors hover:border-strat-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-strat-accent"
    >
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-strat-muted">
        {date}
      </div>
      <h3 className="mb-2 font-sans text-lg font-semibold text-strat-text group-hover:text-strat-accent">
        {title}
      </h3>
      <p className="font-sans text-sm font-light text-strat-muted">{excerpt}</p>
    </Link>
  );
}
