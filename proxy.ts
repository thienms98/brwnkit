import { NextRequest, NextResponse } from "next/server";
import { getValidPayload, verifyAndRotate } from "./lib/jwt";
import { ROLE } from "./generated/prisma/enums";

export async function proxy(req: NextRequest) {
  console.log("proxyyys");
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  let payload = accessToken ? getValidPayload(accessToken) : null;

  if (!payload) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await verifyAndRotate(refreshToken);

      payload = getValidPayload(newAccessToken);
      if (!payload) throw new Error("invalid rotated token");

      const response = checkRoleAccess(payload.role, pathname, req);
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
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  return checkRoleAccess(payload.role, pathname, req);
}

function checkRoleAccess(
  role: string,
  pathname: string,
  req: NextRequest
): NextResponse {
  if (pathname.startsWith("/admin") && role !== ROLE.ADMIN) {
    return NextResponse.redirect(new URL("/", req.url)); // hoặc trang 403
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|(?:.*\\/)?(?:login|register|forgot-password|reset-password)$|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot|mp4|pdf|txt|json|xml)$).*)"
  ]
};
