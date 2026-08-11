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

/** Current calendar date in US Eastern time as "YYYY-MM-DD" (America/New_York). */
export function etDateString(now: Date = new Date()): string {
  // en-CA locale renders as YYYY-MM-DD; timeZone pins it to the US market day.
  return now.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

/**
 * Refreshes cached prices for every position.
 *
 * `last_price` updates on every run. `prev_close` is the reference used for
 * Daily P&L and must stay FIXED for the whole trading day — otherwise the Daily
 * P&L jumps around when Yahoo's reported previousClose wobbles intraday (notably
 * for futures like GC=F). So prev_close is only (re)anchored when we cross into a
 * new ET trading day, tracked via the `prev_close_date` column.
 */
export async function refreshAllPrices(): Promise<{ updated: string[]; failed: string[] }> {
  const db = await getDb();
  const today = etDateString();
  const rows = rowsToObjects<{ ticker: string; prev_close: number | null; prev_close_date: string | null }>(
    db.exec("SELECT ticker, prev_close, prev_close_date FROM stocks"),
  );

  const updated: string[] = [];
  const failed: string[] = [];

  for (const row of rows) {
    const quote = await getQuote(row.ticker);
    if (!quote) {
      failed.push(row.ticker);
      continue;
    }

    // Anchor prev_close once per ET trading day (or if it was never set); hold
    // it fixed on every subsequent intraday refresh.
    const needsAnchor = row.prev_close_date !== today || row.prev_close == null;
    const prevClose = needsAnchor ? quote.previousClose : row.prev_close;
    const prevCloseDate = needsAnchor ? today : row.prev_close_date;

    db.run(
      "UPDATE stocks SET last_price = ?, prev_close = ?, prev_close_date = ?, full_name = ?, currency = ?, price_updated_at = datetime('now') WHERE ticker = ?",
      [quote.price, prevClose, prevCloseDate, quote.name, quote.currency, row.ticker],
    );
    updated.push(row.ticker);
  }

  await persist();
  return { updated, failed };
}
