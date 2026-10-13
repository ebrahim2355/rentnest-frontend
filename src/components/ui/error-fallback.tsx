"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Button, { buttonStyles } from "./button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
  homeLabel?: string;
}

const ErrorFallback = ({ error, reset, homeHref = "/", homeLabel = "Back to home" }: ErrorFallbackProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-8" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">An unexpected error stopped this page from loading. You can try again, and if it keeps happening please come back a little later.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Link href={homeHref} className={buttonStyles("outline", "md")}>
          {homeLabel}
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;
