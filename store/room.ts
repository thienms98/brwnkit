import { RoomObject as IRoomObject } from "@/generated/prisma/client";
import { Object3D } from "three";
import { create } from "zustand";

interface RoomObject {
  object: Object3D;
  hotspot?: { x: number; y: number; z: number };
  product?: number;
}

interface RoomStore {
  room: {
    objects: Map<string, RoomObject>;
  };
  setObjects: (object3Ds: Object3D[], roomObjects: IRoomObject[]) => void;
  selectedMesh: Object3D | null;
  setSelectedMesh: (mesh: Object3D | null) => void;
}

export const useRoom = create<RoomStore>((set) => ({
  room: { objects: new Map() },
  selectedMesh: null,
  setObjects: (object3Ds, roomObjects) =>
    set((state) => {
      const newObjects = new Map(state.room.objects); // new Map = new reference

      object3Ds.forEach((object3D) => {
        const roomObject = roomObjects.find(
          (obj) => obj.name === object3D.name
        );

        const { x, y, z } = object3D.position;
        newObjects.set(object3D.name, {
          object: object3D,
          hotspot: { x, y, z },
          product: roomObject?.productId
        });
      });

      return { room: { ...state.room, objects: newObjects } };
    }),
  setSelectedMesh: (mesh) => set(() => ({ selectedMesh: mesh }))
}));
