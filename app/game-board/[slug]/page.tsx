import { getStandaloneGame } from "@/app/actions/standalone-game";
import GameBoardComponent from "@/app/components/game-board-component";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: gameId } = await params;

  if (!gameId) notFound();

  const game = await getStandaloneGame(gameId);

  if (!game) notFound();

  console.log("game", game);

  return (
    <main className="flex h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <GameBoardComponent game={game} />
    </main>
  );
}
