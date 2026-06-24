import { toast } from "sonner";
import { create } from "zustand";

interface UnsavedChangesStore {
  isDirty: boolean;
  isSaving: boolean;
  onSave: (() => Promise<void>) | null;
  onDiscard: (() => void) | null;
  register: (onSave: () => Promise<void>, onDiscard: () => void) => void;
  unregister: () => void;
  save: () => Promise<void>;
  discard: () => void;
  setDirty: (isDirty: boolean) => void;
}

export const useUnsavedChanges = create<UnsavedChangesStore>((set, get) => ({
  isDirty: false,
  isSaving: false,
  onSave: null,
  onDiscard: null,
  register: (onSave, onDiscard) => set({ onSave, onDiscard }),
  unregister: () => set({ onSave: null, onDiscard: null, isDirty: false }),
  save: async () => {
    const { onSave } = get();
    if (!onSave) return;
    set({ isSaving: true });
    try {
      await onSave();
      set({ isDirty: false });
    } catch {
      toast.error("Something went wrong");
    } finally {
      set({ isSaving: false });
    }
  },
  discard: () => {
    const { onDiscard } = get();
    if (!onDiscard) return;
    onDiscard();
    set({ isDirty: false });
  },
  setDirty: (isDirty) => set({ isDirty })
}));
