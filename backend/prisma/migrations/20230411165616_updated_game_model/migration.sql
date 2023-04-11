/*
  Warnings:

  - You are about to drop the column `player1Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `score1` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `score2` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('WAITING', 'PLAYING', 'FINISHED');

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_player2Id_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
DROP COLUMN "score1",
DROP COLUMN "score2",
ADD COLUMN     "score" INTEGER[],
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "friends" INTEGER[];

-- DropTable
DROP TABLE "Friend";

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "_player" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_player_AB_unique" ON "_player"("A", "B");

-- CreateIndex
CREATE INDEX "_player_B_index" ON "_player"("B");

-- AddForeignKey
ALTER TABLE "_player" ADD CONSTRAINT "_player_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_player" ADD CONSTRAINT "_player_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
