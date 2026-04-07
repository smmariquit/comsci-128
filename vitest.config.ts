import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/components": path.resolve(__dirname, "./src/app/components"),
      "@/lib": path.resolve(__dirname, "./src/app/lib"),
      "@/data": path.resolve(__dirname, "./src/app/lib/data"),
      "@/models": path.resolve(__dirname, "./src/app/lib/models"),
      "@/services": path.resolve(__dirname, "./src/app/lib/services"),
      "@/api": path.resolve(__dirname, "./src/app/api"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
  },
});
