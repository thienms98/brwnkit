import ProductSheet from "@/app/(store)/_components/product-sheet";
import req from "@/lib/req";

const ProductDetailIntercepting = async ({
  params
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const {
    data: { product }
  } = await req.get(`/product/${slug}`);

  return <ProductSheet product={product} />;
};
export default ProductDetailIntercepting;
