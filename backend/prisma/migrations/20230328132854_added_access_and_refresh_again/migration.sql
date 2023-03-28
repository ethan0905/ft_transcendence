/*
  Warnings:

  - You are about to drop the column `access_` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refresh_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_access__key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_access_token_key" ON "users"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_refresh_token_key" ON "users"("refresh_token");
