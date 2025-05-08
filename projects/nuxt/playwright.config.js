// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const PROJECT_DIR = process.env.EVAL_PROJECT_ROOT || 'src'
const PORT = process.env.EVAL_PROJECT_PORT || 3211

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './test',
  timeout: 60000,
  expect: {
    // increase timeout to prevent false negatives due to nuxt dev server lazy compilation
    timeout: 10000,
  },
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
    command: `npm run db -- ${PROJECT_DIR} && npm run dev -- ${PROJECT_DIR}`,
    env: {
      DB_HOST: `${PROJECT_DIR}/test.sqlite`,
      PROJECT_DIR,
      PORT: PORT.toString(),
      TEST: 'true',
    },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: process.env.IS_EVAL_PRODUCTION ? false : true,
    timeout: 120000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
