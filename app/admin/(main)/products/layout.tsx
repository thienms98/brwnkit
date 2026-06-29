import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

const AdminProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-3 px-6">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default AdminProductsLayout;
