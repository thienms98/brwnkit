import { Object3D } from "three";
import { create } from "zustand";

interface RoomStore {
  room: {
    objects: Object3D[];
  };
  setObjects: (meshes: Object3D[]) => void;
  selectedMesh: Object3D | null;
  setSelectedMesh: (mesh: Object3D | null) => void;
}

export const useRoom = create<RoomStore>((set) => ({
  room: { objects: [] },
  selectedMesh: null,
  setObjects: (meshes) => set(() => ({ room: { objects: meshes } })),
  setSelectedMesh: (mesh) => set(() => ({ selectedMesh: mesh }))
}));
