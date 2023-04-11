-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_invited" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_invited_AB_unique" ON "_invited"("A", "B");

-- CreateIndex
CREATE INDEX "_invited_B_index" ON "_invited"("B");

-- AddForeignKey
ALTER TABLE "_invited" ADD CONSTRAINT "_invited_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_invited" ADD CONSTRAINT "_invited_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
