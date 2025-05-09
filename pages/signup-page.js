const { Page, expect } = require("@playwright/test");

/**
 * The Page that incorporates elements and methods for the Signup page.
 */
class SignupPage {
  /**
   * Constructor for the SignupPage class.
   *
   * @param {Page} page - The Playwright page object tied to this page.
   * @param {string} [url='https://hubstaff.com/signup'] - Optional URL to navigate to (default is 'https://hubstaff.com/signup').
   */
  constructor(page, url = "https://hubstaff.com/signup") {
    this.page = page; 
    this.url = url; 
  }

  /** Locators */

  get firstNameInput() {
    return this.page.locator('input[name="user[first_name]"]');
  }

  get lastNameInput() {
    return this.page.locator('input[name="user[last_name]"]');
  }

  get emailInput() {
    return this.page.locator('input[name="user[email]"]');
  }

  get pwdInput() {
    return this.page.locator('input[name="user[password]"]');
  }

  get agreeToTermsChk() {
    return this.page.locator(".hsds-form__checkbox-icon");
  }

  get proceedBtn() {
    return this.page.locator('button[data-testid="create_my_account"]');
  }

  get acceptCookiesBtn() {
    return this.page.locator("#CybotCookiebotDialogBodyButtonAccept");
  }

  /**
   * Retrieves the form input field by its label.
   *
   * @param {string} label - The label of the input field.
   * @returns {Locator} The input field element.
   */
  getFormInputField(label) {
    return this.page.getByLabel(label);
  }

  /** Methods for interacting with the signup page */

  /**
   * Fills the form input fields with provided user details.
   *
   * @param {Array<string>} inputFieldValues - The values to fill in the form fields.
   * @param {Array<string>} inputFieldsLabels - The labels of the form fields.
   * @throws {Error} If there is an error filling the signup form.
   */
  async fillInputsOnSignupForm(inputFieldValues, inputFieldsLabels) {
    // Default labels for the input fields
    const inputLabels = inputFieldsLabels || [
      "First Name",
      "Last Name",
      "Work Email",
      "Password",
    ];
    const inputValues = inputFieldValues;

    // Ensure the number of labels matches the number of values
    if (inputLabels.length !== inputValues.length) {
      throw new Error(
        "The number of input field labels must match the number of input field values."
      );
    }

    try {
      // Iterate over each label and value pair
      for (const [index, label] of inputLabels.entries()) {
        const value = inputValues[index];

        // Get the input field based on the label
        const inputField = await this.getFormInputField(label);

        // Perform actions on the input field (regular fill method didn't seem to work)
        await inputField.click(); // Focus on the input field
        await inputField.pressSequentially(value); // Enter the value character by character
      }
    } catch (error) {
      throw new Error(`Error filling signup form: ${error.message}`);
    }
  }

  /**
   * Fills the signup form with provided user details and agrees to terms.
   *
   * @param {Array<string>} inputFieldValues - The values to fill in the form fields.
   * @param {Array<string>} inputFieldsLabels - The labels of the form fields.
   * @throws {Error} If there is an error filling the signup form.
   */
  async fillSignupForm(inputFieldValues, inputFieldsLabels) {
    try {
      // Fill in user details in the form
      await this.fillInputsOnSignupForm(inputFieldValues, inputFieldsLabels);

      // Click the "Agree to Terms" checkbox
      await this.agreeToTermsChk.click();
    } catch (error) {
      throw new Error(`Error filling signup form: ${error.message}`);
    }
  }

  /**
   * Completes the signup process by filling the form and clicking the "Proceed" button.
   *
  * @param {Array<string>} inputFieldValues - The values to fill in the form fields.
   * @param {Array<string>} inputFieldsLabels - The labels of the form fields.
   * @throws {Error} If there is an error finishing the signup process.
   */
  async finishSignup(inputFieldValues, inputFieldsLabels) {
    // Fill the signup form with user details
    await this.fillSignupForm(inputFieldValues, inputFieldsLabels);

    try {
      // Handle cookies acceptance if the button is visible
      await expect(async () => {
        if (await this.acceptCookiesBtn.isVisible()) {
          await this.acceptCookiesBtn.click();
        }
        // Click the "Proceed" button to complete the signup process
        await this.proceedBtn.click();
      }).toPass({ timeout: 60000 }); // Wait for the process to complete within 60 seconds
    } catch (error) {
      throw new Error("Error finishing signup:", error);
    }
  }
}

module.exports = SignupPage;
