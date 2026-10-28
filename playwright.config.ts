import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end suite. Runs against a production build served locally so the
 * tests exercise the same bundle that ships to GitHub Pages.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4210',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npx ng serve --port 4210 --configuration development',
    url: 'http://localhost:4210',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
