export type Quote = {
  price: number;
  previousClose: number;
  name: string;
  currency: string;
};

type YahooChartResponse = {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
        longName?: string;
        shortName?: string;
        currency?: string;
      };
    }> | null;
  };
};

export async function getQuote(ticker: string): Promise<Quote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as YahooChartResponse;
    const meta = data.chart.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    // Yahoo quotes some London-listed stocks in pence (currency "GBp"),
    // not pounds. Normalize to the major unit so P&L against a GBP cost basis
    // is correct. GBp = pence; divide by 100 to get GBP.
    const isPence = meta.currency === "GBp";
    const scale = isPence ? 100 : 1;
    const currency = isPence ? "GBP" : (meta.currency ?? "USD");

    const price = meta.regularMarketPrice / scale;
    const previousClose =
      (meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice) / scale;
    const name = meta.longName ?? meta.shortName ?? ticker;

    return { price, previousClose, name, currency };
  } catch {
    return null;
  }
}

export function getLogoUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(ticker.toUpperCase())}.png`;
}

type WikipediaSummaryResponse = {
  type?: string;
  extract?: string;
};

const SUMMARY_MAX_LENGTH = 220;

/** Truncates to a full sentence (or word) at or before `max` chars, so the card blurb never cuts off mid-word. */
function truncateSummary(text: string, max: number): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const sentenceEnd = truncated.lastIndexOf(". ");
  if (sentenceEnd > max * 0.4) return `${truncated.slice(0, sentenceEnd + 1)}`;
  const wordEnd = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, wordEnd > 0 ? wordEnd : max)}…`;
}

/**
 * Brief company description for the portfolio card, sourced from Wikipedia's
 * summary API (keyed by company name, not ticker — futures/indices like
 * "Gold Dec 26" won't have an article and just 404). Returns null if unavailable.
 */
export async function getCompanySummary(companyName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(companyName.replace(/ /g, "_"))}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 * 60 * 24 * 7 },
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as WikipediaSummaryResponse;
    if (data.type === "disambiguation" || !data.extract) return null;

    return truncateSummary(data.extract, SUMMARY_MAX_LENGTH);
  } catch {
    return null;
  }
}
