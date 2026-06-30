"use client";

import { Product } from "@/generated/prisma/client";
import ProductForm, { FormValues } from "./product-form";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { upload } from "@/lib/upload";
import { productServices } from "@/services/product.service";
import { useRouter } from "next/navigation";

type Status = "success" | "loading" | "error" | "none";
export interface ToastPayload {
  upload?: Status;
  progress: number;
  create?: Status;
}

const Status = ({ stat }: { stat?: Status }) => {
  switch (stat) {
    case "loading":
      return <CircleDashedIcon className="text-primary animate-spin" />;
    case "success":
      return <CircleCheckIcon className="text-primary" />;
    case "error":
      return <CircleXIcon className="text-destructive" />;
    default:
      return <CircleIcon />;
  }
};

const ProductCreate = ({ product }: { product: Product }) => {
  const toastId = "submit-toast";
  const { push } = useRouter();

  const renderToast = ({ upload, progress, create }: ToastPayload) => {
    return (
      <div className="w-64 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Status stat={upload} />
          <div className="flex-1">
            <p className="text-sm">Upload thumbnail</p>
            {upload === "loading" && (
              <Progress key={progress} value={progress} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Status stat={create} />
          <div className="flex-1">
            <p className="text-sm">Create product</p>
            {create === "loading" && (
              <div className="w-full h-1 mt-1 rounded-full bg-muted relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1/5 h-1 bg-primary transition-all animate-horizontal-loading"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const onSubmit = async (value: FormValues) => {
    const payload: ToastPayload = {
      upload: "loading",
      progress: 0
    };

    toast(renderToast(payload), {
      id: toastId,
      duration: Infinity
    });

    try {
      const { url = "" } = value.thumbnail
        ? await upload(value.thumbnail, (p) => {
            payload.progress = p;
            toast(renderToast(payload), {
              id: toastId,
              duration: Infinity
            });
          })
        : {};

      payload.upload = "success";
      payload.create = "loading";

      toast(renderToast(payload), {
        id: toastId,
        duration: Infinity
      });

      try {
        const {
          data: {
            product: { slug }
          }
        } = await productServices.createProduct({ ...value, thumbnail: url });
        payload.create = "success";

        push(`/admin/products/${slug}`);
      } catch {
        payload.create = "error";
      } finally {
        toast(renderToast(payload), {
          id: toastId,
          duration: 3000
        });
      }
    } catch {
      payload.upload = "error";
      toast(renderToast(payload), {
        id: toastId,
        duration: 3000
      });
    }
  };

  return <ProductForm product={product} onSubmit={onSubmit} />;
};

export default ProductCreate;
