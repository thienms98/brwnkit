import { Account } from "@/generated/prisma/client";
import { sign, verify } from "jsonwebtoken";
import { v4 } from "uuid";
import { prisma } from "./prisma";

const accessSecret = process.env.ACCESS_SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;

export const generateTokens = ({ username, role }: Account) => {
  const accessToken = sign(
    {
      sub: username,
      role: role
    },
    accessSecret,
    {
      expiresIn: "15m"
    }
  );

  const refreshToken = sign(
    {
      sub: username,
      jti: v4()
    },
    refreshSecret,
    {
      expiresIn: "30d"
    }
  );

  return { accessToken, refreshToken };
};

export const verifyAndRotate = async (refreshToken: string) => {
  let payload: {
    sub: string;
    jti: string;
  };
  try {
    payload = verify(refreshToken, refreshSecret) as {
      sub: string;
      jti: string;
    };
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await prisma.account.findFirstOrThrow({
    where: {
      username: payload.sub
    }
  });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  await prisma.account.update({
    where: {
      username: user.username
    },
    data: {
      refreshToken,
      tokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  return { accessToken, refreshToken: newRefreshToken };
};
