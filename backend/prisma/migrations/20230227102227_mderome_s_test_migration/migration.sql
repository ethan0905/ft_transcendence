/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id42` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
DROP COLUMN "id42",
DROP COLUMN "username",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "Msg" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "msg" TEXT NOT NULL,
    "history" TEXT[],
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "Msg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "chatName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "Password" TEXT,
    "dm" BOOLEAN NOT NULL DEFAULT false,
    "isPassword" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mute" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Mute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_owner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_admin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_invit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_owner_AB_unique" ON "_owner"("A", "B");

-- CreateIndex
CREATE INDEX "_owner_B_index" ON "_owner"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_admin_AB_unique" ON "_admin"("A", "B");

-- CreateIndex
CREATE INDEX "_admin_B_index" ON "_admin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_invit_AB_unique" ON "_invit"("A", "B");

-- CreateIndex
CREATE INDEX "_invit_B_index" ON "_invit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- AddForeignKey
ALTER TABLE "Msg" ADD CONSTRAINT "Msg_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Msg" ADD CONSTRAINT "Msg_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mute" ADD CONSTRAINT "Mute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_owner" ADD CONSTRAINT "_owner_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_owner" ADD CONSTRAINT "_owner_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admin" ADD CONSTRAINT "_admin_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invit" ADD CONSTRAINT "_invit_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invit" ADD CONSTRAINT "_invit_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
