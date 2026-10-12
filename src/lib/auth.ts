import type { Role } from "@/types";

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
  exp: number;
}

const roles: Role[] = ["TENANT", "LANDLORD", "ADMIN"];

export const decodeToken = (token: string | undefined): TokenPayload | null => {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as Partial<TokenPayload>;

    if (!payload.id || !payload.role || !roles.includes(payload.role) || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload as TokenPayload;
  } catch {
    return null;
  }
};

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
