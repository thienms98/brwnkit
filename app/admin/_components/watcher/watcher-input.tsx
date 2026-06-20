import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ChevronsUpDown } from "lucide-react";

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
          step={0.1}
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
      toast.success("Watchers updated");
    } catch {
      toast.error("Cannot update watchers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 flex flex-col gap-2">
      <Label className="grid grid-cols-4 gap-4">
        <span>Name</span>
        <Input
          className="col-span-3"
          value={activeWatcher.name}
          onChange={(e) =>
            updateWatcher({
              ...activeWatcher,
              name: e.target.value
            })
          }
        />
      </Label>
      <div className="grid grid-cols-4 gap-4">
        <Label>Position</Label>
        {renderAxes("position")}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Label>Look at</Label>
        {renderAxes("lookAt")}
      </div>
      <Button
        disabled={loading}
        onClick={saveWatchers}
        className="ml-auto mt-2 px-4 sticky bottom-0"
      >
        Save
      </Button>
    </div>
  );
};

export default WatcherInput;
