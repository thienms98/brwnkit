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
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
          <SheetContent>
            <h3 className="capitalize text-lg">{product.title}</h3>
            <p>
              {new Intl.NumberFormat("en-EN", {
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger"
              }).format(Number(product.price))}
            </p>
          </SheetContent>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductSheet;
