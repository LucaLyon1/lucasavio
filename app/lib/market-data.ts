export type Quote = {
  price: number;
  previousClose: number;
  name: string;
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
    const penceToPounds = meta.currency === "GBp" ? 100 : 1;

    const price = meta.regularMarketPrice / penceToPounds;
    const previousClose =
      (meta.chartPreviousClose ?? meta.previousClose ?? meta.regularMarketPrice) / penceToPounds;
    const name = meta.longName ?? meta.shortName ?? ticker;

    return { price, previousClose, name };
  } catch {
    return null;
  }
}

export function getLogoUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(ticker.toUpperCase())}.png`;
}
