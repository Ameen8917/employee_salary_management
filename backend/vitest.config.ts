import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    env: { DB_STORAGE: ":memory:" },
    setupFiles: ["./src/test/setup.ts"],
    fileParallelism: false,
    exclude: ["**/dist/**", "**/node_modules/**"],
  },
});
