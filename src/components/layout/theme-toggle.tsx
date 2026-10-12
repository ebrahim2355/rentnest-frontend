"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative inline-flex size-9 items-center justify-center rounded-lg border bg-card text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Sun className="size-4 scale-100 rotate-0 transition dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition dark:scale-100 dark:rotate-0" />
    </button>
  );
};

export default ThemeToggle;
