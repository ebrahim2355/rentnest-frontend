"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">RentNest ran into a problem</h1>
        <p className="max-w-md text-muted-foreground">The app could not load. Please try again.</p>
        <button type="button" onClick={reset} className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Try again
        </button>
      </body>
    </html>
  );
}
