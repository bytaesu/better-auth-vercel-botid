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

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = async (values: SignInValues) => {
    setSignedInEmail(null);
    form.clearErrors("root");

    try {
      const { data, error } = await authClient.signIn.email(values);

      if (error) {
        form.setError("root", {
          type: error.code ?? "server",
          message: error.message ?? "Please try again.",
        });
        return;
      }

      setSignedInEmail(data?.user.email ?? values.email);
      form.reset({ email: values.email, password: "" });
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
                autoComplete="current-password"
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
        {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      {rootError && (
        <Alert variant="destructive">
          <AlertTitle>Sign-in failed</AlertTitle>
          <AlertDescription>{rootError.message}</AlertDescription>
        </Alert>
      )}

      {signedInEmail && (
        <Alert role="status">
          <AlertTitle>Signed in</AlertTitle>
          <AlertDescription>{signedInEmail}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
