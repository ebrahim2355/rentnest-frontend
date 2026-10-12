"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AuthActions from "./auth-actions";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn("rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted", isActive(link.href) ? "text-primary" : "text-muted-foreground")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthActions />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border bg-card md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t bg-background px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn("block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted", isActive(link.href) ? "text-primary" : "text-foreground")}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/auth/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted sm:hidden">
            Login
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
