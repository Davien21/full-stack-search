import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@/utils": path.resolve(__dirname, "utils"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
  plugins: [react()],
});
