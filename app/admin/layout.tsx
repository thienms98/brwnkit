import Header from "./_components/header";
import { getJwtTimeLeft } from "@/lib/utils";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let username = "";

  if (accessToken) {
    // console.log(getJwtTimeLeft(accessToken, process.env.ACCESS_SECRET!));

    try {
      const payload = verify(accessToken, process.env.ACCESS_SECRET!);
      username = String(payload.sub || "");
    } catch {
      username = "";
    }
  }

  return (
    <div className="flex-1 h-screen">
      <Header username={username} />
      <div className="flex container mx-auto h-full">
        <nav className="flex flex-col gap-4 border-r h-full">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
