import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    testIdAttribute: 'data-test',
    screenshot: 'on',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox']},
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari']}
    }
  ]
});