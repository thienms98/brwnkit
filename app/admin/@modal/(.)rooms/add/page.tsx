"use client";

import RoomCreate from "@/app/admin/_components/rooms/room-create";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const RoomAddModal = () => {
  const { back } = useRouter();

  const onRoomCreate = () => {
    back();
  };

  return (
    <Dialog open onOpenChange={back}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create room</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <RoomCreate onRoomCreate={onRoomCreate} />
      </DialogContent>
    </Dialog>
  );
};

export default RoomAddModal;
