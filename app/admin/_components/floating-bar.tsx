"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUnsavedChanges } from "@/store/unsaved-changes";

const FloatingBar = () => {
  const { isDirty, isSaving, save, discard } = useUnsavedChanges();

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-1/2 transition-all text-sm w-full max-w-1/2 flex items-center gap-2 border shadow-lg p-2 bg-background",
        isDirty ? "top-10" : "-top-10 opacity-0"
      )}
    >
      <div className="mr-auto">Save changes</div>
      <Button variant={"secondary"} onClick={() => isDirty && discard()}>
        Discard
      </Button>
      <Button onClick={() => isDirty && save()} disabled={isSaving}>
        Save
      </Button>
    </div>
  );
};

export default FloatingBar;
