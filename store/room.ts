import { Product } from "@/generated/prisma/client";
import { IRoomObject } from "@/types/room";
import { Object3D } from "three";
import { create } from "zustand";

interface RoomObject {
  object: Object3D;
  product?: Product;
}

interface RoomStore {
  room: {
    objects: Map<string, RoomObject>;
  };
  setObjects: (object3Ds: Object3D[], roomObjects: IRoomObject[]) => void;
  resetObjects: (roomObjects: IRoomObject[]) => void;
  selectedMesh: RoomObject | null;
  setSelectedMesh: (name: string | null) => void;
  updateSelectedMesh: (payload: Partial<RoomObject>) => void;
}

export const useRoom = create<RoomStore>((set) => ({
  room: { objects: new Map() },
  selectedMesh: null,
  setObjects: (object3Ds, roomObjects) =>
    set((state) => {
      const newObjects = new Map(state.room.objects);

      object3Ds.forEach((object3D) => {
        const roomObject = roomObjects.find(
          (obj) => obj.name === object3D.name
        );

        newObjects.set(object3D.name, {
          object: object3D,
          product: roomObject?.product
        });
      });

      return { room: { ...state.room, objects: newObjects } };
    }),
  resetObjects: (objects) =>
    set((state) => {
      const newObjects = new Map(state.room.objects);

      newObjects.entries().forEach(([key, value]) => {
        const product = objects.find((item) => item.name === key)?.product;

        newObjects.set(key, {
          object: value.object,
          product
        });
      });

      return { room: { ...state.room, objects: newObjects } };
    }),
  setSelectedMesh: (name) =>
    set((state) => ({
      selectedMesh: name ? state.room.objects.get(name) : null
    })),
  updateSelectedMesh: (payload) =>
    set((state) => {
      if (!state.selectedMesh) return state;
      const name = state.selectedMesh.object.name;
      const newSelectedMesh = { ...state.selectedMesh, ...payload };

      const newObjects = new Map(state.room.objects);
      newObjects.set(name, newSelectedMesh);

      return {
        room: {
          objects: newObjects
        },
        selectedMesh: newSelectedMesh
      };
    })
}));
