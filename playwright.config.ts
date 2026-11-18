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

    // 2. Chromium (Desktop Chrome)
    {
      name: 'chromium-authenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      testIgnore: [/.*\.setup\.ts/, /.*\/auth\/.*/],
    },
    {
      name: 'chromium-unauthenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: [/.*\/auth\/.*/],
    },

    // 3. Firefox (Desktop Firefox)
    {
      name: 'firefox-authenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: authFile,
      },
      testIgnore: [/.*\.setup\.ts/, /.*\/auth\/.*/],
    },
    {
      name: 'firefox-unauthenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
      },
      testMatch: [/.*\/auth\/.*/],
    },

    // 4. WebKit (Desktop Safari)
    {
      name: 'webkit-authenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: authFile,
      },
      testIgnore: [/.*\.setup\.ts/, /.*\/auth\/.*/],
    },
    {
      name: 'webkit-unauthenticated',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
      },
      testMatch: [/.*\/auth\/.*/],
    },
  ],
});
