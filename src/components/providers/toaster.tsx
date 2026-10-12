"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

const Toaster = () => {
  const { resolvedTheme } = useTheme();

  return <SonnerToaster richColors closeButton position="top-right" theme={resolvedTheme === "dark" ? "dark" : "light"} />;
};

export default Toaster;
