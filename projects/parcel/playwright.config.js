const { defineConfig, devices } = require('@playwright/test')

const PROJECT_DIR = process.env.EVAL_PROJECT_ROOT || 'src'
const PORT = process.env.EVAL_PROJECT_PORT || 3211

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './test',
  // global timeout
  timeout: 10_000,
  // case timeout
  expect: { timeout: 10_000 },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* MAX_TEST_WORKERS is configured to prevent memory overflow caused by starting multiple workers simultaneously */
  workers: process.env.MAX_TEST_WORKERS ? +process.env.MAX_TEST_WORKERS : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'html' : 'line',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://127.0.0.1:${PORT}`,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npm run dev`,
    cwd: PROJECT_DIR,
    env: {
      PROJECT_PORT: String(PORT),
    },
    stdout: 'pipe',
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 10_000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
