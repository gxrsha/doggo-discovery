import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  // Check for the auth cookie
  const authCookie = request.cookies.get("fetch-access-token");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"],
};
