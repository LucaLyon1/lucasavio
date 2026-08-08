import { getDb, persist, rowsToObjects } from "./db";

export type Book = {
  id: number;
  title: string;
  author: string;
  photo: string | null;
  summary: string | null;
  grade: number;
  review: string | null;
};

export type NewBook = Omit<Book, "id">;

export async function getBooks(): Promise<Book[]> {
  const db = await getDb();
  return rowsToObjects<Book>(
    db.exec("SELECT id, title, author, photo, summary, grade, review FROM books ORDER BY id DESC"),
  );
}

export async function getBook(id: number): Promise<Book | null> {
  const db = await getDb();
  const [book] = rowsToObjects<Book>(
    db.exec("SELECT id, title, author, photo, summary, grade, review FROM books WHERE id = ?", [id]),
  );
  return book ?? null;
}

export async function addBook(book: NewBook): Promise<void> {
  const db = await getDb();
  db.run(
    "INSERT INTO books (title, author, photo, summary, grade, review) VALUES (?, ?, ?, ?, ?, ?)",
    [book.title, book.author, book.photo, book.summary, book.grade, book.review],
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
