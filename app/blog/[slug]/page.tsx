import { notFound } from "next/navigation";
import SectionEyebrow from "@/components/section-eyebrow";
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
    <div className="mx-auto max-w-175 px-6 py-24 sm:px-8">
      <SectionEyebrow>{formatPostDate(post.pubDate)}</SectionEyebrow>
      <h1 className="font-sans text-3xl font-bold text-strat-text">{post.title}</h1>

      <div
        className="substack-content mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="mt-12 border-t border-black/7 pt-6">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm font-medium text-strat-accent hover:underline"
        >
          Read on Substack &amp; leave a comment →
        </a>
      </div>
    </div>
  );
}
