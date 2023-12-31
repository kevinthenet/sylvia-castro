import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://sylvia-castro.com',
    // baseURL: 'http://127.0.0.1:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-en',
      use: { ...devices['Desktop Chrome'], locale: 'en-US' },
    },

    {
      name: 'chromium-es',
      use: { ...devices['Desktop Chrome'], locale: 'es-MX' },
    },

    {
      name: 'firefox-en',
      use: { ...devices['Desktop Firefox'], locale: 'en-US' },
    },

    {
      name: 'firefox-es',
      use: { ...devices['Desktop Firefox'], locale: 'en-MX' },
    },

    {
      name: 'webkit-en',
      use: { ...devices['Desktop Safari'], locale: 'en-US' },
    },

    {
      name: 'webkit-es',
      use: { ...devices['Desktop Safari'], locale: 'en-MX' },
    },
  ],
  //
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'pnpm start',
  //   url: 'http://127.0.0.1:4321',
  //   reuseExistingServer: !process.env.CI,
  // },
});
