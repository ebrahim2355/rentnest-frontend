"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import Button from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-field";
import { applyFieldErrors, getErrorText } from "@/lib/api";
import { DASHBOARD_HOME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import PasswordInput from "./password-input";

const roleOptions = [
  { value: "TENANT", label: "I want to rent", description: "Browse listings and send rental requests", icon: Search },
  { value: "LANDLORD", label: "I own a property", description: "List properties and manage requests", icon: Building2 },
] as const;

const RegisterForm = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", role: "TENANT", password: "", confirmPassword: "" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterValues) => {
    setFormError(null);

    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.phone ? { phone: values.phone } : {}),
      });

      toast.success("Account created", { description: `Welcome to RentNest, ${user.name}` });
      router.replace(DASHBOARD_HOME[user.role]);
      router.refresh();
    } catch (error) {
      if (applyFieldErrors(error, setError, ["name", "email", "phone", "role", "password"])) {
        return;
      }

      const { title, description } = getErrorText(error);

      setFormError(description ?? title);
      toast.error(title, description ? { description } : undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {formError}
        </p>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-medium">How will you use RentNest?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border bg-card p-4 transition has-focus-visible:outline-2 has-focus-visible:outline-ring",
                selectedRole === option.value ? "border-primary ring-1 ring-primary" : "hover:border-input"
              )}
            >
              <input type="radio" value={option.value} className="sr-only" {...register("role")} />
              <option.icon className={cn("size-5", selectedRole === option.value ? "text-primary" : "text-muted-foreground")} />
              <span className="text-sm font-semibold">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </label>
          ))}
        </div>
        {errors.role && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
            {errors.role.message}
          </p>
        )}
      </fieldset>

      <Field label="Full name" htmlFor="name" error={errors.name?.message} required>
        <Input id="name" autoComplete="name" placeholder="Your full name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} {...register("email")} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message} hint="Optional">
          <Input id="phone" type="tel" autoComplete="tel" placeholder="+8801XXXXXXXXX" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Password" htmlFor="password" error={errors.password?.message} required>
          <PasswordInput id="password" autoComplete="new-password" placeholder="At least 6 characters" aria-invalid={Boolean(errors.password)} {...register("password")} />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
          <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Repeat the password" aria-invalid={Boolean(errors.confirmPassword)} {...register("confirmPassword")} />
        </Field>
      </div>

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
