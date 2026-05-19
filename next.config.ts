import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Allow Turbopack with empty config to avoid build error
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mahcvrvoickyuuxnhcxn.supabase.co",
      },
    ],
  },
};

export default withSerwist(nextConfig);
