import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useRoom } from "@/store/room";
import { ChevronsUpDown, LinkIcon } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

const ObjectList = () => {
  const { room, selectedMesh, setSelectedMesh } = useRoom(
    useShallow((state) => ({
      room: state.room,
      selectedMesh: state.selectedMesh,
      setSelectedMesh: state.setSelectedMesh,
      updateSelectedMesh: state.updateSelectedMesh
    }))
  );
  const [isOpen, setIsOpen] = useState(true);

  return (
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
        {Array.from(room.objects).map(([key, { object, product }]) => (
          <div
            key={key}
            className={cn(
              "text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors flex justify-between",
              object.id === selectedMesh?.object.id
                ? "bg-primary"
                : "hover:bg-primary/50"
            )}
            onClick={() => {
              setSelectedMesh(object.name);
            }}
          >
            <span>{object.name}</span>

            {product && (
              <span className="flex items-center gap-2">
                <LinkIcon size={14} /> {product.title}
              </span>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ObjectList;
