import { prisma } from "@/lib/prisma";
import { getCookiesTokens } from "@/lib/utils";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken } = getCookiesTokens(req);
  if (accessToken) {
    try {
      const { sub } = verify(accessToken, process.env.ACCESS_SECRET!) as {
        sub: string;
      };

      await prisma.account.update({
        where: {
          username: sub
        },
        data: {
          refreshToken: null
        }
      });
    } catch {
      // token invalid/expired — vẫn xoá cookie bình thường
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}
