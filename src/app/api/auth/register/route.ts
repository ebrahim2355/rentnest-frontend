import { NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/auth";
import { callBackend } from "@/lib/backend";
import { AUTH_COOKIE } from "@/lib/constants";
import type { User } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const registration = await callBackend("/auth/register", { method: "POST", body });

  if (!registration.ok) {
    return NextResponse.json(registration.payload, { status: registration.status });
  }

  const login = await callBackend("/auth/login", {
    method: "POST",
    body: { email: body.email, password: body.password },
  });

  if (!login.ok) {
    return NextResponse.json(login.payload, { status: login.status });
  }

  const { accessToken, user } = login.payload.data as { accessToken: string; user: User };
  const response = NextResponse.json({ success: true, message: registration.payload.message, data: user }, { status: 201 });

  response.cookies.set(AUTH_COOKIE, accessToken, authCookieOptions);

  return response;
}
