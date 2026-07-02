import req from "@/lib/req";
import { notFound } from "next/navigation";
import Room from "./_components/room";
import { IRoom } from "@/types/room";

export default async function Home() {
  let room: IRoom;
  try {
    const { data } = await req.get<{ room: IRoom }>(`room/1`);

    room = data.room;
  } catch {
    notFound();
  }

  return (
    <main>
      <div
        id="scroll-driver"
        style={{
          height: room.watchers.length * 1000
        }}
      />

      <div className="fixed inset-0">
        <Room room={room} />
      </div>
    </main>
  );
}
