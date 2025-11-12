import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@helpers": path.resolve(__dirname, "../../packages/types"),
      "@utils": path.resolve(__dirname, "../../packages/utils"),
    },
  },
});
