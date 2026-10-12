"use client";

import {
  Building2,
  ClipboardList,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  PlusCircle,
  Search,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import AuthActions from "@/components/layout/auth-actions";
import Logo from "@/components/layout/logo";
import ThemeToggle from "@/components/layout/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const navigation: Record<Role, NavItem[]> = {
  TENANT: [
    { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/tenant/requests", label: "My requests", icon: ClipboardList },
    { href: "/dashboard/tenant/payments", label: "Payments", icon: CreditCard },
    { href: "/properties", label: "Browse properties", icon: Search },
  ],
  LANDLORD: [
    { href: "/dashboard/landlord", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/landlord/properties", label: "My properties", icon: Building2, exact: true },
    { href: "/dashboard/landlord/properties/new", label: "Add property", icon: PlusCircle },
    { href: "/dashboard/landlord/requests", label: "Rental requests", icon: ClipboardList },
    { href: "/dashboard/landlord/reviews", label: "Reviews", icon: MessageSquareText },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/admin/rentals", label: "Rental requests", icon: ClipboardList },
    { href: "/dashboard/admin/categories", label: "Categories", icon: FolderTree },
  ],
};

const profileItem: NavItem = { href: "/dashboard/profile", label: "Profile", icon: UserRound };

interface NavListProps {
  items: NavItem[];
  pathname: string | null;
  onNavigate?: () => void;
}

const NavList = ({ items, pathname, onNavigate }: NavListProps) => {
  const isActive = (item: NavItem) => pathname !== null && (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(item) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              isActive(item) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ActiveNavList = (props: Omit<NavListProps, "pathname">) => {
  const pathname = usePathname();

  return <NavList pathname={pathname} {...props} />;
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>
    );
  }

  const items = [...navigation[user.role], profileItem];

  return (
    <nav aria-label="Dashboard">
      <p className="mb-3 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{user.role.toLowerCase()} menu</p>
      <Suspense fallback={<NavList items={items} pathname={null} />}>
        <ActiveNavList items={items} {...(onNavigate ? { onNavigate } : {})} />
      </Suspense>
    </nav>
  );
};

const DashboardShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-y-auto p-4">
          <Logo className="px-2 pt-1" />
          <SidebarContent />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/60" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[85%] flex-col gap-6 overflow-y-auto border-r bg-card p-4">
            <div className="flex items-center justify-between">
              <Logo className="px-2" />
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border bg-card lg:hidden">
              <Menu className="size-4" />
            </button>
            <Link href="/" className="text-sm font-medium text-muted-foreground transition hover:text-primary">
              Back to site
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthActions />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
