import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Product } from "@/generated/prisma/client";
import { useProducts } from "@/hooks/queries/use-products";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

const ProductSelector = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const { data, isLoading } = useProducts(page);
  const [selectedProd, setSelectedProd] = useState<Product>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={isLoading} className="w-full">
          {selectedProd ? selectedProd.title : "Select a product"}
          {isLoading && <LoaderCircleIcon size={16} className="animate-spin" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-2">
          <Input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="h-8"
          />

          <div>
            {data
              ? data.products.map((prod) => (
                  <div
                    key={prod.id}
                    className={cn(
                      "p-1 px-2 rouned-sm transition-colors cursor-pointer",
                      selectedProd?.id === prod.id
                        ? "bg-primary"
                        : "hover:bg-primary/50"
                    )}
                    onClick={() => setSelectedProd(prod)}
                  >
                    {prod.title}
                  </div>
                ))
              : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSelector;
