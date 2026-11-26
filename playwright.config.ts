import { defineConfig, devices } from '@playwright/test';

// Locally we use the installed Google Chrome; in CI run `npx playwright install chromium` first.
const channel = process.env.CI ? undefined : 'chrome';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4600', channel },
  webServer: { command: 'node tests/serve.mjs', url: 'http://localhost:4600', reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
});
