import { clsx, type ClassValue } from "clsx";
import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookiesTokens(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  return {
    accessToken,
    refreshToken
  };
}

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
