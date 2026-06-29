import { Product } from "@/generated/prisma/client";
import { IRoomObject } from "@/types/room";
import { clsx, type ClassValue } from "clsx";
import { JwtPayload, verify } from "jsonwebtoken";
import { twMerge } from "tailwind-merge";
import { Object3D } from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function getJwtTimeLeft(token: string, secret: string) {
  try {
    const decodedToken = verify(token, secret) as JwtPayload;

    if (!decodedToken.exp) {
      return null;
    }

    const currentTime = Date.now() / 1000;
    const timeLeftSeconds = decodedToken.exp - currentTime;

    return timeLeftSeconds > 0 ? timeLeftSeconds : 0;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export const isObjectsDiff = (
  ref: IRoomObject[],
  target: Map<
    string,
    {
      object: Object3D;
      product?: Product;
    }
  >
) =>
  !target
    .values()
    .every(
      (item) =>
        item.product?.id ===
        ref.find((i) => i.name === item.object.name)?.productId
    );
