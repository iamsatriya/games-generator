"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  StandaloneGame,
  StandaloneGameRound,
  StandalonePlayerScore,
} from "@/lib/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { endStandaloneGame } from "../actions/standalone-game";
import { schema } from "../schema";
import ScoreBoardComponent from "./score-board-component";
import { PLAYER_ID_KEY } from "../constant";

type Props = {
  game: StandaloneGame & {
    gameRounds: (StandaloneGameRound & {
      playerScores: StandalonePlayerScore[];
    })[];
  };
};

const localSchema = z.object({
  score: z.array(z.object({ value: z.string().min(1) })),
});

export default function GameBoard(props: Props) {
  const [loading, setLoading] = useState(false);

  const [currentRound, setCurrentRound] = useState(0);

  const [crownIndex, setCrownIndex] = useState<number | null>(null);

  const [game, setGame] = useState<z.infer<typeof schema>>(() => {
    const playerNames = Array.from(
      new Set(
        props.game.gameRounds.flatMap((round) =>
          round.playerScores.map((ps) => ps.playerName)
        )
      )
    );

    const players = playerNames.map((name) => {
      const totalScore = props.game.gameRounds.reduce((total, round) => {
        const score =
          round.playerScores.find((ps) => ps.playerName === name)?.score ?? 0;
        return total + score;
      }, 0);

      return { name, totalScore };
    });

    const rounds = props.game.gameRounds.map((round) =>
      playerNames.map((name) => {
        return (
          round.playerScores.find((ps) => ps.playerName === name)?.score ?? 0
        );
      })
    );

    const stars = props.game.gameRounds.map((round) =>
      playerNames.map((name) => {
        return (
          round.playerScores.find((ps) => ps.playerName === name)?.stars ?? 0
        );
      })
    );

    return {
      id: props.game.id,
      player: players,
      round: rounds,
      star: stars,
    };
  });

  const { register, control, handleSubmit, reset } = useForm<
    z.infer<typeof localSchema>
  >({
    resolver: zodResolver(localSchema),
    defaultValues: {
      score: Array.from({ length: game?.player.length }).map(() => ({
        value: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    name: "score",
    control,
  });
  async function onSubmit(values: z.infer<typeof localSchema>) {
    const hasEmptyScore = values.score.some((s) => s.value.trim() === "");
    if (hasEmptyScore) return;

    setLoading(true);

    const scoresForThisRound = values.score.map((v) => Number(v.value));

    setGame((prev) => {
      const roundScore = prev.round;
      roundScore[currentRound] = scoresForThisRound;
      roundScore[currentRound + 1] = Array.from(
        { length: prev.player.length },
        () => 0
      );

      // const roundStar = prev.star;
      // roundStar[currentRound] = 
      return { ...prev, round: roundScore };
    });
    setCurrentRound((prev) => prev + 1);
    reset();
    setLoading(false);
  }

  async function onEndGame() {
    setLoading(true);
    const playerId = localStorage.getItem(PLAYER_ID_KEY);
    const finalGame = {
      ...game,
      round: game.round.slice(0, -1),
    };

    // await endStandaloneGame(finalGame, playerId);
    setLoading(false);
  }

  return (
    <>
      {props.game.status == "ACTIVE" ? (
        <Card className="max-w-lg w-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>{`Game ${game?.round.length}`}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    {game?.player?.map((p, index) => (
                      <TableHead key={index}>{p.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {game?.round?.slice(0, -1).map((rounds, gameIndex) => {
                    const verticalSums = game.round.reduce((acc, row) => {
                      return acc.map((sum, index) => sum + row[index]);
                    });

                    const minScore = Math.min(...verticalSums);

                    return (
                      <TableRow key={gameIndex}>
                        {rounds.map((_, index) => {
                          return (
                            <TableCell key={index}>
                              <span
                                className={`${
                                  minScore === verticalSums[index]
                                    ? "text-red-600 font-bold"
                                    : ""
                                }`}
                              >
                                {verticalSums[index]}
                              </span>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}

                  {props.game.status === "ACTIVE" && (
                    <TableRow>
                      {fields.map((field, i) => (
                        <TableCell key={field.id}>
                          <Input
                            {...register(`score.${i}.value` as const)}
                            disabled={loading}
                            type="number"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    {game?.player?.map((p, index) => (
                      <TableCell key={index}>{p.totalScore}</TableCell>
                    ))}
                  </TableRow>
                </TableFooter> */}
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex-col w-full space-y-2 mt-8">
                <Button type="submit" className="w-full" disabled={loading}>
                  Add Round
                </Button>

                <Button
                  type="button"
                  className="w-full"
                  variant="destructive"
                  disabled={loading}
                  onClick={onEndGame}
                >
                  End Game
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <ScoreBoardComponent game={game} />
      )}
    </>
  );
}
