import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'
import type { UserApiOptions } from './tests.api.playwright/fixtures/userApiFixtures'

export default defineConfig<UserApiOptions>({
  testDir: '.',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: false,
    testIdAttribute: 'data-test',
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api-dev',
      testMatch: /tests\.api\.playwright\/.*\.spec\.ts/,
      use: {
        apiBaseURL: process.env.TEST_BASE_URL,
        apiAuthToken: process.env.TEST_AUTH_TOKEN,
      },
    },
    {
      name: 'api-prod',
      testMatch: /tests\.api\.playwright\/.*\.spec\.ts/,
      use: {
        apiBaseURL: process.env.PROD_BASE_URL,
        apiAuthToken: process.env.PROD_AUTH_TOKEN,
      },
    },
  ],
});