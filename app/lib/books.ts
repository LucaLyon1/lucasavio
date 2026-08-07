import { readStore, writeStore } from "./store";

const FILE = "books.json";

export type Book = {
  title: string;
  author: string;
  category: string;
  rating: number;
};

export async function getBooks(): Promise<Book[]> {
  return readStore<Book>(FILE);
}

export async function addBook(book: Book): Promise<void> {
  const books = await readStore<Book>(FILE);
  books.push(book);
  await writeStore(FILE, books);
}
