import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-2 mb-8 text-muted-foreground">Join RentNest as a tenant or as a landlord.</p>
      <RegisterForm />
    </>
  );
}
