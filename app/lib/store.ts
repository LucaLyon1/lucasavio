import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function readStore<T>(filename: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

export async function writeStore<T>(filename: string, data: T[]): Promise<void> {
  const filePath = path.join(process.cwd(), "data", filename);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
