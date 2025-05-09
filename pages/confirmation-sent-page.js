const { Page } = require("@playwright/test");
/**
 * The Page that incorporates elements and methods for Confirmation Sent page
 */

class ConfirmationSentPage {
  /**
   * @param {Page} page - the playwright page object that is tied to this page
   * @param {string} [url='https://account.hubstaff.com/confirmation_sent'] - Optional URL to navigate to (default is 'https://account.hubstaff.com/confirmation_sent')
   */

  constructor(page, url = "https://account.hubstaff.com/confirmation_sent") {
    this.page = page;
    this.url = url;
  }

  /**Locators */

  get verifyYourEmailTitle() {
    return this.page.locator("h1.title").getByText("Verify your email");
  }
}

module.exports = ConfirmationSentPage;
