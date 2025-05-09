const { Page } = require("@playwright/test");
/**
 * The Page that incorporates elements for Side Bar that is common for multiple pages
 */

class SideBarPage {
  /**
   * @param {Page} page - the playwright page object that is tied to this page
   * @param {string} [url='https://app.hubstaff.com/getting_started'] - Optional URL to navigate to (default is 'https://app.hubstaff.com/getting_started')
   */

  constructor(page, url = "https://app.hubstaff.com/getting_started") {
    this.page = page;
    this.url = url;
  }

  /**Locators */

  get projectManagementLink() {
    return this.page
      .getByRole("menuitem")
      .filter({ hasText: "Project management" });
  }

  get financialsLink() {
    return this.page.getByRole("menuitem", { name: "Financials" });
  }

  get createPaymentsLink() {
    return this.page.getByRole("menuitem", { name: "Create payments" });
  }
}

module.exports = SideBarPage;
