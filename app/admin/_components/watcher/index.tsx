import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import WatcherInput from "./watcher-input";
import WatcherList from "./watcher-list";

const Watcher = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 mt-4 shadow-md"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-start gap-4 p-4"
        >
          <h4 className="text-sm font-semibold">Watchers</h4>
          <ChevronsUpDown className="ml-auto" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2">
        <WatcherList />
        <WatcherInput />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Watcher;
