import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndRotate } from "./lib/jwt";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (accessToken && verify(accessToken, process.env.ACCESS_SECRET!)) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await verifyAndRotate(refreshToken);

  const response = NextResponse.next();
  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60
  });

  response.cookies.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!api|login|register|forgot-password|reset-password|_next/static|_next/image|favicon.ico).*)"
  ]
};
