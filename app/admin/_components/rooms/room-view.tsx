"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useRoom } from "@/store/room";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import RoomModel from "./room-model";
import Loader from "../loader";
import ProductSelector from "../product-selector";
import { Room } from "@/generated/prisma/client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";

const RoomView = ({ roomData }: { roomData: Room }) => {
  const [isOpen, setIsOpen] = useState(true);
  const room = useRoom((state) => state.room);
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const setSelectedMesh = useRoom((state) => state.setSelectedMesh);

  const [hotspot, setHotspot] = useState({ x: 0, y: 0, z: 0 });

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="px-10 aspect-video w-full">
          <Canvas
            camera={{ position: [3.5, 1, 0], fov: 70 }}
            className="flex-1"
          >
            <Suspense fallback={<Loader />}>
              <RoomModel modelUrl={roomData.url} />
            </Suspense>

            <ambientLight intensity={1} />

            <directionalLight position={[10, 10, 10]} intensity={2} />
            {/* <OrbitControls /> */}
          </Canvas>
        </div>
      </div>
      <div className="w-1/3 h-full p-4 border border-l">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex w-full flex-col gap-2"
        >
          <CollapsibleTrigger asChild>
            <Button className="w-full">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-sm font-semibold">Objects</h4>
                <ChevronsUpDown />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="max-h-50 overflow-auto">
            {room.objects.map((object) => (
              <div
                key={object.id}
                className={cn(
                  "text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors",
                  object.id === selectedMesh?.id
                    ? "bg-primary"
                    : "hover:bg-primary/50"
                )}
                onClick={() => {
                  setSelectedMesh(object);
                  const { x, y, z } = object.position;
                  setHotspot({ x, y, z });
                }}
              >
                {object.name}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        {selectedMesh && (
          <Card className="mt-10">
            <CardHeader>
              <Label>{selectedMesh.name}</Label>
            </CardHeader>
            <CardContent>
              <ProductSelector />
              <div className="flex gap-4">
                <InputGroup>
                  <InputGroupInput
                    value={hotspot.x}
                    type="number"
                    onChange={(e) =>
                      setHotspot((prev) => ({ ...prev, x: +e.target.value }))
                    }
                  />
                  <InputGroupAddon>x</InputGroupAddon>
                </InputGroup>
                <InputGroup>
                  <InputGroupInput
                    value={hotspot.y}
                    type="number"
                    onChange={(e) =>
                      setHotspot((prev) => ({ ...prev, y: +e.target.value }))
                    }
                  />
                  <InputGroupAddon>y</InputGroupAddon>
                </InputGroup>
                <InputGroup>
                  <InputGroupInput
                    value={hotspot.z}
                    type="number"
                    onChange={(e) =>
                      setHotspot((prev) => ({ ...prev, z: +e.target.value }))
                    }
                  />
                  <InputGroupAddon>z</InputGroupAddon>
                </InputGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoomView;
