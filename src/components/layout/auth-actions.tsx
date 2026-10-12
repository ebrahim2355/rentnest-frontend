"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { buttonStyles } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import UserMenu from "./user-menu";

const AuthActions = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-9 w-24 rounded-lg" />;
  }

  if (user) {
    return <UserMenu user={user} />;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login" className={buttonStyles("ghost", "sm", "hidden sm:inline-flex")}>
        Login
      </Link>
      <Link href="/auth/register" className={buttonStyles("primary", "sm")}>
        Sign up
      </Link>
    </div>
  );
};

export default AuthActions;
