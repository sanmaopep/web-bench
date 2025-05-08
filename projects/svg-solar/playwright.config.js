// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.EVAL_PROJECT_PORT || 3211

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './test',
  testIgnore: ['./eval/**'],
  // global timeout
  timeout: process.env.IS_EVAL_PRODUCTION ? 30_000 : 5_000,
  // case timeout
  expect: { timeout: process.env.IS_EVAL_PRODUCTION ? 5_000 : 2_000 },

  /* Run tests in files in parallel */
  fullyParallel: true,
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
    baseURL: `http://localhost:${PORT}`,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // headless: false,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx vite --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: process.env.IS_EVAL_PRODUCTION ? false : true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 640, height: 640 } },
    },
  ],
})
