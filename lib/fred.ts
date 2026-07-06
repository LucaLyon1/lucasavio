export type SeriesPoint = { date: string; value: number };

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

/**
 * Fetches a single FRED series. Throws on missing API key or a bad response —
 * callers are expected to catch this (e.g. via Promise.allSettled) and show a
 * "data unavailable" state rather than fabricating numbers.
 */
export async function fetchFredSeries(
  seriesId: string,
  { revalidate = 86400, observationStart }: { revalidate?: number; observationStart?: string } = {},
): Promise<SeriesPoint[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY is not set");
  }

  const url = new URL(FRED_BASE);
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  if (observationStart) url.searchParams.set("observation_start", observationStart);

  const res = await fetch(url.toString(), { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`FRED request failed for ${seriesId}: ${res.status}`);
  }

  const json = (await res.json()) as { observations?: { date: string; value: string }[] };
  const observations = json.observations ?? [];

  return observations
    .filter((obs) => obs.value !== ".")
    .map((obs) => ({ date: obs.date, value: Number(obs.value) }));
}
