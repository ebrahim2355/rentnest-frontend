"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ApiError, showErrorToast } from "@/lib/api";

const shouldRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return false;
  }

  return failureCount < 1;
};

const isExpiredSession = (error: unknown) => error instanceof ApiError && error.status === 401;

const createQueryClient = (onExpiredSession: (client: QueryClient) => void) => {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isExpiredSession(error)) {
          onExpiredSession(client);
          return;
        }

        if (query.meta?.silent) {
          return;
        }

        showErrorToast(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isExpiredSession(error)) {
          onExpiredSession(client);
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
        networkMode: "always",
        refetchOnReconnect: true,
      },
      mutations: {
        networkMode: "always",
      },
    },
  });

  return client;
};

const QueryProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [queryClient] = useState(() =>
    createQueryClient((client) => {
      const { pathname, search } = window.location;

      if (pathname.startsWith("/auth")) {
        return;
      }

      client.setQueryData(["auth", "me"], null);
      router.replace(`/auth/login?expired=1&redirect=${encodeURIComponent(`${pathname}${search}`)}`);
    })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
