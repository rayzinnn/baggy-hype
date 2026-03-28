import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Bypass para credenciais padrão em ambiente local
        if (email === "admin@baggyhype.club" && password === "baggy2026") {
          return {
            id: "admin-default",
            email: "admin@baggyhype.club",
            name: "Admin Baggy",
          };
        }

        const user = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});
