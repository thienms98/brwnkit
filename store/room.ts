import { Object3D } from "three";
import { create } from "zustand";

interface RoomObject {
  object: Object3D;
  hotspot?: { x: number; y: number; z: number };
}

interface RoomStore {
  room: {
    objects: Map<string, RoomObject>;
  };
  setObjects: (meshes: Object3D[]) => void;
  selectedMesh: Object3D | null;
  setSelectedMesh: (mesh: Object3D | null) => void;
}

export const useRoom = create<RoomStore>((set) => ({
  room: { objects: new Map() },
  selectedMesh: null,
  setObjects: (meshes) =>
    set((state) => {
      const newObjects = new Map(state.room.objects); // new Map = new reference

      meshes.forEach((object) => {
        const { x, y, z } = object.position;
        newObjects.set(object.name, {
          object,
          hotspot: { x, y, z }
        });
      });

      return { room: { ...state.room, objects: newObjects } };
    }),
  setSelectedMesh: (mesh) => set(() => ({ selectedMesh: mesh }))
}));
