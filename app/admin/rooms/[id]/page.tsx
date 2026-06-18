import { Room } from "@/generated/prisma/client";
import req from "@/lib/req";
import RoomView from "../../_components/rooms/room-view";

import { notFound } from "next/navigation";

const RoomPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let room: Room;

  try {
    const { data } = await req.get<{ room: Room }>(`room/${id}`);

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
