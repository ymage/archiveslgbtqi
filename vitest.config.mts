import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}", "sanity/lib/**/*.ts"],
      exclude: ["**/*.d.ts", "app/**/Svg/**", "app/**/icon/**"],
      reporter: ["text-summary", "text"],
      // floor just under the current level, so coverage cannot silently regress
      thresholds: { statements: 40, lines: 40, functions: 25, branches: 25 },
    },
  },
});
