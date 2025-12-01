"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { schema } from "../schema";

export async function createStandaloneGame(
  players: { name: string; totalScore: number }[]
) {
  const game = await prisma.standaloneGame.create({
    data: {
      gameRounds: {
        create: [
          {
            roundNumber: 1,
            playerScores: {
              create: players.map((p) => ({
                playerName: p.name,
                score: p.totalScore,
                stars: 0,
              })),
            },
          },
        ],
      },
    },
    include: {
      gameRounds: {
        include: { playerScores: true },
      },
    },
  });

  return game;
}

export async function getStandaloneGame(gameId: string) {
  const game = await prisma.standaloneGame.findUnique({
    where: { id: gameId },
    include: {
      gameRounds: {
        include: {
          playerScores: true,
        },
      },
    },
  });

  return game;
}

export async function addStandaloneRound(
  gameId: string,
  scores: number[],
  playerNames: string[]
) {
  const nextRoundNumber = await prisma.standaloneGameRound
    .count({
      where: { gameId },
    })
    .then((count: number) => count + 1);

  const newRound = await prisma.standaloneGameRound.create({
    data: {
      gameId,
      roundNumber: nextRoundNumber,
      playerScores: {
        create: playerNames.map((name, index) => ({
          playerName: name,
          score: scores[index],
        })),
      },
    },
    include: { playerScores: true },
  });

  return newRound;
}

export async function endStandaloneGame(
  game: z.infer<typeof schema>,
  playerId?: string | null
) {
  // update entire gameRounds based on game.round[][]
  await prisma.standaloneGame.update({
    where: { id: game.id },
    data: {
      status: "COMPLETED",
      name: playerId,
      gameRounds: {
        deleteMany: {},
        create: game.round.map((scores, roundIndex) => ({
          roundNumber: roundIndex + 1,
          playerScores: {
            create: scores.map((score, scoreIndex) => ({
              playerName: game.player[scoreIndex].name,
              score,
            })),
          },
        })),
      },
    },
  });

  revalidatePath(`/game-room/${game.id}`);
}
