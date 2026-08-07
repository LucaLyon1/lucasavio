import { getDb, persist, rowsToObjects } from "./db";
import { getQuote, getLogoUrl, getUsdRates } from "./market-data";

export type Stock = {
  ticker: string;
  shares: number;
  avgCost: number;
};

type CachedStock = Stock & {
  lastPrice: number | null;
  prevClose: number | null;
  fullName: string | null;
  priceUpdatedAt: string | null;
  currency: string;
};

export type StockWithPerformance = Stock & {
  fullName: string;
  logo: string;
  currency: string; // native trading currency (for price display)
  price: number; // in native currency
  positionSize: number; // converted to USD
  portfolioPct: number;
  dailyPnl: number; // USD
  dailyPnlPct: number;
  totalPnl: number; // USD
  totalPnlPct: number;
};

type StockRow = {
  ticker: string;
  shares: number;
  avg_cost: number;
  last_price: number | null;
  prev_close: number | null;
  full_name: string | null;
  price_updated_at: string | null;
  currency: string | null;
};

async function getStocks(): Promise<CachedStock[]> {
  const db = await getDb();
  const rows = rowsToObjects<StockRow>(
    db.exec(
      "SELECT ticker, shares, avg_cost, last_price, prev_close, full_name, price_updated_at, currency FROM stocks ORDER BY ticker",
    ),
  );
  return rows.map((row) => ({
    ticker: row.ticker,
    shares: row.shares,
    avgCost: row.avg_cost,
    lastPrice: row.last_price,
    prevClose: row.prev_close,
    fullName: row.full_name,
    priceUpdatedAt: row.price_updated_at,
    currency: row.currency ?? "USD",
  }));
}

export async function getPositions(): Promise<StockWithPerformance[]> {
  const stocks = await getStocks();
  const rates = await getUsdRates(stocks.map((s) => s.currency));

  const withPrices = stocks.map((stock) => {
    const price = stock.lastPrice ?? stock.avgCost;
    const previousClose = stock.prevClose ?? price;
    const fullName = stock.fullName ?? stock.ticker;
    const fx = rates[stock.currency.toUpperCase()] ?? 1; // USD per 1 unit of currency

    // Money amounts converted to USD so the portfolio total is meaningful.
    const positionSize = stock.shares * price * fx;
    const dailyPnl = stock.shares * (price - previousClose) * fx;
    const totalPnl = stock.shares * (price - stock.avgCost) * fx;

    return {
      ticker: stock.ticker,
      shares: stock.shares,
      avgCost: stock.avgCost,
      fullName,
      logo: getLogoUrl(stock.ticker),
      currency: stock.currency,
      price, // native currency, for the Price column
      positionSize,
      dailyPnl,
      // Percentages are currency-agnostic (ratio of same-currency values).
      dailyPnlPct: previousClose ? ((price - previousClose) / previousClose) * 100 : 0,
      totalPnl,
      totalPnlPct: stock.avgCost ? ((price - stock.avgCost) / stock.avgCost) * 100 : 0,
    };
  });

  const totalValue = withPrices.reduce((sum, position) => sum + position.positionSize, 0);

  return withPrices.map((position) => ({
    ...position,
    portfolioPct: totalValue ? (position.positionSize / totalValue) * 100 : 0,
  }));
}

/** Oldest cached price timestamp across all positions, so the UI can show how stale the data is. */
export async function getPricesAsOf(): Promise<string | null> {
  const db = await getDb();
  const rows = rowsToObjects<{ oldest: string | null }>(
    db.exec("SELECT MIN(price_updated_at) as oldest FROM stocks"),
  );
  return rows[0]?.oldest ?? null;
}

/** `price_updated_at` is a UTC "YYYY-MM-DD HH:MM:SS" string from SQLite's `datetime('now')`. */
export function describePricesAsOf(raw: string | null): string {
  if (!raw) return "Prices haven't been fetched yet.";
  const date = new Date(`${raw.replace(" ", "T")}Z`);
  return `Prices as of ${date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}.`;
}

export async function addPosition(
  stock: Stock & {
    price: number;
    previousClose: number;
    fullName: string;
    currency: string;
  },
): Promise<void> {
  const db = await getDb();
  try {
    db.run(
      "INSERT INTO stocks (ticker, shares, avg_cost, last_price, prev_close, full_name, currency, price_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))",
      [
        stock.ticker,
        stock.shares,
        stock.avgCost,
        stock.price,
        stock.previousClose,
        stock.fullName,
        stock.currency,
      ],
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      throw new Error(`You already have a position in ${stock.ticker}.`);
    }
    throw error;
  }
  await persist();
}

export async function updatePosition(
  ticker: string,
  updates: {
    shares: number;
    avgCost: number;
    price: number;
    previousClose: number;
    fullName: string;
    currency: string;
  },
): Promise<void> {
  const db = await getDb();
  db.run(
    "UPDATE stocks SET shares = ?, avg_cost = ?, last_price = ?, prev_close = ?, full_name = ?, currency = ?, price_updated_at = datetime('now') WHERE ticker = ?",
    [
      updates.shares,
      updates.avgCost,
      updates.price,
      updates.previousClose,
      updates.fullName,
      updates.currency,
      ticker,
    ],
  );
  await persist();
}

export async function deletePosition(ticker: string): Promise<void> {
  const db = await getDb();
  db.run("DELETE FROM stocks WHERE ticker = ?", [ticker]);
  await persist();
}

/** Refreshes the cached price for every position. Meant to run once daily at US market close. */
export async function refreshAllPrices(): Promise<{ updated: string[]; failed: string[] }> {
  const db = await getDb();
  const tickers = rowsToObjects<{ ticker: string }>(db.exec("SELECT ticker FROM stocks")).map(
    (row) => row.ticker,
  );

  const updated: string[] = [];
  const failed: string[] = [];

  for (const ticker of tickers) {
    const quote = await getQuote(ticker);
    if (!quote) {
      failed.push(ticker);
      continue;
    }
    db.run(
      "UPDATE stocks SET last_price = ?, prev_close = ?, full_name = ?, currency = ?, price_updated_at = datetime('now') WHERE ticker = ?",
      [quote.price, quote.previousClose, quote.name, quote.currency, ticker],
    );
    updated.push(ticker);
  }

  await persist();
  return { updated, failed };
}
