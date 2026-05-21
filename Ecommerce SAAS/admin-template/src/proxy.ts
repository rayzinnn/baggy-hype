import { NextResponse, type NextRequest } from "next/server";
import { hasAdminAuthCookies } from "@/lib/admin-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isLoggedIn = hasAdminAuthCookies(request.cookies);

  if (pathname.startsWith("/admin") && !isLoginRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
