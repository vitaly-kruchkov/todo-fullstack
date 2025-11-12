import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@helpers": path.resolve(__dirname, "../../packages/types"),
      "@utils": path.resolve(__dirname, "../../packages/utils"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
