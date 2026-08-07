import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { refreshAllPrices } from "../../lib/positions";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) {
    return Response.json({ error: "REFRESH_SECRET is not configured." }, { status: 500 });
  }

  const provided = request.headers.get("x-refresh-secret") ?? "";
  if (!safeEqual(provided, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await refreshAllPrices();

  revalidatePath("/portfolio");
  revalidatePath("/");

  return Response.json(result);
}
