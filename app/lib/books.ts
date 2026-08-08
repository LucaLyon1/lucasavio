import { getDb, persist, rowsToObjects } from "./db";

export type Book = {
  id: number;
  title: string;
  author: string;
  photo: string | null;
  summary: string | null;
  grade: number;
  review: string | null;
  categories: string[];
};

export type NewBook = Omit<Book, "id">;

type BookRow = Omit<Book, "categories"> & { categories: string | null };

function parseCategories(categories: string | null): string[] {
  if (!categories) return [];
  try {
    const parsed = JSON.parse(categories);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToBook(row: BookRow): Book {
  return { ...row, categories: parseCategories(row.categories) };
}

export async function getBooks(): Promise<Book[]> {
  const db = await getDb();
  const rows = rowsToObjects<BookRow>(
    db.exec(
      "SELECT id, title, author, photo, summary, grade, review, categories FROM books ORDER BY id DESC",
    ),
  );
  return rows.map(rowToBook);
}

export async function getBook(id: number): Promise<Book | null> {
  const db = await getDb();
  const [row] = rowsToObjects<BookRow>(
    db.exec(
      "SELECT id, title, author, photo, summary, grade, review, categories FROM books WHERE id = ?",
      [id],
    ),
  );
  return row ? rowToBook(row) : null;
}

export async function addBook(book: NewBook): Promise<void> {
  const db = await getDb();
  db.run(
    "INSERT INTO books (title, author, photo, summary, grade, review, categories) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      book.title,
      book.author,
      book.photo,
      book.summary,
      book.grade,
      book.review,
      book.categories.length ? JSON.stringify(book.categories) : null,
    ],
  );
  await persist();
}

export async function updateBookReview(
  id: number,
  updates: { grade: number; review: string | null },
): Promise<void> {
  const db = await getDb();
  db.run("UPDATE books SET grade = ?, review = ? WHERE id = ?", [
    updates.grade,
    updates.review,
    id,
  ]);
  await persist();
}

export async function getBooksMissingCategories(): Promise<Book[]> {
  const db = await getDb();
  const rows = rowsToObjects<BookRow>(
    db.exec(
      "SELECT id, title, author, photo, summary, grade, review, categories FROM books WHERE categories IS NULL",
    ),
  );
  return rows.map(rowToBook);
}

export async function updateBookCategories(id: number, categories: string[]): Promise<void> {
  const db = await getDb();
  db.run("UPDATE books SET categories = ? WHERE id = ?", [
    categories.length ? JSON.stringify(categories) : null,
    id,
  ]);
  await persist();
}
