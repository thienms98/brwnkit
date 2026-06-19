/*
  Warnings:

  - You are about to drop the column `watcher` on the `RoomObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "watchers" JSONB;

-- AlterTable
ALTER TABLE "RoomObject" DROP COLUMN "watcher";
