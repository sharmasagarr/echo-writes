import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      name?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    name: string;
    image: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    username?: string;
  }
}
