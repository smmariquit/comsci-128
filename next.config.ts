import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mahcvrvoickyuuxnhcxn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
