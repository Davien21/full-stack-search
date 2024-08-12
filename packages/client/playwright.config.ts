import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
import { CLIENT_BASE_URL } from "@/utils/helpers";

const PORT = process.env.PORT || "3000";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 15 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: CLIENT_BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "npm run start",
    port: Number(PORT),
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PORT,
    },
  },
});
