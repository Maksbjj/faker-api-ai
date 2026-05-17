import { BASE_URL } from '@_config/env.config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  globalSetup: './config/global.setup.ts',
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json; v=1.0',
      'Content-Type': 'application/json; v=1.0',
    },
  },
  projects: [
    {
      name: 'health',
      testMatch: '**/*.health.ts',
    },
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      dependencies: ['health'],
    },
  ],
});
