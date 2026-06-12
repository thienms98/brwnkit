import { generateTokens } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { LoginPayload } from "@/types/auth";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, username, rememberMe } = (await req.json()) as LoginPayload;

  try {
    const user = await prisma.account.findUniqueOrThrow({
      where: {
        username
      }
    });

    const verify = await compare(password, user.password);
    if (!verify) throw new Error("Password not correct");

    const { accessToken, refreshToken } = generateTokens(user);

    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: 15 * 60 * 1000
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined
    });

    return NextResponse.json({ accessToken });
  } catch (err) {
    console.error("[LOGIN_ERROR]: ", err);

    return NextResponse.json(
      { message: "Username or password is not correct" },
      { status: 401 }
    );
  }
}
