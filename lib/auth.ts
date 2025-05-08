import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaClient } from "@/app/generated/prisma/client";
import { compare } from "bcryptjs";
import { client } from "@/app/sanity/lib/client";
import { createAuthorInSanity } from "@/app/sanity/createAuthor";
import { urlFor } from "@/app/sanity/lib/image";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        });
      
        if (!user || !(await compare(password, user.passwordHash))) {
          return null;
        }        
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.imageUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        const authorExists = await client.fetch(
          `*[_type == "author" && email == $email][0]`,
          { email: user.email }
        );
  
        if (!authorExists) {
          await createAuthorInSanity({
            name: user.name,
            email: user.email,
            image: user.image ?? undefined,
          });
        }
      }
  
      return true;
    },
  
    async jwt({ token, user }) {
      if (user) {
        const imageFromSanity = await client.fetch(
            `*[_type == "author" && email == $email][0].image`,
            { email: user.email }
        );
    
        if (imageFromSanity) {
          const imageFromSanityUrl = urlFor(imageFromSanity)!
            .width(50)
            .height(50)
            .url();
          user.image = imageFromSanityUrl;
        } else {
          user.image = "";
        }   
          
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
