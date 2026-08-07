"use server";

import { revalidatePath } from "next/cache";
import { addBook } from "../lib/books";

export type BookFormState = { error?: string };

export async function addBookAction(
  _prevState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const rating = Number(formData.get("rating"));

  if (!title) return { error: "Title is required." };
  if (!author) return { error: "Author is required." };
  if (!category) return { error: "Category is required." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  await addBook({ title, author, category, rating });
  revalidatePath("/books");
  revalidatePath("/");

  return {};
}
