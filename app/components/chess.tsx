import type { ReactNode } from "react";
import Card from "./card";
import SectionHeading from "./section-heading";
import Button from "./button";
import { getChessProfileUrl, type ChessRating, type ChessGame } from "../lib/chess";

function PawnIcon({
  variant,
  className,
}: {
  variant: "filled" | "outline";
  className?: string;
}) {
  const shapeProps =
    variant === "filled"
      ? { fill: "currentColor" }
      : {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.6,
          strokeLinejoin: "round" as const,
          strokeLinecap: "round" as const,
        };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="6.5" r="2.9" {...shapeProps} />
      <path d="M9.4 10.1h5.2l2.1 7.5H7.3z" {...shapeProps} />
      <rect x="5.7" y="17.9" width="12.6" height="2.6" rx="1.3" {...shapeProps} />
    </svg>
  );
}

const timeControlIcons: Record<string, ReactNode> = {
  rapid: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9 2h6" />
      <path d="M12 2v3" />
    </>
  ),
  blitz: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  bullet: (
    <>
      <path d="M9 9c0-3 1.3-6 3-7 1.7 1 3 4 3 7v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
      <path d="M9 13h6" />
    </>
  ),
};

function TimeControlIcon({ format, className }: { format: string; className?: string }) {
  const icon = timeControlIcons[format.toLowerCase()];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {icon}
    </svg>
  );
}

function RatingTile({ rating }: { rating: ChessRating }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3">
      <TimeControlIcon format={rating.label} className="size-6 shrink-0 text-primary-700" />
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{rating.label}</p>
        <p className="text-xs text-ink/40">
          {rating.wins}W {rating.losses}L {rating.draws}D
        </p>
      </div>
      <p className="tabular-nums text-2xl font-bold text-ink">{rating.rating}</p>
    </div>
  );
}

const resultStyles: Record<ChessGame["result"], string> = {
  win: "bg-gain/10 text-gain",
  loss: "bg-loss/10 text-loss",
  draw: "bg-ink/10 text-ink/60",
};

const resultLabels: Record<ChessGame["result"], string> = {
  win: "Win",
  loss: "Loss",
  draw: "Draw",
};

function GameRow({ game }: { game: ChessGame }) {
  const date = new Date(game.endTime * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={game.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-primary/5"
    >
      <span title={`Played ${game.playerColor}`} className="shrink-0">
        <PawnIcon
          variant={game.playerColor === "white" ? "outline" : "filled"}
          className="size-7 text-ink"
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">vs {game.opponent}</p>
        <p className="text-xs text-ink/50">
          <span className="capitalize">{game.timeClass}</span> · {game.opponentRating} · {date}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${resultStyles[game.result]}`}
      >
        {resultLabels[game.result]}
      </span>
    </a>
  );
}

export default function Chess({
  ratings,
  games,
}: {
  ratings: ChessRating[];
  games: ChessGame[];
}) {
  return (
    <section className="mx-auto max-w-300 px-6 pt-16 sm:pt-20">
      <SectionHeading label="Chess" />

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card className="flex h-full flex-col justify-center p-4">
          {ratings.length === 0 ? (
            <p className="p-2 text-sm text-ink/50">Ratings unavailable right now.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {ratings.map((rating) => (
                <RatingTile key={rating.label} rating={rating} />
              ))}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          {games.length === 0 ? (
            <p className="p-6 text-sm text-ink/50">No recent games found.</p>
          ) : (
            games.map((game) => <GameRow key={game.url} game={game} />)
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Button href={getChessProfileUrl()} target="_blank" variant="ghost">
          View profile on chess.com →
        </Button>
      </div>
    </section>
  );
}
