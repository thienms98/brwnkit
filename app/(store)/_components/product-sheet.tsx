"use client";

import { Product } from "@/generated/prisma/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";

const ProductSheet = ({ product }: { product: Product }) => {
  const { back, refresh } = useRouter();
  return (
    <Sheet open onOpenChange={back}>
      <SheetContent className="h-4/5! translate-y-1/10">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>Product {product.title}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductSheet;
