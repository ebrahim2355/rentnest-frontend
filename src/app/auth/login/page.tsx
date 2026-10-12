import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import Skeleton from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Login",
};

const FormSkeleton = () => {
  return (
    <div className="space-y-5">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-12" />
    </div>
  );
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 mb-8 text-muted-foreground">Login to manage your rentals, listings and payments.</p>
      <Suspense fallback={<FormSkeleton />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
