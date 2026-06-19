/*
  Warnings:

  - You are about to drop the column `hotspot` on the `RoomObject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoomObject" DROP COLUMN "hotspot",
ADD COLUMN     "watcher" JSONB;
