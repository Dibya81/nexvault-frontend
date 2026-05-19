import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const raw = request.cookies.get("cybercloud-auth")?.value;
  let token: string | null = null;
  if (raw) {
    try { token = JSON.parse(raw)?.state?.token ?? null; } catch {}
  }

  const pathname = request.nextUrl.pathname;
  const isAuthPage   = pathname.startsWith("/auth");
  const isPublicPage = pathname === "/";

  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
