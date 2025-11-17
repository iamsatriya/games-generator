-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "gameMasterId" INTEGER NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRound" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerScore" (
    "id" TEXT NOT NULL,
    "gameRoundId" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandaloneGame" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "status" "GameStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandaloneGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandaloneGameRound" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandaloneGameRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandalonePlayerScore" (
    "id" TEXT NOT NULL,
    "gameRoundId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandalonePlayerScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Game_gameMasterId_idx" ON "Game"("gameMasterId");

-- CreateIndex
CREATE INDEX "GameRound_gameId_idx" ON "GameRound"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "GameRound_gameId_roundNumber_key" ON "GameRound"("gameId", "roundNumber");

-- CreateIndex
CREATE INDEX "PlayerScore_gameRoundId_idx" ON "PlayerScore"("gameRoundId");

-- CreateIndex
CREATE INDEX "PlayerScore_playerId_idx" ON "PlayerScore"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerScore_gameRoundId_playerId_key" ON "PlayerScore"("gameRoundId", "playerId");

-- CreateIndex
CREATE INDEX "StandaloneGameRound_gameId_idx" ON "StandaloneGameRound"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneGameRound_gameId_roundNumber_key" ON "StandaloneGameRound"("gameId", "roundNumber");

-- CreateIndex
CREATE INDEX "StandalonePlayerScore_gameRoundId_idx" ON "StandalonePlayerScore"("gameRoundId");

-- CreateIndex
CREATE UNIQUE INDEX "StandalonePlayerScore_gameRoundId_playerName_key" ON "StandalonePlayerScore"("gameRoundId", "playerName");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameMasterId_fkey" FOREIGN KEY ("gameMasterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRound" ADD CONSTRAINT "GameRound_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_gameRoundId_fkey" FOREIGN KEY ("gameRoundId") REFERENCES "GameRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerScore" ADD CONSTRAINT "PlayerScore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneGameRound" ADD CONSTRAINT "StandaloneGameRound_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "StandaloneGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandalonePlayerScore" ADD CONSTRAINT "StandalonePlayerScore_gameRoundId_fkey" FOREIGN KEY ("gameRoundId") REFERENCES "StandaloneGameRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
