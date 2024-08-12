/// <reference types="vitest" />

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@/utils": path.resolve(__dirname, "utils"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["./src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ['src/main.tsx', "src/vite-env.d.ts"],
      all: true,
    },
  },
});
