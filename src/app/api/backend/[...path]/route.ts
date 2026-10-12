import { NextResponse, type NextRequest } from "next/server";
import { callBackend } from "@/lib/backend";
import { AUTH_COOKIE } from "@/lib/constants";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

const forward = async (request: NextRequest, context: RouteContext) => {
  const { path } = await context.params;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const body = hasBody ? await request.json().catch(() => ({})) : undefined;

  const result = await callBackend(`/${path.join("/")}`, {
    method: request.method,
    body,
    token,
    search: request.nextUrl.search,
  });

  const response = NextResponse.json(result.payload, { status: result.status });

  if (result.status === 401 && token) {
    response.cookies.delete(AUTH_COOKIE);
  }

  return response;
};

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
