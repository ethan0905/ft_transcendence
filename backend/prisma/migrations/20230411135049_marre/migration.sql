-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "friends" INTEGER[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedId" INTEGER NOT NULL,

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("blockedId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelName" TEXT NOT NULL,
    "password" TEXT,
    "isPassword" BOOLEAN NOT NULL DEFAULT false,
    "isDM" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "player1Id" INTEGER,
    "player2Id" INTEGER,
    "score1" INTEGER NOT NULL,
    "score2" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "test" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_owner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_admins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_banned" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_muted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_invited" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_accessToken_key" ON "users"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshToken_key" ON "users"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_owner_AB_unique" ON "_owner"("A", "B");

-- CreateIndex
CREATE INDEX "_owner_B_index" ON "_owner"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_admins_AB_unique" ON "_admins"("A", "B");

-- CreateIndex
CREATE INDEX "_admins_B_index" ON "_admins"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_banned_AB_unique" ON "_banned"("A", "B");

-- CreateIndex
CREATE INDEX "_banned_B_index" ON "_banned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_muted_AB_unique" ON "_muted"("A", "B");

-- CreateIndex
CREATE INDEX "_muted_B_index" ON "_muted"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_invited_AB_unique" ON "_invited"("A", "B");

-- CreateIndex
CREATE INDEX "_invited_B_index" ON "_invited"("B");

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_owner" ADD CONSTRAINT "_owner_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_owner" ADD CONSTRAINT "_owner_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admins" ADD CONSTRAINT "_admins_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_admins" ADD CONSTRAINT "_admins_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_members" ADD CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banned" ADD CONSTRAINT "_banned_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banned" ADD CONSTRAINT "_banned_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_muted" ADD CONSTRAINT "_muted_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_muted" ADD CONSTRAINT "_muted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invited" ADD CONSTRAINT "_invited_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invited" ADD CONSTRAINT "_invited_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
