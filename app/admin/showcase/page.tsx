"use client";

import { Suspense, useState } from "react";
import Loader from "../_components/loader";
import { Canvas } from "@react-three/fiber";
import Room from "../_components/room";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductSelector from "../_components/product-selector";

const Showcase = () => {
  const [isOpen, setIsOpen] = useState(true);
  const room = useRoom((state) => state.room);
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const setSelectedMesh = useRoom((state) => state.setSelectedMesh);

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="px-10 aspect-video w-full">
          <Canvas camera={{ position: [3, 1, 0], fov: 90 }} className="flex-1">
            <Suspense fallback={<Loader />}>
              <Room />
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
            {room.objects.map((mesh) => (
              <div
                key={mesh.id}
                className={cn(
                  "text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors",
                  mesh.id === selectedMesh?.id
                    ? "bg-primary"
                    : "hover:bg-primary/50"
                )}
                onClick={() => {
                  setSelectedMesh(mesh);
                }}
              >
                {mesh.name}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Showcase;
