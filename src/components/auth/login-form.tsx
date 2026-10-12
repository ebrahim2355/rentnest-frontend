"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import { applyFieldErrors, getErrorText } from "@/lib/api";
import { DASHBOARD_HOME, DEMO_ACCOUNTS } from "@/lib/constants";
import { loginSchema, type LoginValues } from "@/lib/validations";
import PasswordInput from "./password-input";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);

    try {
      const user = await login(values);
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : DASHBOARD_HOME[user.role];

      toast.success(`Welcome back, ${user.name}`);
      router.replace(target);
      router.refresh();
    } catch (error) {
      if (applyFieldErrors(error, setError, ["email", "password"])) {
        return;
      }

      const { title, description } = getErrorText(error);

      setFormError(description ?? title);
      toast.error(title, description ? { description } : undefined);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setFormError(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {formError}
        </p>
      )}

      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
      </Field>

      <Field label="Password" htmlFor="password" error={errors.password?.message} required>
        <PasswordInput id="password" autoComplete="current-password" placeholder="Your password" aria-invalid={Boolean(errors.password)} {...register("password")} />
      </Field>

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Login
      </Button>

      <div className="rounded-lg border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Try a demo account</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Button key={account.label} variant="outline" size="sm" onClick={() => fillDemo(account.email, account.password)}>
              {account.label}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to RentNest?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
