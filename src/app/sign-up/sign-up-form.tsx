"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters."),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const submit = async (values: SignUpValues) => {
    setCreatedEmail(null);
    form.clearErrors("root");

    try {
      const { data, error } = await authClient.signUp.email(values);

      if (error) {
        form.setError("root", {
          type: error.code ?? "server",
          message: error.message ?? "Please try again.",
        });
        return;
      }

      setCreatedEmail(data?.user.email ?? values.email);
      form.reset({ name: "", email: values.email, password: "" });
    } catch {
      form.setError("root", {
        type: "network",
        message: "Could not reach Better Auth.",
      });
    }
  };

  const rootError = form.formState.errors.root;

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-5">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                aria-invalid={fieldState.invalid}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
        {form.formState.isSubmitting ? "Creating account…" : "Sign up"}
      </Button>

      {rootError && (
        <Alert variant="destructive">
          <AlertTitle>Sign-up failed</AlertTitle>
          <AlertDescription>{rootError.message}</AlertDescription>
        </Alert>
      )}

      {createdEmail && (
        <Alert role="status">
          <AlertTitle>Account created</AlertTitle>
          <AlertDescription>{createdEmail}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
