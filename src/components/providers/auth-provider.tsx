"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { authApi } from "@/lib/api";
import { parseApiResponse } from "@/lib/http";
import type { Role, User } from "@/types";

interface LoginValues {
  email: string;
  password: string;
}

interface RegisterValues extends LoginValues {
  name: string;
  role: Exclude<Role, "ADMIN">;
  phone?: string | undefined;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (values: LoginValues) => Promise<User>;
  register: (values: RegisterValues) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const sessionKey = ["auth", "me"];

const AuthContext = createContext<AuthContextValue | null>(null);

const fetchSession = async () => {
  const response = await fetch("/api/auth/me");
  const result = await parseApiResponse<User | null>(response);

  return result.data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: sessionKey,
    queryFn: fetchSession,
    staleTime: 5 * 60_000,
    retry: false,
    meta: { silent: true },
  });

  const setUser = useCallback(
    (user: User | null) => {
      queryClient.setQueryData(sessionKey, user);
    },
    [queryClient]
  );

  const login = useCallback(
    async (values: LoginValues) => {
      const result = await authApi.login<User>(values);
      queryClient.clear();
      setUser(result.data);

      return result.data;
    },
    [queryClient, setUser]
  );

  const register = useCallback(
    async (values: RegisterValues) => {
      const result = await authApi.register<User>(values);
      queryClient.clear();
      setUser(result.data);

      return result.data;
    },
    [queryClient, setUser]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.clear();
    setUser(null);
  }, [queryClient, setUser]);

  const value = useMemo(
    () => ({
      user: data ?? null,
      isLoading: isPending,
      login,
      register,
      logout,
      setUser,
    }),
    [data, isPending, login, register, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
