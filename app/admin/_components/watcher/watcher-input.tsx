import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import req from "@/lib/req";
import { useWatcher } from "@/store/watcher";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Axis = "x" | "y" | "z";

const WatcherInput = () => {
  const activeWatcher = useWatcher((state) => state.activeWatcher);
  const updateWatcher = useWatcher((state) => state.updateWatcher);
  const watchers = useWatcher((state) => state.watchers);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  if (!activeWatcher) return null;

  const handleChange =
    (field: "position" | "lookAt", axis: Axis) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateWatcher({
        ...activeWatcher,
        [field]: { ...activeWatcher[field], [axis]: +e.target.value }
      });
    };

  const renderAxes = (field: "position" | "lookAt") =>
    (["x", "y", "z"] as Axis[]).map((axis) => (
      <InputGroup key={axis}>
        <InputGroupInput
          value={activeWatcher[field][axis]}
          type="number"
          onChange={handleChange(field, axis)}
        />
        <InputGroupAddon>{axis}</InputGroupAddon>
      </InputGroup>
    ));

  const saveWatchers = async () => {
    try {
      setLoading(true);

      await req.put(`/room/${id}`, {
        watchers
      });
    } catch {
      toast.error("Looi ui`");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <Label>Position</Label>
        {renderAxes("position")}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Label>Look at</Label>
        {renderAxes("lookAt")}
      </div>
      <Button disabled={loading} onClick={saveWatchers}>
        Save watchers
      </Button>
    </div>
  );
};

export default WatcherInput;
