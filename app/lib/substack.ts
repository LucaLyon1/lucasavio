const FEED_URL = "https://lucasavio.substack.com/feed";
const WORDS_PER_MINUTE = 200;

export type Article = {
  title: string;
  link: string;
  excerpt: string;
  pubDate: string;
  readTime: string;
};

function extractTag(block: string, tag: string): string | null {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i"));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return plain ? plain[1].trim() : null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function excerptFrom(text: string, maxLength = 220): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

function readTimeFrom(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

    return items.map((block) => {
      const title = decodeEntities(extractTag(block, "title") ?? "Untitled");
      const link = (extractTag(block, "link") ?? "").trim();
      const pubDate = extractTag(block, "pubDate") ?? "";
      const description = extractTag(block, "description") ?? "";
      const content = extractTag(block, "content:encoded") ?? description;

      const plainDescription = stripHtml(description);
      const plainContent = stripHtml(content);

      return {
        title,
        link,
        excerpt: excerptFrom(plainDescription || plainContent),
        pubDate,
        readTime: readTimeFrom(plainContent || plainDescription),
      };
    });
  } catch {
    return [];
  }
}
