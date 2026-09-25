import { defineConfig } from "@playwright/test";

const port = process.env.E2E_PORT ?? "4180";
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  webServer: process.env.E2E_SKIP_WEBSERVER
    ? undefined
    : {
        command: `npm run build && npm run preview -- --ip 127.0.0.1 --port ${port}`,
        url: baseURL,
        timeout: 180_000,
        reuseExistingServer: false,
      },
});
