export type BookLookup = {
  photo: string | null;
  summary: string | null;
  categories: string[];
};

export type BookSuggestion = {
  title: string;
  author: string;
  photo: string | null;
  summary: string | null;
  categories: string[];
};

type GoogleBooksResponse = {
  items?: Array<{
    volumeInfo?: {
      title?: string;
      authors?: string[];
      description?: string;
      categories?: string[];
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
  }>;
};

async function queryVolumes(q: string, maxResults: number): Promise<BookSuggestion[]> {
  try {
    const params = new URLSearchParams({ q, maxResults: String(maxResults) });
    if (process.env.GOOGLE_BOOKS_API_KEY) {
      params.set("key", process.env.GOOGLE_BOOKS_API_KEY);
    }

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) {
      console.warn(`Google Books lookup failed (${res.status}): ${await res.text()}`);
      return [];
    }

    const data = (await res.json()) as GoogleBooksResponse;
    return (data.items ?? [])
      .map((item) => {
        const info = item.volumeInfo ?? {};
        const thumbnail = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;
        // Google serves cover thumbnails over http; upgrade to https to avoid mixed-content blocks.
        return {
          title: info.title ?? "",
          author: info.authors?.join(", ") ?? "",
          photo: thumbnail ? thumbnail.replace(/^http:/, "https:") : null,
          summary: info.description ?? null,
          categories: info.categories ?? [],
        };
      })
      .filter((suggestion) => suggestion.title);
  } catch {
    return [];
  }
}

export async function lookupBook(title: string, author: string): Promise<BookLookup | null> {
  const query = [`intitle:${title}`, author ? `inauthor:${author}` : null].filter(Boolean).join("+");
  const [match] = await queryVolumes(query, 1);
  return match
    ? { photo: match.photo, summary: match.summary, categories: match.categories }
    : null;
}

export async function searchBooks(query: string): Promise<BookSuggestion[]> {
  if (query.trim().length < 3) return [];
  return queryVolumes(query, 5);
}
