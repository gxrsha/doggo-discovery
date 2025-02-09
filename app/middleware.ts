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

  const authCookie = request.cookies.get("fetch-access-token");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add minimal CORS headers
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"],
};
