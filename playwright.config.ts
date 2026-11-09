import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // OIOS_TEST_URL points the run at a server on another port (a production
    // build on a spare port, when 3000 is taken). Keep it on localhost: the
    // API and form specs post, and a real post emails the team inbox.
    baseURL: process.env.OIOS_TEST_URL || 'http://localhost:3000',
    launchOptions: process.env.PLAYWRIGHT_MCP_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_MCP_EXECUTABLE_PATH }
      : {},
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  timeout: 30_000,
  expect: { timeout: 10_000 },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
