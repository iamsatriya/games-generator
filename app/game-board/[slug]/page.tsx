import { getStandaloneGame } from "@/app/actions/standalone-game";
import GameBoardComponent from "@/app/components/game-board-component";
import { notFound, redirect, RedirectType } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: gameId } = await params;

  if (!gameId) notFound();

  const game = await getStandaloneGame(gameId);

  if (!game) notFound();

  if (game.status === "COMPLETED") {
    redirect(`/score-board/${game.id}`, RedirectType.replace);
  }

  return (
    <main className="flex items-center justify-center">
      <GameBoardComponent game={game} />
    </main>
  );
}
