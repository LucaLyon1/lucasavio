const FEED_URL = "https://lucasavio.substack.com/feed";
const PUBLICATION_URL = "https://lucasavio.substack.com";

export type BlogPost = {
  slug: string;
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  contentHtml: string;
  imageUrl?: string;
};

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) return null;
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1] : raw;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function slugFromLink(link: string): string {
  const match = link.match(/\/p\/([^/?#]+)/);
  return match ? match[1] : link;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items.map((item) => {
    const link = extractTag(item, "link") ?? PUBLICATION_URL;
    const imageMatch = item.match(/<enclosure url="([^"]+)"/);

    return {
      slug: slugFromLink(link),
      title: decodeEntities(extractTag(item, "title") ?? "Untitled"),
      link,
      pubDate: extractTag(item, "pubDate") ?? "",
      excerpt: decodeEntities(extractTag(item, "description") ?? ""),
      contentHtml: extractTag(item, "content:encoded") ?? "",
      imageUrl: imageMatch?.[1],
    };
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export function formatPostDate(pubDate: string): string {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
