import ProductForm from "@/app/admin/_components/products/product-form";
import { Product } from "@/generated/prisma/client";
import req from "@/lib/req";
import { notFound } from "next/navigation";

export default async function PDP({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;

  try {
    const { data } = await req.get<{ product: Product }>(`product/${id}`);

    product = data.product;
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }
  return <ProductForm product={product} />;
}
