"use server";

import { revalidatePath } from "next/cache";
import { addPosition, deletePosition, updatePosition } from "../lib/positions";
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
    await addPosition({
      ticker,
      shares,
      avgCost,
      price: quote.price,
      previousClose: quote.previousClose,
      fullName: quote.name,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to add position." };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");

  return {};
}

export async function updatePositionAction(
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

  try {
    await updatePosition(ticker, { shares, avgCost });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update position." };
  }

  revalidatePath("/portfolio");
  revalidatePath("/");

  return {};
}

export async function deletePositionAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;

  const ticker = String(formData.get("ticker") ?? "").trim().toUpperCase();
  if (!ticker) return;

  await deletePosition(ticker);

  revalidatePath("/portfolio");
  revalidatePath("/");
}
