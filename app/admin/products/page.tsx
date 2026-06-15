import { Product } from "@/generated/prisma/client";
import req from "@/lib/req";

const AdminProducts = async ({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const page = (await searchParams).page;
  const pageParam = page ? `page=${page}` : "";
  const {
    data: { products }
  } = await req.get<{ products: Product[] }>(`/product?${pageParam}`);

  return (
    <div className="py-3 px-6">
      {products.map((prod) => (
        <div key={prod.id}>{prod.title}</div>
      ))}
    </div>
  );
};

export default AdminProducts;
