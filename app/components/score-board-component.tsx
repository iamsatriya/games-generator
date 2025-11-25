import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import z from "zod";
import { schema } from "../schema";
import { Button } from "@/components/ui/button";

type Props = {
  game: z.infer<typeof schema>;
};

type Winner = { name: string; totalScore: number; wins: number };

export default function ScoreBoardComponent(props: Props) {
  const { game } = props;
  const router = useRouter();

  function calculateWinners(): Winner[] {
    const playerNames = game.player.map((p) => p.name);

    const wins: Record<string, number> = {};
    const totals: Record<string, number> = {};

    playerNames.forEach((name) => {
      wins[name] = 0;
      totals[name] = 0;
    });

    for (const round of game.round) {
      const maxScore = Math.max(...round);

      round.forEach((score, idx) => {
        const name = playerNames[idx];
        totals[name] += score;
        if (score === maxScore) wins[name] += 1;
      });
    }

    const maxTotalScore = Math.max(...Object.values(totals));

    return playerNames
      .map((name) => ({ name, totalScore: totals[name], wins: wins[name] }))
      .filter((p) => p.totalScore === maxTotalScore);
  }
  function calculateLosers(): Winner[] {
    const playerNames = game.player.map((p) => p.name);

    const wins: Record<string, number> = {};
    const totals: Record<string, number> = {};

    playerNames.forEach((name) => {
      wins[name] = 0;
      totals[name] = 0;
    });

    for (const round of game.round) {
      const maxScore = Math.max(...round);

      round.forEach((score, idx) => {
        const name = playerNames[idx];
        totals[name] += score;
        if (score === maxScore) wins[name] += 1;
      });
    }

    const minTotalScore = Math.min(...Object.values(totals));

    return playerNames
      .map((name) => ({
        name,
        totalScore: totals[name],
        wins: wins[name],
      }))
      .filter((p) => p.totalScore === minTotalScore);
  }

  function onBackToHome() {
    router.push("/");
  }

  const scores = game.player.map((p) => p.totalScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  function getCellStyle(score: number): string {
    if (score === maxScore)
      return "text-green-700 dark:text-green-300 font-bold";
    if (score === minScore) return "text-red-700 dark:text-red-300 font-bold";
    return "";
  }

  return (
    <section>
      {/* <div className="text-center">
        <h1 className="text-2xl font-medium">Congratulation to the Winner</h1>
        <p className="text-4xl font-bold">
          {calculateWinners()
            .map((item) => item.name)
            .join(", ")}
        </p>
      </div> */}

      <div className="text-center">
        <h1 className="text-2xl font-medium">
          Daftar orang <b>cupu</b>
        </h1>
        <p className="text-5xl font-bold">
          {calculateLosers()
            .map((item) => item.name)
            .join(", ")}
        </p>
      </div>

      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              {game.player.map((player) => (
                <TableCell
                  key={player.name}
                  className={getCellStyle(player.totalScore)}
                >
                  {player.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {game.player.map((player) => (
                <TableCell
                  key={player.name}
                  className={getCellStyle(player.totalScore)}
                >
                  {player.totalScore}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Button className="w-full" onClick={onBackToHome}>
        Go to home
      </Button>
    </section>
  );
}
