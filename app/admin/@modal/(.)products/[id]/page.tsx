import { Product } from "@/generated/prisma/client";
import req from "@/lib/req";

const PDPModal = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: product } = await req.get<Product>(`/product/${id}`);

  return <div>{product.title}</div>;
};

export default PDPModal;
