export default function SectionHeading({
  label,
  title,
}: {
  label: string;
  title?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">{label}</p>
      {title ? (
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      ) : null}
    </div>
  );
}
