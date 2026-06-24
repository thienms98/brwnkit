import { useRoom } from "@/store/room";
import React from "react";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { XIcon } from "lucide-react";
import { Product } from "@/generated/prisma/client";
import ProductSelector from "../../product-selector";
import { useUnsavedChanges } from "@/store/unsaved-changes";

const ObjectBound = () => {
  const { selectedMesh, setSelectedMesh, updateSelectedMesh } = useRoom(
    useShallow((state) => ({
      room: state.room,
      selectedMesh: state.selectedMesh,
      setSelectedMesh: state.setSelectedMesh,
      updateSelectedMesh: state.updateSelectedMesh
    }))
  );

  const onProductChange = async (product?: Product) => {
    updateSelectedMesh({ product });
  };

  useUnsavedChanges();

  return (
    selectedMesh && (
      <Card className="mt-3 shadow-md rounded-xs">
        <CardHeader className="flex justify-between items-center">
          <Label className="font-semibold">{selectedMesh.object.name}</Label>
          <Button variant={"ghost"} onClick={() => setSelectedMesh(null)}>
            <XIcon size={14} />
          </Button>
        </CardHeader>
        <CardContent className="flex gap-4 w-full">
          <ProductSelector
            value={selectedMesh.product}
            onChange={onProductChange}
          />
          {selectedMesh.product && (
            <Button
              variant={"destructive"}
              onClick={() => updateSelectedMesh({ product: undefined })}
            >
              <XIcon size={14} />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  );
};

export default ObjectBound;
