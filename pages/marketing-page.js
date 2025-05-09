const { Page } = require("@playwright/test");
/**
 * The Page that incorporates elements and methods for Marketing page
 */

class MarketingPage {
  /**
   * @param {Page} page - the playwright page object that is tied to this page
   * @param {string} [url='https://hubstaff.com/'] - Optional URL to navigate to (default is 'https://hubstaff.com/')
   */

  constructor(page, url = "https://hubstaff.com/") {
    this.page = page;
    this.url = url;
  }

  /**Locators */

  get freeTrialBtn() {
    return this.page.getByRole("link", { name: "Free 14-day trial" });
  }

  get signInBtn() {
    return this.page.locator('[data-testid="sign_in_button"]');
  }

  get workEmail() {
    return this.page.getByRole("textbox", { name: "Work email" });
  }
}

module.exports = MarketingPage;
