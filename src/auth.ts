import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: requireEnv("AUTH_SECRET"),
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;
        const adminEmail = requireEnv("ADMIN_EMAIL");
        const adminPassword = requireEnv("ADMIN_PASSWORD");

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
