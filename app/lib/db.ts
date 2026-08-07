import initSqlJs, { type Database } from "sql.js";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "app.db");
const WASM_DIR = path.join(process.cwd(), "node_modules", "sql.js", "dist");

declare global {
  var __dbPromise: Promise<Database> | undefined;
}

// Append-only. Never edit or remove a past migration — add a new one instead,
// so it applies cleanly to databases that already ran the earlier ones.
const migrations: { name: string; up: (db: Database) => void }[] = [
  {
    // Uses IF NOT EXISTS (unlike later migrations) because it must apply cleanly
    // to databases created before this migration system existed.
    name: "001_init",
    up: (db) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS stocks (
          ticker TEXT PRIMARY KEY,
          shares REAL NOT NULL,
          avg_cost REAL NOT NULL
        );
      `);
      db.run(`
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
    },
  },
  {
    // Cached close price, so the portfolio page reads from the DB instead of
    // hitting the Yahoo Finance API on every request. Populated at add-time
    // and refreshed by the market-close job (see app/api/refresh-prices).
    name: "002_price_cache",
    up: (db) => {
      db.run(`ALTER TABLE stocks ADD COLUMN last_price REAL;`);
      db.run(`ALTER TABLE stocks ADD COLUMN prev_close REAL;`);
      db.run(`ALTER TABLE stocks ADD COLUMN full_name TEXT;`);
      db.run(`ALTER TABLE stocks ADD COLUMN price_updated_at TEXT;`);
    },
  },
  {
    // Native trading currency of the quote (e.g. USD, GBP, CAD). Prices and
    // cost basis are stored in this currency; the portfolio totals convert to
    // USD via live FX rates. Defaults to USD for rows added before this column.
    name: "003_currency",
    up: (db) => {
      db.run(`ALTER TABLE stocks ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';`);
    },
  },
];

function runMigrations(db: Database): boolean {
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const applied = new Set(
    rowsToObjects<{ name: string }>(db.exec("SELECT name FROM migrations")).map((row) => row.name),
  );

  let didWork = false;
  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    migration.up(db);
    db.run("INSERT INTO migrations (name) VALUES (?)", [migration.name]);
    didWork = true;
  }
  return didWork;
}

async function loadDatabase(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: (file) => path.join(WASM_DIR, file) });

  const fileBuffer = await readFile(DB_PATH).catch(() => undefined);
  const db = new SQL.Database(fileBuffer);

  if (runMigrations(db)) {
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
