import { Watcher } from "@/types/room";
import { create } from "zustand";

interface WatcherStore {
  watchers: Watcher[];
  setWatchers: (watchers: Watcher[]) => void;
  addWatcher: (watcher: Watcher) => void;
  updateWatcher: (watcher: Watcher) => void;
  removeWatcher: () => void;
  activeWatcher?: Watcher;
  setActiveWatcher: (key: string) => void;
}

export const useWatcher = create<WatcherStore>()((set) => ({
  watchers: [],
  activeWatcher: undefined,

  setWatchers: (watchers) => set({ watchers }),

  addWatcher: (watcher) =>
    set((state) => ({ watchers: [...state.watchers, watcher] })),

  updateWatcher: (watcher) =>
    set((state) => ({
      watchers: state.watchers.map((item) =>
        item.key === state.activeWatcher?.key ? watcher : item
      ),
      activeWatcher: watcher
    })),

  removeWatcher: () =>
    set((state) => ({
      watchers: state.watchers.filter(
        (item) => item.key !== state.activeWatcher?.key
      ),
      activeWatcher: undefined
    })),

  setActiveWatcher: (key) =>
    set((state) => ({
      activeWatcher: state.watchers.find((i) => i.key === key)
    }))
}));
