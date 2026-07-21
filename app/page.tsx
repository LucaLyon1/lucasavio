import BlogPostCard from "@/components/blog-post-card";
import { getBlogPosts, formatPostDate } from "@/lib/substack";

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-160 px-6 py-16 sm:px-8">
      {posts.length === 0 ? (
        <p className="font-serif text-base text-muted">
          No posts available right now.{" "}
          <a
            href="https://lucasavio.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Read on Substack instead.
          </a>
        </p>
      ) : (
        <div>
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
