import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useProducts } from "@/hooks/queries/use-products";
import req from "@/lib/req";
import { productServices } from "@/services/product.service";
import { LoaderCircleIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const ProductSelector = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const { data, isLoading } = useProducts(page);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={isLoading} className="w-full">
          Select a product{" "}
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
                  <div key={prod.id} className="p-1">
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
