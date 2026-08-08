import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-ink hover:bg-primary-600",
  secondary: "border border-border text-ink hover:border-primary-600 hover:text-primary-700",
  ghost: "text-primary-700 hover:text-primary-600",
};

export default function Button({
  href,
  variant = "primary",
  children,
  target,
  download,
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  target?: string;
  download?: boolean | string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors";
  const isGhost = variant === "ghost";

  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      download={download}
      className={`${base} ${isGhost ? "px-0 py-0" : ""} ${variantClasses[variant]}`}
    >
      {children}
    </Link>
  );
}
