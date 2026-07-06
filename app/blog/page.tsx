import SectionEyebrow from "@/components/section-eyebrow";
import BlogPostCard from "@/components/blog-post-card";
import { getBlogPosts, formatPostDate } from "@/lib/substack";

export const metadata = {
  title: "Blog — Luca Savio",
  description: "Essays on writing, cinema, and the tools I build, cross-posted from Substack.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-275 px-6 py-24 sm:px-8">
      <SectionEyebrow>Writing</SectionEyebrow>
      <h1 className="max-w-2xl font-sans text-4xl font-bold text-strat-text sm:text-5xl">
        Essays and notes
      </h1>
      <p className="mt-6 max-w-xl font-sans text-base font-light text-strat-muted">
        Posts from my{" "}
        <a
          href="https://lucasavio.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-strat-accent hover:underline"
        >
          Substack
        </a>
        , mirrored here.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 font-sans text-sm font-light text-strat-muted">
          No posts available right now.{" "}
          <a
            href="https://lucasavio.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-strat-accent hover:underline"
          >
            Read on Substack instead.
          </a>
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={formatPostDate(post.pubDate)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
