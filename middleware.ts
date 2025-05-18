import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getEdgeToken } from "./lib/auth-edge"; // ✅ safe import

export async function middleware(request: NextRequest) {
  const token = await getEdgeToken(request);

  const isAuth = !!token;
  const protectedPaths = ["/profile"];
  const pathIsProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isAuth && pathIsProtected) {
    return NextResponse.redirect(new URL("/?modal=login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
