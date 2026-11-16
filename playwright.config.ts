import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/env.config';
import path from 'path';

const authFile = path.resolve(__dirname, '.auth/user.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: false,
        suiteTitle: false,
        environmentInfo: {
          Application: 'Tricentis Demo Web Shop',
          BaseURL: envConfig.baseUrl,
          Browser: 'Chromium (Desktop)',
          Platform: process.platform,
          NodeVersion: process.version,
          ExecutionMode: 'Headless',
          Framework: 'Playwright + TypeScript POM',
        },
      },
    ],
  ],
  use: {
    baseURL: envConfig.baseUrl,
    headless: envConfig.isHeadless,
    actionTimeout: envConfig.actionTimeout,
    navigationTimeout: envConfig.navigationTimeout,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Global Authentication Setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Authenticated Tests (uses cached storageState)
    {
      name: 'chromium-authenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      testIgnore: [/.*\.setup\.ts/, /.*\/auth\/.*/],
    },

    // 3. Standalone Unauthenticated Tests (Login, Register flows)
    {
      name: 'chromium-unauthenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: [/.*\/auth\/.*/],
    },
  ],
});
