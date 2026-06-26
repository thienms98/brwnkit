import { Product } from "@/generated/prisma/client";

const ProductDetail = ({ product }: { product: Product }) => {
  return <div>ProductDetail: {product.title}</div>;
};

export default ProductDetail;
