export type Position = {
  ticker: string;
  shares: number;
  avgCost: number;
  last: number;
  marketValue: number;
  pnlPct: number;
};

export const positions: Position[] = [
  { ticker: "VTI", shares: 42, avgCost: 218.4, last: 261.12, marketValue: 10967.04, pnlPct: 19.6 },
  { ticker: "VXUS", shares: 120, avgCost: 54.1, last: 61.87, marketValue: 7424.4, pnlPct: 14.4 },
  { ticker: "BND", shares: 65, avgCost: 72.9, last: 70.15, marketValue: 4559.75, pnlPct: -3.8 },
  { ticker: "AAPL", shares: 18, avgCost: 165.2, last: 231.44, marketValue: 4165.92, pnlPct: 40.1 },
  { ticker: "MSFT", shares: 9, avgCost: 340.75, last: 421.03, marketValue: 3789.27, pnlPct: 23.6 },
];

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

export const articles: Article[] = [
  {
    slug: "reading-a-yield-curve",
    category: "Macro",
    title: "Reading a yield curve without the panic",
    excerpt:
      "What inversion actually signals, what it doesn't, and why the headline take is usually six months late.",
    date: "2026-06-02",
    readTime: "7 min",
  },
  {
    slug: "index-funds-plus-conviction",
    category: "Investing",
    title: "Index funds plus a little conviction",
    excerpt:
      "A case for keeping the core boring and reserving individual picks for the ideas you'd defend in writing.",
    date: "2026-04-18",
    readTime: "9 min",
  },
  {
    slug: "notes-on-writing-in-public",
    category: "Notes",
    title: "Notes on writing in public",
    excerpt:
      "Two years of publishing on a schedule — what it changed about how I think, not just how I write.",
    date: "2026-02-27",
    readTime: "5 min",
  },
];

export type Book = {
  title: string;
  author: string;
  category: string;
  rating: number;
};

export const books: Book[] = [
  { title: "The Psychology of Money", author: "Morgan Housel", category: "Investing", rating: 5 },
  { title: "Poor Charlie's Almanack", author: "Charles T. Munger", category: "Investing", rating: 5 },
  { title: "The Making of a Manager", author: "Julie Zhuo", category: "Work", rating: 4 },
  { title: "Sapiens", author: "Yuval Noah Harari", category: "History", rating: 4 },
  { title: "Deep Work", author: "Cal Newport", category: "Focus", rating: 4 },
];
