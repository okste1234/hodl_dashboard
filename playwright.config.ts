import { defineConfig, devices } from "@playwright/test"

// Smoke E2E config. Starts the production server and runs the happy-path spec.
// Auth is stubbed at the network layer (OTP request/verify + admin endpoints)
// so the suite is deterministic and needs no live OTP.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
})
