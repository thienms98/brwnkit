import { Suspense } from "react";
import Loading from "./loading";

const AdminProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default AdminProductsLayout;
