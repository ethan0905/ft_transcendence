/*
  Warnings:

  - The primary key for the `Follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followingId` on the `Follows` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- AlterTable
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_pkey",
DROP COLUMN "followingId",
ADD CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId");
