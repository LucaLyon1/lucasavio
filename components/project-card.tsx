import Link from "next/link";

type ProjectCardProps = {
  href: string;
  tag: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  featured?: boolean;
};

export default function ProjectCard({
  href,
  tag,
  title,
  description,
  metricLabel,
  metricValue,
  featured = false,
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border border-black/13 bg-strat-bg3 p-7 transition-colors hover:border-strat-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-strat-accent ${
        featured
          ? "border-strat-accent shadow-[0_0_0_1px_rgba(147,51,234,0.18),0_20px_60px_-30px_rgba(147,51,234,0.4)]"
          : ""
      }`}
    >
      <div className="mb-4 font-mono text-xs uppercase tracking-widest text-strat-muted">
        {tag}
      </div>
      <h3 className="mb-2 font-sans text-lg font-semibold text-strat-text group-hover:text-strat-accent">
        {title}
      </h3>
      <p className="mb-6 font-sans text-sm font-light text-strat-muted">{description}</p>
      <div className="flex items-baseline gap-2 border-t border-black/7 pt-4">
        <span className="font-mono text-2xl text-strat-accent">{metricValue}</span>
        <span className="font-mono text-xs uppercase tracking-widest text-strat-muted">
          {metricLabel}
        </span>
      </div>
    </Link>
  );
}
