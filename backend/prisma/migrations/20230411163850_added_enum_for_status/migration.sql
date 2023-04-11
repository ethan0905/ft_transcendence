-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'PLAYING');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" DEFAULT 'OFFLINE';
