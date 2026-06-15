"use client";

import ProductCreate from "@/app/admin/_components/products/product-create";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const AdminProductAddModal = () => {
  const { back } = useRouter();

  return (
    <Dialog open onOpenChange={back}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create product</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ProductCreate />
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductAddModal;
