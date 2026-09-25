import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/lobby/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:1449',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 15_000,
    expect: { 
      timeout: 15_000 
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:1449',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})