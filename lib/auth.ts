import { accessSecret } from "@/constants/keys";
import { verify } from "jsonwebtoken";
import { NextRequest } from "next/server";

export function getCookiesTokens(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  return {
    accessToken,
    refreshToken
  };
}

export const getAuth = (req: NextRequest) => {
  const { accessToken } = getCookiesTokens(req);
  if (!accessToken) throw new Error("Unauthorized");

  try {
    const payload = verify(accessToken, accessSecret) as {
      sub: string;
      role: string;
    };

    return payload;
  } catch {
    throw new Error("Invalid access token");
  }
};
