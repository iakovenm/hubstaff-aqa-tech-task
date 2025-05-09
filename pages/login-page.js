const { Page } = require('@playwright/test');

/**
 * The Page that incorporates elements and methods for the Login page.
 */
class LoginPage {
  /**
   * Constructor for the LoginPage class.
   *
   * @param {Page} page - The Playwright page object tied to this page.
   * @param {string} [url='https://account.hubstaff.com/login'] - Optional URL to navigate to (default is 'https://account.hubstaff.com/login').
   */
  constructor(page, url = 'https://account.hubstaff.com/login') {
    this.page = page; // Playwright page object
    this.url = url;   // URL of the login page
  }

  /** Locators */

  get emailInput() {
    return this.page.locator('input[placeholder="Enter email"]');
  }

  get passwordInput() {
    return this.page.locator('input[placeholder="Enter password"]');
  }

  get loginBtn() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  /** Methods */

  /**
   * Logs in with the provided email and password.
   *
   * @param {string} email - The email to use for login.
   * @param {string} password - The password to use for login.
   * @throws {Error} If an error occurs during login.
   */
  async login(email, password) {
    try {
      // Fill the email input field with the provided email
      await this.emailInput.fill(email);
      // Fill the password input field with the provided password
      await this.passwordInput.fill(password);
      // Click the login button to attempt login
      await this.loginBtn.click();

    } catch (error) {
      // Throw an error if something goes wrong during the login process
      throw new Error(`Error occurred during login: ${error.message}`);
    }
  }
}

module.exports = LoginPage;