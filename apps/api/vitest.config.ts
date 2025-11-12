import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@helper": path.resolve(__dirname, "../../packages/types"),
      "@utils": path.resolve(__dirname, "../../packages/utils"),
    },
  },
  test: {
    pool: "@cloudflare/vitest-pool-workers",
    poolOptions: {
      workers: {
        wranglerConfigPath: "../../infra/wrangler.toml",
      },
    },
  },
});
