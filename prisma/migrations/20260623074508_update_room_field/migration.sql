/*
  Warnings:

  - A unique constraint covering the columns `[roomId,name]` on the table `RoomObject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoomObject_roomId_name_key" ON "RoomObject"("roomId", "name");
