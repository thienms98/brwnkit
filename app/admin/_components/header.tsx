"use client";

import { Button } from "@/components/ui/button";
import req from "@/lib/req";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Header = ({ username }: { username: string }) => {
  const { push } = useRouter();

  const logout = async () => {
    try {
      await req.post("auth/logout");
      push("/admin/login");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="shadow-md">
      <div className="flex justify-end items-center gap-5 p-3 container mx-auto">
        <div className="">Hello, {username}</div>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default Header;
