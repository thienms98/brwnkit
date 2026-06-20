import req from "@/lib/req";
import { Room as RoomType } from "@/generated/prisma/client";
import { notFound } from "next/navigation";
import Room from "./_components/room";
import { Watcher } from "@/store/watcher";

export default async function Home() {
  let room: RoomType;
  try {
    const { data } = await req.get<{ room: RoomType }>(`room/1`);

    room = data.room;
  } catch {
    notFound();
  }

  return (
    <main>
      {/* scroll driver — height set by watcher count via CSS var or hardcoded */}
      <div
        id="scroll-driver"
        style={{
          height: (room.watchers as unknown as Watcher[]).length * 1000
        }}
      />

      {/* sticky canvas */}
      <div style={{ position: "fixed", inset: 0 }}>
        <Room room={room} />
      </div>
    </main>
  );
}
