import { defineConfig } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: `http://localhost:${port}` },
  // Needs NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET in the environment for `next build`
  webServer: {
    command: `npm run build && npx next start -p ${port}`,
    url: `http://localhost:${port}/robots.txt`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
