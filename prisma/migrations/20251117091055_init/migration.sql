/*
  Warnings:

  - Changed the type of `roundNumber` on the `GameRound` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roundNumber` on the `StandaloneGameRound` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GameRound" DROP COLUMN "roundNumber",
ADD COLUMN     "roundNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StandaloneGameRound" DROP COLUMN "roundNumber",
ADD COLUMN     "roundNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameRound_gameId_roundNumber_key" ON "GameRound"("gameId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneGameRound_gameId_roundNumber_key" ON "StandaloneGameRound"("gameId", "roundNumber");
