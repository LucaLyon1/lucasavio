"use server";

import { revalidatePath } from "next/cache";
import { addPosition } from "../lib/positions";
import { getQuote } from "../lib/market-data";
import { isAuthenticated } from "../lib/auth";

export type PositionFormState = { error?: string };

export async function addPositionAction(
  _prevState: PositionFormState,
  formData: FormData,
): Promise<PositionFormState> {
  if (!(await isAuthenticated())) {
    return { error: "You must be signed in to do that." };
  }

  const ticker = String(formData.get("ticker") ?? "").trim().toUpperCase();
  const shares = Number(formData.get("shares"));
  const avgCost = Number(formData.get("avgCost"));

  if (!ticker) return { error: "Ticker is required." };
  if (!Number.isFinite(shares) || shares <= 0) {
    return { error: "Shares must be a positive number." };
  }
  if (!Number.isFinite(avgCost) || avgCost <= 0) {
    return { error: "Average cost must be a positive number." };
  }

  const quote = await getQuote(ticker);
  if (!quote) return { error: `Could not find a quote for "${ticker}". Check the ticker.` };

  try {
    await addPosition({ ticker, shares, avgCost });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to add position." };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");

  return {};
}
