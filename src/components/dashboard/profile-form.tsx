"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { StatusBadge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form-field";
import Skeleton from "@/components/ui/skeleton";
import { api, applyFieldErrors, showErrorToast } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import type { User } from "@/types";

const ProfileFields = ({ user }: { user: User }) => {
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileValues) => api.patch<User>("/auth/me", { name: values.name, ...(values.phone ? { phone: values.phone } : {}) }),
    onSuccess: (result) => {
      setUser(result.data);
      reset({ name: result.data.name, phone: result.data.phone ?? "" });
      toast.success("Profile updated");
    },
    onError: (error) => {
      if (!applyFieldErrors(error, setError, ["name", "phone"])) {
        showErrorToast(error);
      }
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card className="flex flex-col items-center gap-3 p-6 text-center">
        <span className="inline-flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{getInitials(user.name)}</span>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-4" />
            {user.email}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={user.role} />
          <StatusBadge status={user.status} />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-4" />
          Member since {formatDate(user.createdAt)}
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Personal details</h2>
        <p className="mb-5 text-sm text-muted-foreground">Your email cannot be changed.</p>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-5">
          <Field label="Full name" htmlFor="profile-name" error={errors.name?.message} required>
            <Input id="profile-name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
          </Field>
          <Field label="Phone" htmlFor="profile-phone" error={errors.phone?.message} hint="Landlords and tenants use it to contact you">
            <Input id="profile-phone" type="tel" autoComplete="tel" placeholder="+8801XXXXXXXXX" aria-invalid={Boolean(errors.phone)} {...register("phone")} />
          </Field>
          <Field label="Email" htmlFor="profile-email">
            <Input id="profile-email" value={user.email} disabled readOnly />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const ProfileForm = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  return <ProfileFields key={user.id} user={user} />;
};

export default ProfileForm;
