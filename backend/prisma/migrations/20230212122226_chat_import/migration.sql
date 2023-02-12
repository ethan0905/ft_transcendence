-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatId" INTEGER NOT NULL,
    "chatName" TEXT NOT NULL,
    "msg" TEXT[],

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);
