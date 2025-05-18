import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log("Cookies:", request.headers.get("cookie"));
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  console.log("Token:", token);

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
