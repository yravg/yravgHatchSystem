import { defineConfig } from "@playwright/test";

// Uses an installed browser (no browser download): msedge on this Windows machine, PW_CHANNEL=chrome on Linux CI.
// Run `pnpm --filter @yravg/web build` first (`pnpm test:e2e` does).
const port = 3100;
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "*.spec.ts",
  outputDir: "test-results",
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: process.env["PW_CHANNEL"] ?? "msedge",
    trace: "on",
  },
  webServer: {
    command: `pnpm --filter @yravg/web exec next start --port ${port} --hostname 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
