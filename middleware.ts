import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieName = isProduction
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName,
    secureCookie: isProduction,
  });

  const isAuth = !!token;
  const path = request.nextUrl.pathname;

  // ✅ Match /user/[username]
  const match = path.match(/^\/user\/([^/]+)$/);
  const usernameInPath = match?.[1];

  if (
    isAuth &&
    usernameInPath &&
    token?.username &&
    token.username === usernameInPath
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // 🔐 Protect /profile for unauthenticated users
  if (!isAuth && path.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/?modal=login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/user/:username"], // 🧠 Include /user/[username]
};
