import NextAuth from "next-auth";
import { CustomAdapter } from "./custom-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: CustomAdapter(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
      
        if (!email || !password) {
          return null;
        }
      
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
          },
        });
      
        if (!user || !(await compare(password, user.password as string))) {
          return null;
        }        
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // console.log("User signed in:", user);
      // console.log("Account:", account);
      // If it's an OAuth sign-in (not credentials)
      if (account && account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          });

          // If no account exists for this provider, link it
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
              },
            });
          }
        }
      }
      return true;
    },
  
    async jwt({ token, user }) {
      // console.log("JWT Callback - Token:", token);
      // console.log("JWT Callback - User:", user);
      if (user) {
        const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
      });
        if (dbUser) {
          token.id = dbUser?.id ?? "";
          token.email = user.email;
          token.username = dbUser?.username ?? "";
          token.name = user.name;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      // console.log("Session Callback - Session:", session);
      // console.log("Session Callback - Token:", token);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
});
