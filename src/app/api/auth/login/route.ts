import { NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/auth";
import { callBackend } from "@/lib/backend";
import { AUTH_COOKIE } from "@/lib/constants";
import type { User } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await callBackend("/auth/login", { method: "POST", body });

  if (!result.ok) {
    return NextResponse.json(result.payload, { status: result.status });
  }

  const { accessToken, user } = result.payload.data as { accessToken: string; user: User };
  const response = NextResponse.json({ success: true, message: result.payload.message, data: user });

  response.cookies.set(AUTH_COOKIE, accessToken, authCookieOptions);

  return response;
}
