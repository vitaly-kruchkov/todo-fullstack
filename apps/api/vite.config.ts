import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@helpers": path.resolve(__dirname, "../../packages/types"),
      "@utils": path.resolve(__dirname, "../../packages/utils"),
    },
  },
});
