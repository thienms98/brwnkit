import { getJwtTimeLeft } from "@/lib/utils";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const Header = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let username = "";

  if (accessToken) {
    console.log(getJwtTimeLeft(accessToken, process.env.ACCESS_SECRET!));

    try {
      const payload = verify(accessToken, process.env.ACCESS_SECRET!);
      username = String(payload.sub || "");
    } catch {
      username = "";
    }
  }

  return <div>{username}</div>;
};

export default Header;
