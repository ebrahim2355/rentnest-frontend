"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { StatusBadge } from "@/components/ui/badge";
import { showErrorToast } from "@/lib/api";
import { DASHBOARD_HOME } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

const UserMenu = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border bg-card py-1 pr-2 pl-1 text-sm font-medium transition hover:bg-muted"
      >
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">{getInitials(user.name)}</span>
        <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-card p-2 shadow-lg">
          <div className="border-b px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <StatusBadge status={user.role} className="mt-2" />
          </div>
          <Link role="menuitem" href={DASHBOARD_HOME[user.role]} onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link role="menuitem" href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted">
            <UserRound className="size-4" />
            Profile
          </Link>
          <button role="menuitem" type="button" onClick={handleLogout} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-muted">
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
