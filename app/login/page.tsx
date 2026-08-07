import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SectionHeading from "../components/section-heading";
import { isAuthenticated } from "../lib/auth";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Luca Savio",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  const safeRedirect = redirectTo?.startsWith("/") ? redirectTo : "/";

  if (await isAuthenticated()) {
    redirect(safeRedirect);
  }

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Admin" title="Sign in" />
      <div className="mt-12 max-w-xl">
        <LoginForm redirectTo={safeRedirect} />
      </div>
    </div>
  );
}
