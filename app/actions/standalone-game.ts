"use server";

import prisma from "@/lib/prisma";

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

export async function addStandaloneRound(gameId: string, scores: number[], playerNames: string[]) {
  const nextRoundNumber = await prisma.standaloneGameRound.count({
    where: { gameId },
  }).then((count) => count + 1);

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