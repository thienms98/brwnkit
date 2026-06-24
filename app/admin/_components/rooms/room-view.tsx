"use client";

import Loader from "@/components/ui/loader";
import { isObjectsDiff } from "@/lib/utils";
import { useRoom } from "@/store/room";
import { useUnsavedChanges } from "@/store/unsaved-changes";
import { useWatcher } from "@/store/watcher";
import { IRoom } from "@/types/room";
import { Canvas } from "@react-three/fiber";
import equal from "fast-deep-equal";
import { Suspense, useEffect, useRef } from "react";
import Watcher from "../watcher";
import ObjectBound from "./objects/object-bound";
import ObjectList from "./objects/object-list";
import RoomModel from "./room-model";
import req from "@/lib/req";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const RoomView = ({ roomData }: { roomData: IRoom }) => {
  const watchers = useWatcher((state) => state.watchers);
  const setWatchers = useWatcher((state) => state.setWatchers);
  const room = useRoom((state) => state.room);
  const resetObjects = useRoom((state) => state.resetObjects);
  const { id } = useParams();
  const { refresh } = useRouter();

  useEffect(() => {
    setWatchers(roomData.watchers || []);
  }, [roomData, setWatchers]);

  const { register, unregister } = useUnsavedChanges();
  useEffect(() => {
    register(
      async () => {
        const { watchers } = useWatcher.getState();
        const { room } = useRoom.getState();

        const objects = Array.from(
          room.objects
            .values()
            .filter((item) => item.product)
            .map((item) => ({
              name: item.object.name,
              productId: item.product?.id
            }))
        );
        await req.put(`/room/${id}`, {
          watchers,
          objects
        });
        toast.success("Update successfully");
        refresh();
      },
      () => {
        resetObjects(roomData.roomObjects);
      }
    );
    return () => unregister();
  }, []);

  useEffect(() => {
    useUnsavedChanges.setState({
      isDirty:
        isObjectsDiff(roomData.roomObjects, room.objects) ||
        !equal(watchers, roomData.watchers)
    });
  }, [room.objects, watchers]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="px-10 aspect-video w-full">
          <Canvas className="flex-1">
            <Suspense fallback={<Loader />}>
              <RoomModel room={roomData} />
            </Suspense>

            <ambientLight intensity={1} />

            <directionalLight position={[10, 10, 10]} intensity={2} />
            {/* <OrbitControls /> */}
          </Canvas>
        </div>
      </div>
      <div className="w-1/3 h-full p-4 shadow-md rounded-xs border">
        <ObjectList />

        <ObjectBound />

        <Watcher />
      </div>
    </div>
  );
};

export default RoomView;
