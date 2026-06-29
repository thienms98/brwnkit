"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Dropzone from "@/components/ui/dropzone";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/generated/prisma/client";
import { upload } from "@/lib/upload";
import { productServices } from "@/services/product.service";
import { useUnsavedChanges } from "@/store/unsaved-changes";
import { useSelector } from "@tanstack/react-store";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleIcon,
  CircleXIcon
} from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Bug title must be at least 1 characters.")
    .max(50, "Bug title must be at most 50 characters."),
  thumbnail: z.instanceof(File).nullable().optional(),
  price: z.number(),
  modelUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;
type Status = "success" | "loading" | "error" | "none";
interface ToastPayload {
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

export default function ProductForm({ product }: { product?: Product }) {
  const toastId = "submit-toast";

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

  const form = useForm({
    defaultValues: {
      title: product?.title,
      price: Number(product?.price || 0),
      thumbnail: null as File | null
    } as FormValues,
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
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
          duration: 3000
        });

        try {
          await productServices.createProduct({ ...value, thumbnail: url });
          payload.create = "success";

          form.reset({ ...value, thumbnail: null });
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
    }
  });

  const { register, unregister, setDirty } = useUnsavedChanges();

  useEffect(() => {
    register(
      async () => {
        form.handleSubmit();
      },
      () => {
        form.reset();
      }
    );
    return () => unregister();
  }, []);

  const isDirty = useSelector(form.store, (state) => state.isDirty);

  useEffect(() => {
    console.log("🚀 ~ ProductForm ~ isDirty:", isDirty);
    setDirty(isDirty);
  }, [isDirty]);

  return (
    <Card className="container mx-auto">
      <CardHeader>
        <CardTitle className="font-semibold text-lg">Create Product</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <form
          id="bug-report-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Product&#39;s name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Login button not working on mobile"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="thumbnail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
                    <Dropzone
                      value={product?.thumbnail}
                      onChange={field.handleChange}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      type="number"
                      onChange={(e) => field.handleChange(+e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Login button not working on mobile"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
