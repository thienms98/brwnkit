import { Mesh } from "three";
import { create } from "zustand";

interface RoomStore {
  room: {
    objects: Mesh[];
  };
  setObjects: (meshes: Mesh[]) => void;
  selectedMesh: Mesh | null;
  setSelectedMesh: (mesh: Mesh | null) => void;
}

export const useRoom = create<RoomStore>((set) => ({
  room: { objects: [] },
  selectedMesh: null,
  setObjects: (meshes) => set(() => ({ room: { objects: meshes } })),
  setSelectedMesh: (mesh) => set(() => ({ selectedMesh: mesh }))
}));
