import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const fallbackAdminEmail = "admin@baggyhype.club";
const fallbackAdminPassword = "baggy2026";
const fallbackAuthSecret = "BaggyHype2026SecretKeyForAuth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || fallbackAuthSecret,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;
        const adminEmail = process.env.ADMIN_EMAIL || fallbackAdminEmail;
        const adminPassword = process.env.ADMIN_PASSWORD || fallbackAdminPassword;

        // Temporary fallback for the hosted admin while Netlify env vars are being configured.
        if (email === adminEmail && password === adminPassword) {
          return {
            id: "admin-default",
            email: adminEmail,
            name: "Admin Baggy",
          };
        }

        const [{ prisma }, bcrypt] = await Promise.all([
          import("@/lib/prisma"),
          import("bcryptjs"),
        ]);

        const user = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.default.compare(
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
