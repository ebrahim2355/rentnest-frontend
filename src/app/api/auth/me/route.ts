import { NextResponse, type NextRequest } from "next/server";
import { callBackend } from "@/lib/backend";
import { AUTH_COOKIE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ success: true, message: "No active session", data: null });
  }

  const result = await callBackend("/auth/me", { token });

  if (result.status === 401 || result.status === 403) {
    const response = NextResponse.json({ success: true, message: result.payload.message, data: null });

    response.cookies.delete(AUTH_COOKIE);

    return response;
  }

  return NextResponse.json(result.payload, { status: result.status });
}
