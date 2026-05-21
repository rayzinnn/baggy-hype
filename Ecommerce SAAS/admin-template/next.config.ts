import type { NextConfig } from "next";

const supabaseHostname = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/product-media/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
