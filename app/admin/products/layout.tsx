import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

const AdminProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-3 px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Products</h1>
        <Link
          href="/admin/products/add"
          className={cn(
            buttonVariants(),
            "flex items-center gap-2 cursor-pointer"
          )}
        >
          <PlusIcon size={14} /> Add new product
        </Link>
      </div>

      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
};

export default AdminProductsLayout;
