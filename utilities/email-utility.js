const { Page } = require("@playwright/test");
const { MailSlurp } = require("mailslurp-client");
const Logger = require("./logger");

/**
 * Email Utility for working with email verification processes using MailSlurp.
 */
class EmailUtility {
  /**
   * @param {Page} page - The Playwright page object tied to this helper
   * @param {string} [apiKey=process.env.EMAIL_API_KEY] - Optional parameter for MailSlurp API key. Defaults to env variable EMAIL_API_KEY
   * @param {boolean} [debug=false] - Optional flag to enable debug logging
   */
  constructor(page, apiKey = process.env.EMAIL_API_KEY, debug = false) {
    // check API key is present
    if (!apiKey) {
      throw new Error(
        "API key is not provided and EMAIL_API_KEY environment variable is not set."
      );
    }
    this.page = page;
    this.logger = new Logger(debug);
    // Initialize MailSlurp with API key
    this.mailslurp = new MailSlurp({ apiKey });
  }

  /**
   * Create a new inbox with MailSlurp
   * @returns {Promise<{ inbox: any, emailAddress: string }>}
   */
  async createInbox() {
    try {
      const inbox = await this.mailslurp.createInbox();
      return {
        inbox,
        emailAddress: inbox.emailAddress,
      };
    } catch (error) {
      throw new Error(`Error while creating inbox: ${error.message}`);
    }
  }

  /**
   * Wait for latest email in the inbox
   *
   * @param {string} inboxId - The ID of the inbox to check
   * @param {string} [keyword] - Optional keyword to match in the subject line
   * @param {number} [timeout=80000] - Maximum time (ms) to wait for email
   * @param {number} [retries=3] - Number of retries if email fetch fails
   * @returns {Promise<any>} - The received email
   */
  async waitForLastEmail(inboxId, keyword, timeout = 80000, retries = 3) {
    let attempt = 0;
    let finalError;

    while (attempt < retries) {
      try {
        const email = await this.mailslurp.waitForLatestEmail(
          inboxId,
          timeout,
          true
        );

        if (!email) {
          throw new Error(`No emails in inbox ${inboxId} after ${timeout}ms`);
        }

        if (keyword) {
          const subject = email.subject || "";
          if (subject.toLowerCase().includes(keyword.toLowerCase())) {
            const emailContent = await this.mailslurp.getEmail(email.id);
            return emailContent;
          } else {
            throw new Error(
              `No keyword '${keyword}'is found in subject: '${subject}'`
            );
          }
        }

        return email;
      } catch (error) {
        finalError = error;
        attempt++;
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    throw new Error(
      `No email received after ${retries} attempts: ${finalError.message}`
    );
  }

  /**
   * Get confirmation link from email
   *
   * @param {any} email - email object
   * @param {RegExp} [linkRegExp] - RegExp pattern to match confirmation link
   * @returns {string|null} - extracted link
   */
  getConfirmationLink(email, linkRegExp) {
    const body = email.body || "";
    const htmlBody = typeof email.html === "string" ? email.html : "";

    this.logger.debugLog(`Email body available: ${!!body}`);
    this.logger.debugLog(`Email HTML body available: ${!!htmlBody}`);

    if (linkRegExp) {
      const textMatch = body.match(linkRegExp);
      if (textMatch) return textMatch[0];

      const htmlMatch = htmlBody.match(linkRegExp);
      if (htmlMatch) return htmlMatch[0];
    }

    const patterns = [
      /https:\/\/[^'\s]+confirm[^'\s]*/,
      /https:\/\/app\.hubstaff\.com\/[^'\s]+confirm[^'\s]*/,
      /<a\s+(?:[^>]*?\s+)?href=['"]([^'"]*)['"][^>]*?>\s*Confirm\s+account\s*<\/a>/i,
      /https:\/\/app\.hubstaff\.com\/[^'\s]+/,
    ];

    for (const pattern of patterns) {
      const match = body.match(pattern) || htmlBody.match(pattern);
      if (match) {
        const url = match[1] || match[0];
        return url;
      }
    }
    this.logger.error(
      "Confirmation link not found in email body or HTML body."
    );
    return null;
  }

  /**
   * Complete the email verification process
   *
   * @param {string} inboxId - MailSlurp inbox ID
   * @param {RegExp} [linkRegExp] - RegExp pattern to match the confirmation link
   * @param {number} [timeout=80000] - Timeout waiting for email
   * @returns {Promise<boolean>} -If confirmation is successful
   */
  async completeEmailVerification(inboxId, linkRegExp, timeout = 80000) {
    try {
      const email = await this.waitForLastEmail(
        inboxId,
        "Confirm your Hubstaff account",
        timeout
      );

      const confirmationLink = this.getConfirmationLink(email, linkRegExp);
      if (!confirmationLink) {
        this.logger.error("No confirmation link retrieved in email.");
        return false;
      }

      const emailConfirmationPage = await this.page.context().newPage();

      try {
        await emailConfirmationPage.goto(confirmationLink);
        await emailConfirmationPage.waitForLoadState("domcontentloaded");

        const confirmButton =
          emailConfirmationPage.getByText("Confirm account");
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await emailConfirmationPage.waitForURL(/.*welcome.*/, {
            timeout: 30000,
          });
        }

        return emailConfirmationPage.url().includes("/welcome");
      } finally {
        await emailConfirmationPage.close();
      }
    } catch (error) {
      this.logger.error(
        `Error occured while email verification process: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Delete an inbox
   *
   * @param {string} inboxId - inboxId to delete
   */
  async deleteInbox(inboxId) {
    try {
      await this.mailslurp.deleteInbox(inboxId);
    } catch (error) {
      throw new Error(`Failed to delete inbox ${inboxId}: ${error.message}`);
    }
  }
}

module.exports = EmailUtility;
