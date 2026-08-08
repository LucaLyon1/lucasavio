"use server";

import { revalidatePath } from "next/cache";
import {
  addBook,
  getBooksMissingCategories,
  updateBookCategories,
  updateBookReview,
} from "../lib/books";
import { lookupBook, searchBooks, type BookSuggestion } from "../lib/google-books";
import { isAuthenticated } from "../lib/auth";

export type BookFormState = { error?: string };

function parseCategoriesInput(raw: string): string[] {
  return raw
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);
}

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
  const categories = parseCategoriesInput(String(formData.get("categories") ?? ""));
  const grade = Number(formData.get("grade"));

  if (!title) return { error: "Title is required." };
  if (!author) return { error: "Author is required." };
  if (!Number.isFinite(grade) || grade < 0 || grade > 10) {
    return { error: "Grade must be between 0 and 10." };
  }

  let photoToSave = photo || null;
  let summaryToSave = summary || null;
  let categoriesToSave = categories;

  if (!photoToSave || !summaryToSave || !categoriesToSave.length) {
    const lookup = await lookupBook(title, author);
    photoToSave ??= lookup?.photo ?? null;
    summaryToSave ??= lookup?.summary ?? null;
    if (!categoriesToSave.length) categoriesToSave = lookup?.categories ?? [];
  }

  await addBook({
    title,
    author,
    photo: photoToSave,
    summary: summaryToSave,
    grade,
    review: review || null,
    categories: categoriesToSave,
  });
  revalidatePath("/books");
  revalidatePath("/");

  return {};
}

export async function updateBookReviewAction(
  _prevState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  if (!(await isAuthenticated())) {
    return { error: "You must be signed in to do that." };
  }

  const id = Number(formData.get("id"));
  const review = String(formData.get("review") ?? "").trim();
  const categories = parseCategoriesInput(String(formData.get("categories") ?? ""));
  const grade = Number(formData.get("grade"));

  if (!Number.isFinite(id)) return { error: "Invalid book." };
  if (!Number.isFinite(grade) || grade < 0 || grade > 10) {
    return { error: "Grade must be between 0 and 10." };
  }

  await updateBookReview(id, { grade, review: review || null, categories });
  revalidatePath(`/books/${id}`);
  revalidatePath("/books");
  revalidatePath("/");

  return {};
}

export type BackfillState = { message?: string; error?: string };

export async function backfillBookCategoriesAction(): Promise<BackfillState> {
  if (!(await isAuthenticated())) {
    return { error: "You must be signed in to do that." };
  }

  const books = await getBooksMissingCategories();
  let updated = 0;
  for (const book of books) {
    const lookup = await lookupBook(book.title, book.author);
    if (lookup?.categories.length) {
      await updateBookCategories(book.id, lookup.categories);
      updated++;
    }
  }

  revalidatePath("/books");
  revalidatePath("/");

  return { message: `Filled in categories for ${updated} of ${books.length} book${books.length === 1 ? "" : "s"}.` };
}

export async function searchBooksAction(query: string): Promise<BookSuggestion[]> {
  if (!(await isAuthenticated())) return [];
  return searchBooks(query);
}
