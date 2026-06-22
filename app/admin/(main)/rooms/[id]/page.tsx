import RoomView from "@/app/admin/_components/rooms/room-view";
import req from "@/lib/req";
import { IRoom } from "@/types/room";

import { notFound } from "next/navigation";

const RoomPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let room: IRoom;

  try {
    const { data } = await req.get<{ room: IRoom }>(`room/${id}`);

    room = data.room;
  } catch {
    notFound();
  }

  if (!room) {
    notFound();
  }

  return <RoomView roomData={room} />;
};

export default RoomPage;
