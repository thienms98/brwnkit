import { Product } from "@/generated/prisma/client";
import req from "@/lib/req";

export const productServices = {
  async getProducts(params: { page?: number; q?: string }) {
    const { data } = await req.get<{ products: Product[] }>(`/product`, {
      params
    });

    return data;
  }
};
