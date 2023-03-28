/*
  Warnings:

  - You are about to drop the column `access_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_access_token_key";

-- DropIndex
DROP INDEX "users_refresh_token_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_token",
DROP COLUMN "refresh_token",
ADD COLUMN     "access_" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_access__key" ON "users"("access_");
