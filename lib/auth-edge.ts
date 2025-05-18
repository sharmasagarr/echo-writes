import { getToken } from "next-auth/jwt";

export async function getEdgeToken(request: Request) {
  return await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
}
