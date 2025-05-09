const { test: base, expect } = require('@playwright/test');
const MarketingPage = require('../pages/marketing-page');
const LoginPage = require('../pages/login-page');
const ProjectPage = require('../pages/project-page');
const CreatePaymentsPage = require('../pages/create-payments-page');
const { TEST_USER } = require('../resources/test-users');

// Extend the base test with custom fixtures
const test = base.extend({
  // Add a fixture for authenticated page
  loggedInPage: async ({ page }, use) => {
    const marketingPage = new MarketingPage(page);
    const loginPage = new LoginPage(page);

    // Navigate to the marketing page
    await  marketingPage.page.goto(marketingPage.url);
    // Click the sign-in button
    await marketingPage.signInBtn.click();

    expect(loginPage.page.url()).toContain('login');
    // Perform login
    await loginPage.login(TEST_USER.email, TEST_USER.password);
    // Wait for the page to fully load
    await marketingPage.page.waitForLoadState('domcontentloaded');
    // Pass the authenticated page to the test
    await use(page);
  },

  // Add a fixture for project page
  loggedToProjectPage: async ({ loggedInPage}, use) => {
    const loggedToProjectPage = new ProjectPage(loggedInPage);
    await loggedToProjectPage.sideBarPage.projectManagementLink.click();
    await loggedToProjectPage.page.waitForLoadState('domcontentloaded');

    await use(loggedToProjectPage);
  },

  // Add a fixture for payment page
  loggedToPaymentsPage: async ({ loggedInPage }, use) => {
    const loggedToPaymentsPage = new CreatePaymentsPage(loggedInPage);
    await loggedToPaymentsPage.goToOneTimeAmountPayments();
    expect(loggedToPaymentsPage.page.url()).toContain('team_payments/bonus');

    await loggedToPaymentsPage.page.waitForLoadState('domcontentloaded');

    await use(loggedToPaymentsPage);
  }
});


module.exports = { test, expect: base.expect };