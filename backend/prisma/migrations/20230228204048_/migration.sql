/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_id_email_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "hash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
