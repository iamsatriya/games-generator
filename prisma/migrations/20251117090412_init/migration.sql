/*
  Warnings:

  - The `roundNumber` column on the `GameRound` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roundNumber` column on the `StandaloneGameRound` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "GameRound" DROP COLUMN "roundNumber",
ADD COLUMN     "roundNumber" INTEGER[];

-- AlterTable
ALTER TABLE "StandaloneGameRound" DROP COLUMN "roundNumber",
ADD COLUMN     "roundNumber" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "GameRound_gameId_roundNumber_key" ON "GameRound"("gameId", "roundNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneGameRound_gameId_roundNumber_key" ON "StandaloneGameRound"("gameId", "roundNumber");
