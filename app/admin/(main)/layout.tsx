import Header from "../_components/header";
import { getJwtTimeLeft } from "@/lib/utils";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import { AppSidebar } from "../_components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import FloatingBar from "../_components/floating-bar";

const AdminLayout = async ({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
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
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 h-screen relative flex flex-col">
        <Header username={username} />
        <main className="flex-1">{children}</main>
        {modal}
        <FloatingBar />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
