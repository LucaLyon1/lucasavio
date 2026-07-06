import { cache } from "react";
import { unstable_cache } from "next/cache";
import * as XLSX from "xlsx";
import type { SeriesPoint } from "./fred";

const IE_DATA_URL = "http://www.econ.yale.edu/~shiller/data/ie_data.xls";

// Fixed layout of Shiller's "Data" sheet: header row 7, data from row 8 (0-indexed).
const HEADER_ROW = 7;
const DATA_START_ROW = 8;
const COL_DATE = 0;
const COL_PRICE = 1;
const COL_CAPE = 12;

type ShillerData = {
  /** Nominal monthly S&P Composite price, since 1871 — used as a long-run stand-in for FRED's
   *  SP500 (which only goes back to ~2016 under S&P's license). */
  sp500: SeriesPoint[];
  cape: SeriesPoint[];
};

function decodeShillerDate(raw: number): string {
  const year = Math.floor(raw);
  const month = Math.round((raw - year) * 100);
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

// The xls file is ~2MB, over Next's per-entry fetch-cache size cap, so it's fetched
// uncached here and only the small parsed result below is cached.
async function fetchAndParse(): Promise<ShillerData> {
  const res = await fetch(IE_DATA_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch Shiller data: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets["Data"];
  if (!sheet) {
    throw new Error("Shiller ie_data.xls: 'Data' sheet not found");
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true });

  const header = rows[HEADER_ROW];
  if (header?.[COL_CAPE] !== "CAPE" || header?.[COL_PRICE] !== "P") {
    throw new Error(
      `Shiller ie_data.xls layout changed: expected "P"/"CAPE" at header row ${HEADER_ROW}, cols ${COL_PRICE}/${COL_CAPE}, got ${JSON.stringify(header)}`,
    );
  }

  const sp500: SeriesPoint[] = [];
  const cape: SeriesPoint[] = [];
  for (let i = DATA_START_ROW; i < rows.length; i++) {
    const row = rows[i];
    const date = row?.[COL_DATE];
    if (typeof date !== "number") continue;
    const dateStr = decodeShillerDate(date);

    const price = row?.[COL_PRICE];
    if (typeof price === "number") sp500.push({ date: dateStr, value: price });

    const capeValue = row?.[COL_CAPE];
    if (typeof capeValue === "number") cape.push({ date: dateStr, value: capeValue });
  }

  return { sp500, cape };
}

export const getShillerData = cache(
  unstable_cache(fetchAndParse, ["shiller-data"], { revalidate: 86400 }),
);
