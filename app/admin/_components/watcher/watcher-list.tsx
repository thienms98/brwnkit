import { Button } from "@/components/ui/button";
import { useRoom } from "@/store/room";
import { useWatcher } from "@/store/watcher";
import { CameraIcon, PlusIcon } from "lucide-react";
import { v4 } from "uuid";

const CameraList = () => {
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const watchers = useWatcher((state) => state.watchers);
  const addWatcher = useWatcher((state) => state.addWatcher);
  const setActiveWatcher = useWatcher((state) => state.setActiveWatcher);

  const addNew = () => {
    if (!selectedMesh)
      addWatcher({
        key: v4(),
        position: { x: 0, y: 0, z: 0 },
        lookAt: { x: 0, y: 0, z: 0 }
      });
    else {
      const { x, y, z } = selectedMesh.position;
      addWatcher({
        key: v4(),
        position: { x: 0, y: 0, z: 0 },
        lookAt: { x, y, z }
      });
    }
  };

  return (
    <div>
      {watchers.map((watcher) => (
        <Button key={watcher.key} onClick={() => setActiveWatcher(watcher.key)}>
          <CameraIcon />
          <p>{watcher.key}</p>
        </Button>
      ))}

      <Button onClick={addNew}>
        <PlusIcon />
        <CameraIcon />
      </Button>
    </div>
  );
};

export default CameraList;
