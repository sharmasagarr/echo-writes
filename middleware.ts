import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
    secureCookie: process.env.NODE_ENV === "production",
  });

  console.log("Token in middleware:", token);
  const isAuth = !!token;
  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile"];
  const pathIsProtected = protectedPaths.some((p) => path.startsWith(p));

  if (!isAuth && pathIsProtected) {
    return NextResponse.redirect(new URL("/?modal=login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
