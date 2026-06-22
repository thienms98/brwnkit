import { Product, Room, RoomObject } from "@/generated/prisma/client";

export interface Watcher {
  key: string;
  name: string;
  position: {
    [key in "x" | "y" | "z"]: number;
  };
  lookAt: {
    [key in "x" | "y" | "z"]: number;
  };
}

export interface IRoomObjects extends RoomObject {
  product: Product;
}

export interface IRoom extends Omit<Room, "watchers"> {
  watchers: Watcher[];
  roomObjects: RoomObject[];
}
