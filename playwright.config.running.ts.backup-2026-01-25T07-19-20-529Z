import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for testing against an already-running dev server
 * Use this when the server is already running on port 3011
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000, // 30 seconds
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3011',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer config - assumes server is already running
});
