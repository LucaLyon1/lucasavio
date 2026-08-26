const CHESS_USERNAME = "cestialle";

export type ChessRating = {
  label: string;
  rating: number;
  best: number;
  wins: number;
  losses: number;
  draws: number;
};

type ChessComRatingBlock = {
  last?: { rating: number };
  best?: { rating: number };
  record?: { win: number; loss: number; draw: number };
};

type ChessComStatsResponse = {
  chess_rapid?: ChessComRatingBlock;
  chess_blitz?: ChessComRatingBlock;
  chess_bullet?: ChessComRatingBlock;
};

export async function getChessRatings(): Promise<ChessRating[]> {
  try {
    const res = await fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 60 * 30 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as ChessComStatsResponse;
    const formats: Array<[string, ChessComRatingBlock | undefined]> = [
      ["Rapid", data.chess_rapid],
      ["Blitz", data.chess_blitz],
      ["Bullet", data.chess_bullet],
    ];

    return formats
      .filter((entry): entry is [string, ChessComRatingBlock] => Boolean(entry[1]?.last?.rating))
      .map(([label, block]) => ({
        label,
        rating: block.last!.rating,
        best: block.best?.rating ?? block.last!.rating,
        wins: block.record?.win ?? 0,
        losses: block.record?.loss ?? 0,
        draws: block.record?.draw ?? 0,
      }));
  } catch {
    return [];
  }
}

export type ChessGame = {
  url: string;
  opponent: string;
  opponentRating: number;
  playerRating: number;
  playerColor: "white" | "black";
  result: "win" | "loss" | "draw";
  timeClass: string;
  endTime: number;
};

type ChessComPlayer = { username: string; rating: number; result: string };

type ChessComGame = {
  url: string;
  end_time: number;
  time_class: string;
  white: ChessComPlayer;
  black: ChessComPlayer;
};

type ChessComGamesResponse = { games: ChessComGame[] };

const DRAW_RESULTS = new Set([
  "agreed",
  "repetition",
  "stalemate",
  "insufficient",
  "50move",
  "timevsinsufficient",
]);

function toOutcome(result: string): ChessGame["result"] {
  if (result === "win") return "win";
  if (DRAW_RESULTS.has(result)) return "draw";
  return "loss";
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

async function fetchArchive(yearMonth: string): Promise<ChessComGame[]> {
  try {
    const res = await fetch(
      `https://api.chess.com/pub/player/${CHESS_USERNAME}/games/${yearMonth}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 * 15 },
      },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as ChessComGamesResponse;
    return data.games ?? [];
  } catch {
    return [];
  }
}

/** Recent games, newest first — pulled from the current month's archive, falling
 * back to the previous month so the feed isn't empty right after a month rolls over. */
export async function getRecentGames(limit = 5): Promise<ChessGame[]> {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [current, previous] = await Promise.all([
    fetchArchive(monthKey(now)),
    fetchArchive(monthKey(previousMonth)),
  ]);

  return [...current, ...previous]
    .sort((a, b) => b.end_time - a.end_time)
    .slice(0, limit)
    .map((game) => {
      const isWhite = game.white.username.toLowerCase() === CHESS_USERNAME.toLowerCase();
      const player = isWhite ? game.white : game.black;
      const opponent = isWhite ? game.black : game.white;

      return {
        url: game.url,
        opponent: opponent.username,
        opponentRating: opponent.rating,
        playerRating: player.rating,
        playerColor: isWhite ? "white" : "black",
        result: toOutcome(player.result),
        timeClass: game.time_class,
        endTime: game.end_time,
      };
    });
}

export function getChessProfileUrl(): string {
  return `https://www.chess.com/member/${CHESS_USERNAME}`;
}
