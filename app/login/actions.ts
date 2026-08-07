"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, verifyPassword } from "../lib/auth";

export type LoginFormState = { error?: string };

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!verifyPassword(password)) {
    return { error: "Incorrect password." };
  }

  await createSession();
  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  revalidatePath("/books");
  revalidatePath("/portfolio");
  redirect("/");
}
