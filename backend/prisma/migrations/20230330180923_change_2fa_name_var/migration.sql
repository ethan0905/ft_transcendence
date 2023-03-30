/*
  Warnings:

  - You are about to drop the column `twoFAIsEnabled` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "twoFAIsEnabled",
ADD COLUMN     "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false;
