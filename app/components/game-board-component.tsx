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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { GAME_DATA_KEY } from "../constant";
import { schema } from "../schema";

type Props = {
  gameId: string;
};

const localSchema = z.object({
  score: z.array(z.object({ value: z.string() })),
});

export default function GameBoard(props: Props) {
  const [game, setGame] = useState<z.infer<typeof schema>>(() => {
    if (typeof window !== "undefined") {
      const gameData = localStorage.getItem(GAME_DATA_KEY);
      if (gameData) {
        const data = JSON.parse(gameData);
        if (data.id === props.gameId) {
          return data;
        }
        return data;
      }
    }
    return undefined;
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

  function onSubmit(values: z.infer<typeof localSchema>) {
    const scoresForThisRound = values.score.map((v) => Number(v.value));

    setGame((prev) => {
      if (!prev) return prev;

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

      localStorage.setItem(GAME_DATA_KEY, JSON.stringify(updated));

      return updated;
    });

    reset();
  }

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Game {game?.round.length + 1}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-1/2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {game?.player?.map((p, index) => (
                  <TableHead key={index}>{p.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {game?.round?.map((rounds, index) => (
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
            <Button type="submit" className="w-full">
              Add Round
            </Button>
            <Button type="button" className="w-full" variant="destructive">
              End Game
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
