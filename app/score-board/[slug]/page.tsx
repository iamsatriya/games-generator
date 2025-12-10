import { getStandaloneGame } from "@/app/actions/standalone-game";
import ScoreBoardComponent from "@/app/components/score-board-component";
import { schema } from "@/app/schema";
import { notFound } from "next/navigation";
import z from "zod";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: gameId } = await params;

  if (!gameId) notFound();

  const game = await getStandaloneGame(gameId);

  if (!game) notFound();

  return (
    <main className="flex items-center justify-center">
      <ScoreBoardComponent game={transformStandaloneGame(game)} />
    </main>
  );
}

type PrismaStandaloneGame = {
  id: string;
  gameRounds: {
    roundNumber: number;
    playerScores: {
      playerName: string;
      score: number;
      stars: number;
    }[];
  }[];
};

function transformStandaloneGame(
  game: PrismaStandaloneGame
): z.infer<typeof schema> {
  const playerMap: Record<string, number> = {};

  for (const round of game.gameRounds) {
    for (const ps of round.playerScores) {
      if (!playerMap[ps.playerName]) {
        playerMap[ps.playerName] = 0;
      }
      playerMap[ps.playerName] += ps.score;
    }
  }

  const player = Object.entries(playerMap).map(([name, totalScore]) => ({
    name,
    totalScore,
  }));

  const round = game.gameRounds.map((r) =>
    r.playerScores.map((ps) => ps.score)
  );

  const star = game.gameRounds.map((r) => r.playerScores.map((ps) => ps.stars));

  const result = {
    id: game.id,
    player,
    round,
    star,
  };

  return schema.parse(result);
}
