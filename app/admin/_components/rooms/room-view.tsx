"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { Room } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useRoom } from "@/store/room";
import { useWatcher, Watcher as WatcherType } from "@/store/watcher";
import { Canvas } from "@react-three/fiber";
import { ChevronsUpDown } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import ProductSelector from "../product-selector";
import Watcher from "../watcher";
import RoomModel from "./room-model";

const RoomView = ({ roomData }: { roomData: Room }) => {
  const [isOpen, setIsOpen] = useState(true);
  const room = useRoom((state) => state.room);
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const setSelectedMesh = useRoom((state) => state.setSelectedMesh);
  const setWatchers = useWatcher((state) => state.setWatchers);

  useEffect(() => {
    setWatchers(roomData.watchers as unknown as WatcherType[]);
  }, [roomData, setWatchers]);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="px-10 aspect-video w-full">
          <Canvas
            camera={{ position: [3.5, 1, 0], fov: 70 }}
            className="flex-1"
          >
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
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-full flex-col gap-2 shadow-md"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full flex items-center justify-start gap-4 p-4"
            >
              <h4 className="text-sm font-semibold">Objects</h4>
              <ChevronsUpDown className="ml-auto" size={16} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="max-h-50 overflow-auto p-2">
            {Array.from(room.objects).map(([key, { object }]) => (
              <div
                key={key}
                className={cn(
                  "text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors",
                  object.id === selectedMesh?.id
                    ? "bg-primary"
                    : "hover:bg-primary/50"
                )}
                onClick={() => {
                  setSelectedMesh(object);
                }}
              >
                {object.name}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {selectedMesh && (
          <Card className="mt-3 shadow-md rounded-xs">
            <CardHeader>
              <Label>{selectedMesh.name}</Label>
            </CardHeader>
            <CardContent>
              <ProductSelector />
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save</Button>
            </CardFooter>
          </Card>
        )}

        <Watcher />
      </div>
    </div>
  );
};

export default RoomView;
