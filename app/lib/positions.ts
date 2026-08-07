import { getDb, persist, rowsToObjects } from "./db";
import { getQuote, getLogoUrl } from "./market-data";

export type Stock = {
  ticker: string;
  shares: number;
  avgCost: number;
};

export type StockWithPerformance = Stock & {
  fullName: string;
  logo: string;
  price: number;
  positionSize: number;
  portfolioPct: number;
  dailyPnl: number;
  dailyPnlPct: number;
  totalPnl: number;
  totalPnlPct: number;
};

type StockRow = { ticker: string; shares: number; avg_cost: number };

async function getStocks(): Promise<Stock[]> {
  const db = await getDb();
  const rows = rowsToObjects<StockRow>(db.exec("SELECT ticker, shares, avg_cost FROM stocks ORDER BY ticker"));
  return rows.map((row) => ({ ticker: row.ticker, shares: row.shares, avgCost: row.avg_cost }));
}

export async function getPositions(): Promise<StockWithPerformance[]> {
  const stocks = await getStocks();

  const withQuotes = await Promise.all(
    stocks.map(async (stock) => {
      const quote = await getQuote(stock.ticker);
      const price = quote?.price ?? stock.avgCost;
      const previousClose = quote?.previousClose ?? price;
      const fullName = quote?.name ?? stock.ticker;

      const positionSize = stock.shares * price;
      const dailyPnl = stock.shares * (price - previousClose);
      const totalPnl = stock.shares * (price - stock.avgCost);

      return {
        ...stock,
        fullName,
        logo: getLogoUrl(stock.ticker),
        price,
        positionSize,
        dailyPnl,
        dailyPnlPct: previousClose ? ((price - previousClose) / previousClose) * 100 : 0,
        totalPnl,
        totalPnlPct: stock.avgCost ? ((price - stock.avgCost) / stock.avgCost) * 100 : 0,
      };
    }),
  );

  const totalValue = withQuotes.reduce((sum, position) => sum + position.positionSize, 0);

  return withQuotes.map((position) => ({
    ...position,
    portfolioPct: totalValue ? (position.positionSize / totalValue) * 100 : 0,
  }));
}

export async function addPosition(stock: Stock): Promise<void> {
  const db = await getDb();
  try {
    db.run("INSERT INTO stocks (ticker, shares, avg_cost) VALUES (?, ?, ?)", [
      stock.ticker,
      stock.shares,
      stock.avgCost,
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      throw new Error(`You already have a position in ${stock.ticker}.`);
    }
    throw error;
  }
  await persist();
}
