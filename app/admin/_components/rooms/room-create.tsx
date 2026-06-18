"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import req from "@/lib/req";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Room's name must be at least 5 characters.")
    .max(32, "Room's name must be at most 32 characters."),
  url: z.string()
});

const RoomCreate = ({ onRoomCreate }: { onRoomCreate: () => void }) => {
  const form = useForm({
    defaultValues: {
      title: "",
      url: ""
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      console.log("submitting");
      await req.post("room", value);

      onRoomCreate();
    }
  });

  return (
    <form
      id="room-config"
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
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Living room"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="url">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Url</FieldLabel>
                <InputGroup>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Field className="mt-6 flex">
        <Button type="submit" form="bug-report-form">
          Create
        </Button>
      </Field>
    </form>
  );
};

export default RoomCreate;
