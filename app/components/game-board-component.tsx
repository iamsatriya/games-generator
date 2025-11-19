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
import {
  endStandaloneGame
} from "../actions/standalone-game";
import { schema } from "../schema";

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

    return {
      id: props.game.id,
      player: players,
      round: rounds,
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

    const updatedGame = await new Promise<z.infer<typeof schema> | null>(
      (resolve) => {
        setGame((prev) => {
          if (!prev) {
            resolve(null);
            return prev;
          }

          const newRound = [...prev.round, scoresForThisRound];

          const updatedPlayers = prev.player.map((player, playerIndex) => ({
            ...player,
            totalScore: newRound.reduce(
              (sum, row) => sum + (row[playerIndex] ?? 0),
              0
            ),
          }));

          const updated = {
            ...prev,
            round: newRound,
            player: updatedPlayers,
          };

          resolve(updated);
          return updated;
        });
      }
    );

    if (!updatedGame) return;

    reset();
    setLoading(false);
  }

  async function onEndGame() {
    setLoading(true);
    await endStandaloneGame(game);
    setLoading(false);
  }

  return (
    <Card className="max-w-lg max-h-[80vh]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Game {game?.round.length}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-auto">
          <Table className="w-full  overflow-y-auto">
            <TableHeader>
              <TableRow>
                {game?.player?.map((p, index) => (
                  <TableHead key={index}>{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {game?.round?.slice(1)?.map((rounds, index) => (
                <TableRow key={index}>
                  {rounds?.map((r, index) => (
                    <TableCell key={index}>{r}</TableCell>
                  ))}
                </TableRow>
              ))}
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
            </TableBody>
            <TableFooter>
              <TableRow>
                {game?.player?.map((p, index) => (
                  <TableCell key={index}>{p.totalScore}</TableCell>
                ))}
              </TableRow>
            </TableFooter>
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
  );
}
