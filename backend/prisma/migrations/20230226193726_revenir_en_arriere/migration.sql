/*
  Warnings:

  - You are about to drop the column `hashedRefreshToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashedRefreshToken",
DROP COLUMN "score";
