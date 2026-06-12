import { verifyAndRotate } from "@/lib/jwt";
import { getCookiesTokens } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken } = getCookiesTokens(req);

  if (!accessToken) throw new Error("Invalid Access token");
  if (!refreshToken) throw new Error("Invalid Refresh token");

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await verifyAndRotate(refreshToken);

  const cookieStore = await cookies();
  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60
  });

  cookieStore.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60
  });

  return NextResponse.json({ accessToken });
}
