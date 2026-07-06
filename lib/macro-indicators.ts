import { fetchFredSeries, type SeriesPoint } from "./fred";
import { getShillerData } from "./shiller";

// A floor far earlier than any series actually starts — FRED just returns whatever's
// available from there, so this always pulls each series' full history.
const EARLIEST = "1800-01-01";

export type Indicator = {
  id: string;
  label: string;
  unit: string;
  asOf: string;
  points: SeriesPoint[];
  current: number;
  /** % of historical readings at or below the current value — computed, not editorialized. */
  percentileRank: number;
  source: string;
  sourceUrl: string;
  caveat?: string;
};

export type Band = { start: string; end: string };

function percentileRank(values: number[], current: number): number {
  const countBelowOrEqual = values.filter((v) => v <= current).length;
  return Math.round((countBelowOrEqual / values.length) * 100);
}

function fromSeries(points: SeriesPoint[]): { current: number; asOf: string; percentileRank: number } {
  const last = points[points.length - 1];
  return {
    current: last.value,
    asOf: last.date,
    percentileRank: percentileRank(
      points.map((p) => p.value),
      last.value,
    ),
  };
}

/** For each point in `cadence`, find the latest `series` value on or before that date. Both must be ascending by date. */
function alignLatestOnOrBefore(cadence: SeriesPoint[], series: SeriesPoint[]): (number | null)[] {
  let j = -1;
  const result: (number | null)[] = [];
  for (const point of cadence) {
    while (j + 1 < series.length && series[j + 1].date <= point.date) j++;
    result.push(j >= 0 ? series[j].value : null);
  }
  return result;
}

function ratioSeries(cadence: SeriesPoint[], series: SeriesPoint[], scale = 1): SeriesPoint[] {
  const aligned = alignLatestOnOrBefore(cadence, series);
  const points: SeriesPoint[] = [];
  cadence.forEach((point, i) => {
    const value = aligned[i];
    if (value != null) points.push({ date: point.date, value: (value / point.value) * scale });
  });
  return points;
}

function indexTo100(points: SeriesPoint[]): SeriesPoint[] {
  const base = points[0].value;
  return points.map((p) => ({ date: p.date, value: (p.value / base) * 100 }));
}

export async function getShillerCapeIndicator(): Promise<Indicator> {
  const { cape: points } = await getShillerData();
  return {
    id: "cape",
    label: "Shiller CAPE",
    unit: "×",
    points,
    source: "Robert Shiller, Yale University",
    sourceUrl: "http://www.econ.yale.edu/~shiller/data.htm",
    ...fromSeries(points),
  };
}

export async function getBuffettIndicator(): Promise<Indicator> {
  // Wilshire pulled its FRED license entirely (WILL5000PRFC no longer exists), so the
  // numerator is the Fed's own Z.1 aggregate market value of publicly traded US equities.
  const [equities, gdp] = await Promise.all([
    fetchFredSeries("BOGZ1LM883164115Q", { observationStart: EARLIEST }),
    fetchFredSeries("GDP", { observationStart: EARLIEST }),
  ]);
  const equitiesInBillions = equities.map((p) => ({ date: p.date, value: p.value / 1000 }));
  const points = ratioSeries(gdp, equitiesInBillions, 100);
  return {
    id: "buffett",
    label: "Buffett Indicator",
    unit: "%",
    points,
    source: "FRED (BOGZ1LM883164115Q ÷ GDP, Fed Z.1)",
    sourceUrl: "https://fred.stlouisfed.org/series/BOGZ1LM883164115Q",
    ...fromSeries(points),
  };
}

export async function getTobinsQ(): Promise<Indicator> {
  const [equities, netWorth] = await Promise.all([
    fetchFredSeries("NCBEILQ027S", { observationStart: EARLIEST }),
    fetchFredSeries("TNWMVBSNNCB", { observationStart: EARLIEST }),
  ]);
  const points = ratioSeries(netWorth, equities, 1);
  return {
    id: "tobins-q",
    label: "Tobin's Q",
    unit: "×",
    points,
    source: "FRED (NCBEILQ027S ÷ TNWMVBSNNCB, Fed Z.1)",
    sourceUrl: "https://fred.stlouisfed.org/series/NCBEILQ027S",
    ...fromSeries(points),
  };
}

export async function getYieldCurve(): Promise<Indicator> {
  const points = await fetchFredSeries("T10Y2Y", { observationStart: EARLIEST });
  return {
    id: "yield-curve",
    label: "Yield curve (10Y − 2Y)",
    unit: "%",
    points,
    source: "FRED (T10Y2Y)",
    sourceUrl: "https://fred.stlouisfed.org/series/T10Y2Y",
    ...fromSeries(points),
  };
}

export async function getSpToM2(): Promise<Indicator> {
  // FRED's own SP500 series only goes back to ~2016 under S&P's license; Shiller's
  // monthly S&P Composite price (same underlying index family) goes back to 1871,
  // so the real constraint here is M2SL's own history, starting 1959.
  const [{ sp500 }, m2] = await Promise.all([
    getShillerData(),
    fetchFredSeries("M2SL", { observationStart: EARLIEST }),
  ]);
  const points = indexTo100(ratioSeries(m2, sp500));
  return {
    id: "sp500-m2",
    label: "S&P 500 / M2",
    unit: "",
    points,
    source: "Robert Shiller (S&P Composite price) ÷ FRED M2SL, indexed to 100 at series start",
    sourceUrl: "https://fred.stlouisfed.org/series/M2SL",
    caveat: "Bounded by M2SL's own history, which FRED provides back to 1959.",
    ...fromSeries(points),
  };
}

export async function getVix(): Promise<Indicator> {
  const points = await fetchFredSeries("VIXCLS", { observationStart: EARLIEST });
  return {
    id: "vix",
    label: "VIX",
    unit: "",
    points,
    source: "FRED (VIXCLS)",
    sourceUrl: "https://fred.stlouisfed.org/series/VIXCLS",
    ...fromSeries(points),
  };
}

export async function getHighYieldSpread(): Promise<Indicator> {
  const points = await fetchFredSeries("BAMLH0A0HYM2");
  return {
    id: "hy-spread",
    label: "High-yield credit spread",
    unit: "%",
    points,
    source: "FRED (BAMLH0A0HYM2, ICE BofA US High Yield OAS)",
    sourceUrl: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2",
    caveat:
      "FRED now restricts ICE BofA index series to a rolling ~3-year window under its licensing terms; full history since 1996 requires a licensed provider (ICE, Bloomberg).",
    ...fromSeries(points),
  };
}

export async function getRecessionBands(): Promise<Band[]> {
  const points = await fetchFredSeries("USREC", { observationStart: EARLIEST });
  const bands: Band[] = [];
  let start: string | null = null;
  points.forEach((point, i) => {
    const inRecession = point.value === 1;
    if (inRecession && start === null) start = point.date;
    const next = points[i + 1];
    const endsHere = inRecession && (!next || next.value !== 1);
    if (endsHere && start !== null) {
      bands.push({ start, end: point.date });
      start = null;
    }
  });
  return bands;
}
