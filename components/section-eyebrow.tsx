export default function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-strat-accent">
      <span aria-hidden className="inline-block h-px w-5 bg-strat-accent" />
      {children}
    </div>
  );
}
