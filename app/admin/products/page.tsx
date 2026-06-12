import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

const AdminProducts = () => {
  return (
    <div className="py-3 px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Products</h1>
        <Button className="flex items-center gap-2 cursor-pointer">
          <PlusIcon size={14} /> Add new product
        </Button>
      </div>
    </div>
  );
};

export default AdminProducts;
