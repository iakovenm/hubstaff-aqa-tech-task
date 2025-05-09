const { expect } = require("@playwright/test");
const SideBarPage = require("./components/side-bar-page");

/**
 * The Page that incorporates elements and methods for Payment page
 */

class CreatePaymentsPage {
  /**
   * @param {Page} page - the playwright page object that is tied to this page
   */

  constructor(page) {
    this.page = page;
    this.sideBarPage = new SideBarPage(page);
  }

  /**Locators */

  get oneTimeAmountTab() {
    return this.page.getByRole("link", { name: "One-time amount" });
  }

  get selectAllMembersLnk() {
    return this.page.locator(".select-all");
  }

  get amountPerMemberInput() {
    return this.page.locator("input#team_payment_total_amount");
  }

  get noteTextArea() {
    return this.page.locator(
      'textarea[placeholder="Enter a note about the payment"]'
    );
  }

  get createPaymentBtn() {
    return this.page.getByRole("link", { name: "Create payment" });
  }

  get paymentModalForm() {
    return this.page.locator("#payment-wizard-modal-form");
  }

  get exportPaymentModal() {
    return this.page.locator("#export_payment_modal");
  }

  get modalCreatePaymentBtn() {
    return this.paymentModalForm.filter({ hasText: "Create payment" });
  }

  get notNowBtn() {
    return this.exportPaymentModal
      .locator("#export_payment")
      .filter({ hasText: "Not now" });
  }

  get exportPaymentTab() {
    return this.page.locator("#export_payment");
  }

  get paymentTbl() {
    return this.page.locator(".table.table-bordered");
  }

  get createPaymentsPageTitle() {
    return this.page.getByTitle("Hubstaff - Team Payments");
  }

  getSelectedMember(memberName) {
    return this.page
      .locator(".select2-selection__choice")
      .getByText(memberName);
  }

  /**Methods */
  /**
   * Navigates to the create payments page and selects the one-time amount tab.
   * @returns {Promise<void>} A promise that resolves when the navigation is complete.
   */
  async goToOneTimeAmountPayments() {
    await this.sideBarPage.financialsLink.click();
    await this.sideBarPage.createPaymentsLink.click();
    await this.oneTimeAmountTab.click();
  }

  /**
   * Verifies the payment details.
   *
   * @returns {Promise<void>} A promise that resolves when the payment details are verified.
   */
  async verifyPaymentDetails() {
    await expect(this.paymentTbl).toContainText(memberName);
    await expect(this.paymentTbl).toContainText("Bonus");
  }

  /**
   * Selects all members. Needs because select member precisely does not seem to work
   * @returns {Promise<void>} A promise that resolves when all members are selected.
   */
  async selectAllMembers() {
    await this.selectAllMembersLnk.click();
  }

  /**
   * Waits for the selected member with the specified name to become visible.
   * @param {string} memberName - The name of the member to wait for.
   * @returns {Promise<void>} - A promise that resolves when the selected member is visible.
   */
  async waitForSelectedMember(memberName) {
    await this.getSelectedMember(memberName).waitFor({ state: "visible" });
  }

  /**
   * Enters the amount per member in the input field.
   * @param {string} amount - The amount to be entered.
   * @returns {Promise<void>}
   */
  async enterAmountPerMember(amount) {
    await this.amountPerMemberInput.waitFor({ state: "visible" });
    await this.amountPerMemberInput.fill(amount);
    expect(this.amountPerMemberInput).toHaveValue(amount);
  }

  /**
   * Enters a note into the text area.
   * @param {string} note - The note to enter.
   * @returns {Promise<void>} - A promise that resolves once the note is entered.
   */
  async enterNoteTextArea(note) {
    await this.noteTextArea.fill(note);
    await expect(this.noteTextArea).toHaveValue(note);
  }

  /**
   * Clicks the create payment button.
   * @returns {Promise<void>} A promise that resolves when the button is clicked.
   */
  async clickCreatePaymentBtn() {
    await this.createPaymentBtn.click();
  }

  /**
   * Clicks the modal create payment button.
   * @returns {Promise<void>} A promise that resolves after the button is clicked.
   */
  async clickModalCreatePaymentBtn() {
    await this.modalCreatePaymentBtn.click();
  }

  /**
   * Clicks the "Not Now" button.
   * @returns {Promise<void>} A promise that resolves after the button is clicked.
   */
  async clickNotNowBtn() {
    await this.notNowBtn.click();
  }

  /**
   * Creates a one-time payment for a member and verifies the payment details.
   *
   * @param {number} amount - The amount of the payment.
   * @param {string} note - The note for the payment.
   * @param {string} memberName - The name of the member.
   * @throws {Error} If there is an error creating the payment.
   */

  //Frankly speaking I am having issues with this flow reqular fill actions not always work, would need to spend more time on debugging it)
  async createOneTimePaymentForMember(amount, note, memberName) {
    try {
      // Wrap the entire process in an assertion to ensure it passes within the specified timeout
      await expect(async () => {
        // Select all members in the list
        await this.selectAllMembers();

        // Wait until the specified member is selected
        await this.waitForSelectedMember(memberName);

        // Enter the payment amount for the selected member
        await this.enterAmountPerMember(amount);

        // Enter a note in the text area for the payment
        await this.enterNoteTextArea(note);

        // Click the button to create the payment
        await this.clickCreatePaymentBtn();

        // Verify that the payment modal form is visible
        await expect(this.paymentModalForm).toBeVisible();

        // Click the "Create Payment" button in the modal
        await this.clickModalCreatePaymentBtn();

        // Verify that the export payment tab is visible after creating the payment
        await expect(this.exportPaymentTab).toBeVisible();

        // Click the "Not Now" button to skip any additional steps
        await this.clickNotNowBtn();

        // Verify the payment details to ensure the payment was created successfully
        await this.verifyPaymentDetails();
      }).toPass({ timeout: 120000 }); // Set a timeout of 120 seconds for the entire process
    } catch (error) {
      // Throw an error with a descriptive message if something goes wrong
      throw new Error(`Error creating one-time payment: ${error.message}`);
    }
  }
}

module.exports = CreatePaymentsPage;
