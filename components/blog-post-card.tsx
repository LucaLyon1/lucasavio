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
      className="group block border-b border-border py-8 first:pt-0 last:border-b-0"
    >
      <div className="mb-2 font-sans text-xs uppercase tracking-widest text-muted">
        {date}
      </div>
      <h2 className="font-serif text-2xl font-semibold text-ink group-hover:text-accent">
        {title}
      </h2>
      <p className="mt-2 font-serif text-base text-muted">{excerpt}</p>
    </Link>
  );
}
