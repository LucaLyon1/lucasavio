import type { Metadata } from "next";
import SectionHeading from "../components/section-heading";
import PositionsTable from "../components/positions-table";
import AddPositionForm from "./add-position-form";
import { getPositions } from "../lib/positions";

export const metadata: Metadata = {
  title: "Portfolio — Luca Savio",
};

export default async function PortfolioPage() {
  const positions = await getPositions();

  return (
    <div className="mx-auto max-w-300 px-6 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <SectionHeading label="Portfolio" title="Live positions" />

      <PositionsTable positions={positions} />

      <p className="mt-4 text-xs text-ink/50">
        Placeholder data pending a live brokerage feed. Figures are illustrative, not real
        holdings.
      </p>

      <div className="mt-12 max-w-xl">
        <AddPositionForm />
      </div>
    </div>
  );
}
