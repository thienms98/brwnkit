"use client";

import { useForm } from "@tanstack/react-form";
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
import { Product } from "@/generated/prisma/client";
import { useUnsavedChanges } from "@/store/unsaved-changes";
import { useSelector } from "@tanstack/react-store";
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

export type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({
  product,
  onSubmit
}: {
  product?: Product;
  onSubmit?: (value: FormValues) => void;
}) {
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
      onSubmit?.(value);
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
          onChange={() => {
            setDirty(form.store.state.isDirty);
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
