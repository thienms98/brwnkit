import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoom } from "@/store/room";
import { useWatcher, Watcher } from "@/store/watcher";
import { arrayMove, move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CameraIcon, GripVerticalIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { v4 } from "uuid";

const WatcherList = () => {
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const watchers = useWatcher((state) => state.watchers);
  const addWatcher = useWatcher((state) => state.addWatcher);
  const setWatchers = useWatcher((state) => state.setWatchers);

  const addNew = () => {
    if (!selectedMesh)
      addWatcher({
        key: v4(),
        name: "",
        position: { x: 0, y: 0, z: 0 },
        lookAt: { x: 0, y: 0, z: 0 }
      });
    else {
      const { x, y, z } = selectedMesh.position;
      addWatcher({
        key: v4(),
        name: "",
        position: { x: 0, y: 0, z: 0 },
        lookAt: { x, y, z }
      });
    }
  };

  return (
    <div>
      <DragDropProvider
        onDragEnd={(event) => {
          const keys = move(
            watchers.map((i) => i.key),
            event
          );

          setWatchers(keys.map((key) => watchers.find((i) => i.key === key)!));
        }}
      >
        <div className="flex flex-wrap gap-2">
          {watchers.map((watcher, index) => (
            <Sortable
              key={watcher.key}
              watcher={watcher}
              index={index}
            ></Sortable>
          ))}
        </div>
      </DragDropProvider>

      <Button onClick={addNew} className="rounded-lg">
        <PlusIcon />
        <CameraIcon />
      </Button>
    </div>
  );
};

function Sortable({ index, watcher }: { watcher: Watcher; index: number }) {
  const activeWatcher = useWatcher((state) => state.activeWatcher);
  const setActiveWatcher = useWatcher((state) => state.setActiveWatcher);

  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<SVGSVGElement | null>(null);
  const { isDragging } = useSortable({
    id: watcher.key,
    index,
    element,
    handle: handleRef
  });

  return (
    <div ref={setElement}>
      <div
        className={cn(
          "flex items-center gap-2 p-1 rounded-lg cursor-pointer transition-colors select-none",
          activeWatcher?.key === watcher.key
            ? "bg-primary"
            : "hover:bg-primary/50"
        )}
        onClick={() => setActiveWatcher(watcher.key)}
      >
        <CameraIcon size={18} />
        <p>{watcher.name || "Untitle"}</p>
        <GripVerticalIcon size={14} ref={handleRef} className="ml-auto" />
      </div>
    </div>
  );
}

export default WatcherList;
