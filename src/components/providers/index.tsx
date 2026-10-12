import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import QueryProvider from "./query-provider";
import ThemeProvider from "./theme-provider";
import Toaster from "./toaster";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export default Providers;
