// hooks/use-products.ts

import { useQuery } from "@tanstack/react-query";
import { productServices } from "@/services/product.service";

export const useProducts = (page?: number, q?: string) => {
  return useQuery({
    queryKey: ["products", page, q],
    queryFn: () =>
      productServices.getProducts({
        page,
        q
      })
  });
};
