"use server";

import { revalidatePath } from "next/cache";
import { addBook } from "../lib/books";
import { lookupBook, searchBooks, type BookSuggestion } from "../lib/google-books";
import { isAuthenticated } from "../lib/auth";

export type BookFormState = { error?: string };

export async function addBookAction(
  _prevState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  if (!(await isAuthenticated())) {
    return { error: "You must be signed in to do that." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const review = String(formData.get("review") ?? "").trim();
  const grade = Number(formData.get("grade"));

  if (!title) return { error: "Title is required." };
  if (!author) return { error: "Author is required." };
  if (!Number.isFinite(grade) || grade < 0 || grade > 10) {
    return { error: "Grade must be between 0 and 10." };
  }

  let photoToSave = photo || null;
  let summaryToSave = summary || null;

  if (!photoToSave || !summaryToSave) {
    const lookup = await lookupBook(title, author);
    photoToSave ??= lookup?.photo ?? null;
    summaryToSave ??= lookup?.summary ?? null;
  }

  await addBook({
    title,
    author,
    photo: photoToSave,
    summary: summaryToSave,
    grade,
    review: review || null,
  });
  revalidatePath("/books");
  revalidatePath("/");

  return {};
}

export async function searchBooksAction(query: string): Promise<BookSuggestion[]> {
  if (!(await isAuthenticated())) return [];
  return searchBooks(query);
}
