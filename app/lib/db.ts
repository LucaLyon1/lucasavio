import initSqlJs, { type Database } from "sql.js";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "app.db");
const WASM_DIR = path.join(process.cwd(), "node_modules", "sql.js", "dist");

declare global {
  var __dbPromise: Promise<Database> | undefined;
}

async function loadDatabase(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(WASM_DIR, file) });

  const fileBuffer = await readFile(DB_PATH).catch(() => undefined);
  const db = new SQL.Database(fileBuffer);

  db.run(`
    CREATE TABLE IF NOT EXISTS stocks (
      ticker TEXT PRIMARY KEY,
      shares REAL NOT NULL,
      avg_cost REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      photo TEXT,
      summary TEXT,
      grade REAL NOT NULL,
      review TEXT
    );
  `);

  if (!fileBuffer) {
    await writeFile(DB_PATH, Buffer.from(db.export()));
  }

  return db;
}

export function getDb(): Promise<Database> {
  if (!global.__dbPromise) {
    global.__dbPromise = loadDatabase();
  }
  return global.__dbPromise;
}

export async function persist(): Promise<void> {
  const db = await getDb();
  await writeFile(DB_PATH, Buffer.from(db.export()));
}

export function rowsToObjects<T extends Record<string, unknown>>(
  result: ReturnType<Database["exec"]>,
): T[] {
  if (!result[0]) return [];
  const { columns, values } = result[0];
  return values.map(
    (row) => Object.fromEntries(columns.map((col, i) => [col, row[i]])) as T,
  );
}
