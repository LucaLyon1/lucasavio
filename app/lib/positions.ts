import { readStore, writeStore } from "./store";

const FILE = "positions.json";

export type Position = {
  ticker: string;
  shares: number;
  avgCost: number;
  last: number;
};

export type PositionWithPerformance = Position & {
  marketValue: number;
  pnlPct: number;
};

export function withPerformance(position: Position): PositionWithPerformance {
  return {
    ...position,
    marketValue: position.shares * position.last,
    pnlPct: ((position.last - position.avgCost) / position.avgCost) * 100,
  };
}

export async function getPositions(): Promise<PositionWithPerformance[]> {
  const positions = await readStore<Position>(FILE);
  return positions.map(withPerformance);
}

export async function addPosition(position: Position): Promise<void> {
  const positions = await readStore<Position>(FILE);
  positions.push(position);
  await writeStore(FILE, positions);
}
