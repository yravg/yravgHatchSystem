import { defineConfig } from "vitest/config";

// Playwright specs (tests/e2e/*.spec.ts) are deliberately not matched here.
export default defineConfig({
  test: {
    include: ["{packages,services,apps,tests,tools}/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    environment: "node",
    allowOnly: false,
    testTimeout: 20_000,
  },
});
