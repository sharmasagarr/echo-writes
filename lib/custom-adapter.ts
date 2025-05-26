import { Adapter } from "next-auth/adapters";
import { PrismaClient } from "@/app/generated/prisma";
import { generateUniqueUsername } from "./utils";
import { client } from "@/app/sanity/lib/client";
import { createAuthorInSanity } from "@/app/sanity/create-author";

const prisma = new PrismaClient();

export function CustomAdapter(): Adapter {
  return {
    async createUser(user) {
      const generatedUsername =  await generateUniqueUsername(user.name);

      const createdUser = await prisma.user.create({
          data: {
          name: user.name ?? null,
          email: user.email,
          emailVerified: user.emailVerified,
          username: generatedUsername ?? null,
          },
      });
      if (user?.email) {
        const authorExists = await client.fetch(
          `*[_type == "author" && email == $email][0]`,
          { email: user.email }
        );
  
        if (!authorExists) {
          await createAuthorInSanity({
            id: createdUser.id,
            name: user.name,
            email: user.email,
            image: user.image ?? null,
            username: generatedUsername ?? "",
          });
        }
      }
      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified,
        image: null,
      };

    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
      where: { id },
      });
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: null,
      };
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
      where: { email },
      });
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: null,
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
        provider,
        providerAccountId,
        },
      },
      include: {
        user: true,
      },
      });
      if (!account?.user) {
        return null;
      }
    
      return {
        id: account.user.id,
        name: account.user.name,
        email: account.user.email,
        emailVerified: account.user.emailVerified,
        image: null,
      }; 
    },

    async updateUser(user) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        },
      });
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: null,
      }; 
    },

    async deleteUser(userId) {
      await prisma.account.deleteMany({ where: { userId } });
      const deletedUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!deletedUser) {
        return null;
      }
      return {
        id: deletedUser.id ,
        name: deletedUser.name,
        email: deletedUser?.email,
        emailVerified: deletedUser.emailVerified,
        image: null,
      };
    },

    async linkAccount(account: { userId: string; provider: string; providerAccountId: string; type: string; }) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
        },
      });
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await prisma.account.delete({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });
    },

    async createSession(session) {
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      };
    },

    async getSessionAndUser() {
      return null;
    },

    async updateSession() {
      return null;
    },

    async deleteSession() {
      return null;
    },

    async createVerificationToken() {
      return null;
    },

    async useVerificationToken() {
      return null;
    },
  };
}
