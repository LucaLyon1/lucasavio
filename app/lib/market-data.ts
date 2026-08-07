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

/**
 * Live FX rates expressed as "USD per 1 unit of the currency" (e.g. GBP -> ~1.27).
 * USD maps to 1. Unknown/failed lookups fall back to 1 so the app degrades to
 * treating the amount as USD rather than crashing.
 */
export async function getUsdRates(currencies: string[]): Promise<Record<string, number>> {
  const unique = Array.from(new Set(currencies.map((c) => c.toUpperCase())));
  const rates: Record<string, number> = { USD: 1 };

  await Promise.all(
    unique
      .filter((c) => c !== "USD")
      .map(async (currency) => {
        const quote = await getQuote(`${currency}USD=X`);
        rates[currency] = quote?.price && quote.price > 0 ? quote.price : 1;
      }),
  );

  return rates;
}

export function getLogoUrl(ticker: string): string {
  return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(ticker.toUpperCase())}.png`;
}
