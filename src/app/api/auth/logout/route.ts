import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully", data: null });

  response.cookies.delete(AUTH_COOKIE);

  return response;
}
