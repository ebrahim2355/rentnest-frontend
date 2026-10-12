import { NextResponse, type NextRequest } from "next/server";
import { decodeToken } from "@/lib/auth";
import { AUTH_COOKIE, DASHBOARD_HOME } from "@/lib/constants";
import type { Role } from "@/types";

const roleAreas: { prefix: string; role: Role }[] = [
  { prefix: "/dashboard/tenant", role: "TENANT" },
  { prefix: "/dashboard/landlord", role: "LANDLORD" },
  { prefix: "/dashboard/admin", role: "ADMIN" },
  { prefix: "/payment", role: "TENANT" },
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = decodeToken(request.cookies.get(AUTH_COOKIE)?.value);
  const isAuthPage = pathname.startsWith("/auth");

  if (!session) {
    if (isAuthPage) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  const dashboardHome = new URL(DASHBOARD_HOME[session.role], request.url);

  if (isAuthPage || pathname === "/dashboard") {
    return NextResponse.redirect(dashboardHome);
  }

  const area = roleAreas.find((item) => pathname.startsWith(item.prefix));

  if (area && area.role !== session.role) {
    return NextResponse.redirect(dashboardHome);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment/:path*"],
};
