import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "../components/section-heading";
import PositionCards from "../components/position-cards";
import AddPositionForm from "./add-position-form";
import LogoutButton from "../login/logout-button";
import { getPositions, getEditableStocks, getPricesAsOf, describePricesAsOf } from "../lib/positions";
import { isAuthenticated } from "../lib/auth";

export const metadata: Metadata = {
  title: "Portfolio — Luca Savio",
};

export default async function PortfolioPage() {
  const [positions, pricesAsOf, authed] = await Promise.all([
    getPositions(),
    getPricesAsOf(),
    isAuthenticated(),
  ]);
  // Shares/avg cost are only ever fetched for the authenticated owner's
  // browser (needed to prefill the edit form) — never sent to public visitors.
  const editData = authed ? await getEditableStocks() : undefined;

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Portfolio" title="Live positions" />

      <PositionCards positions={positions} editData={editData} editable={authed} />

      <p className="mt-4 text-xs text-ink/50">{describePricesAsOf(pricesAsOf)}</p>

      <div className="mt-12 max-w-xl">
        {authed ? (
          <>
            <AddPositionForm />
            <div className="mt-4 text-right">
              <LogoutButton />
            </div>
          </>
        ) : (
          <Link
            href="/login?redirectTo=/portfolio"
            className="text-xs font-semibold uppercase tracking-wide text-ink/30 transition-colors hover:text-ink/50"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
