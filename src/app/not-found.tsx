import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/layout/logo";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b px-4 py-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Compass className="size-8" />
        </span>
        <p className="mt-6 text-sm font-semibold tracking-widest text-primary uppercase">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">We could not find that page</h1>
        <p className="mt-2 max-w-md text-muted-foreground">The page may have been moved, or the property may no longer be listed on RentNest.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles("primary", "md")}>
            Back to home
          </Link>
          <Link href="/properties" className={buttonStyles("outline", "md")}>
            Browse properties
          </Link>
        </div>
      </main>
    </div>
  );
}
