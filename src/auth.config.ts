import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are added in the full auth.ts
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isLoginRoute && !isLoggedIn) {
        return false; // Redirect standard (para login page)
      }
      
      return true;
    },
  },
} satisfies NextAuthConfig;
