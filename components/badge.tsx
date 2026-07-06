export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-strat-accent/20 bg-strat-accent/10 px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-strat-accent">
      {children}
    </span>
  );
}
