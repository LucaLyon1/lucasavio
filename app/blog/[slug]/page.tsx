import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, getBlogPosts, formatPostDate } from "@/lib/substack";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Luca Savio`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-160 px-6 py-16 sm:px-8">
      <Link
        href="/"
        className="font-sans text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back
      </Link>

      <div className="mt-8 mb-2 font-sans text-xs uppercase tracking-widest text-muted">
        {formatPostDate(post.pubDate)}
      </div>
      <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">{post.title}</h1>

      <div
        className="substack-content mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-12 border-t border-border pt-6">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm font-medium text-accent hover:underline"
        >
          Read on Substack &amp; leave a comment →
        </a>
      </div>
    </div>
  );
}
