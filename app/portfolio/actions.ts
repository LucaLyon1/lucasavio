"use server";

import { revalidatePath } from "next/cache";
import { addPosition } from "../lib/positions";

export type PositionFormState = { error?: string };

export async function addPositionAction(
  _prevState: PositionFormState,
  formData: FormData,
): Promise<PositionFormState> {
  const ticker = String(formData.get("ticker") ?? "").trim().toUpperCase();
  const shares = Number(formData.get("shares"));
  const avgCost = Number(formData.get("avgCost"));
  const last = Number(formData.get("last"));

  if (!ticker) return { error: "Ticker is required." };
  if (!Number.isFinite(shares) || shares <= 0) {
    return { error: "Shares must be a positive number." };
  }
  if (!Number.isFinite(avgCost) || avgCost <= 0) {
    return { error: "Average cost must be a positive number." };
  }
  if (!Number.isFinite(last) || last <= 0) {
    return { error: "Current price must be a positive number." };
  }

  await addPosition({ ticker, shares, avgCost, last });
  revalidatePath("/portfolio");
  revalidatePath("/");

  return {};
}
