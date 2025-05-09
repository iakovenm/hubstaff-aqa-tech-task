const { defineConfig, devices } = require('@playwright/test');

// Load environment variables from .env file
if (process.env.TEST_ENV === 'test') {
  require('dotenv').config({ path: './env/test.env' });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = defineConfig({
  /* Maximum time each test can run. Default is 3 min */
  timeout: 180000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if there is a test.only in code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only by default, can be overridden with environment variable */
  retries: process.env.CI ? 2 : 0,
  /* Workers can be configured through environment variable */
  workers: process.env.CI ? 3 : undefined,
  /* Reporter configuration with both HTML and Junit */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  
  /* Run tests in example configuration with Desktop Chrome  */
  projects: [
    {
      name: 'chromium',
      // use: { ...devices['Desktop Chrome'] },
    }
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Record video for failed tests */
    video: 'retain-on-failure',
    
    /* Capture screenshot after each test failure */
    screenshot: 'only-on-failure',
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* Maximum time each action such as `click()` can take. Default is 0 (no timeout) */
    actionTimeout: 15000,
    
    /* Maximum time navigation like `goto()` can take. Default is 30 seconds */
    navigationTimeout: 30000,
    
    /* Run tests headlessly by default on CI */
    headless: !!process.env.CI,
  },
 
  /* Directory for test artifacts */
  outputDir: 'test-results/', 

});