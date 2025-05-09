const { test, expect } = require("../fixtures/auth-fixtures");
const {
  generateRandomName,
  generateRandomUserLoginData,
  generateRandomAmount,
} = require("../resources/test-data-generator");
const EmailUtility = require("../utilities/email-utility");
const MarketingPage = require("../pages/marketing-page");
const SignupPage = require("../pages/signup-page");
const ConfirmationSentPage = require("../pages/confirmation-sent-page");
const { TEST_USER } = require("../resources/test-users");

test.describe("Sign up", () => {
  test(
    "User successfully completes 14-day free trial signup with email verification",
    { tag: "@auth" },
    async ({ page }) => {
      // Get API key from environment
      const apiKey = process.env.EMAIL_API_KEY;
      if (!apiKey) {
        throw new Error(
          "ApiKey is not set. Please set the EMAIL_API_KEY environment variable."
        );
      }

      // Initialize page objects and helpers
      const marketingPage = new MarketingPage(page);
      const signupPage = new SignupPage(page);
      const emailHelper = new EmailUtility(page, apiKey, true);
      const confirmationSentPage = new ConfirmationSentPage(page);

      // Create a temporary email inbox for the test
      const { inbox, emailAddress } = await emailHelper.createInbox();

      // Generate random user data for the signup process
      const testUserLoginData = generateRandomUserLoginData();
      const userData = {
        ...testUserLoginData,
        email: emailAddress,
        inboxId: inbox.id,
      };

      await test.step("Go to Marketing Page and click on Free trial button", async () => {
        // Navigate to the marketing page and click the "Free Trial" button
        await marketingPage.page.goto(marketingPage.url);
        await marketingPage.freeTrialBtn.click();
      });

      await test.step("Submit signup form ", async () => {
        // Fill out and submit the signup form
        const inputFieldValues = [
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
        ];


        await signupPage.finishSignup(inputFieldValues);

        // Verify that the "Verify Your Email" page is displayed
        expect(confirmationSentPage.verifyYourEmailTitle).toBeVisible();
      });

      await test.step("Complete Registration with Email Verification", async () => {
        // Wait for the email verification process to complete
        await expect(async () => {
          await emailHelper.completeEmailVerification(userData.inboxId);
        }).toPass({ timeout: 120000 });
      });

      // Cleanup: Delete the temporary email inbox
      await emailHelper.deleteInbox(inbox.id);
    }
  );
});

test.describe("Sign in", () => {
  test(
    "User login successfully with valid credentials",
    { tag: "@auth" },
    async ({ loggedInPage }) => {
      // Verify that the user is redirected to the "Getting Started" page after login
      await expect(loggedInPage ).toHaveURL(/.*\/getting_started.*/);
    }
  );
});

test.describe("Add/Create Project", () => {
  test(
    "User successfully creates a new project",
    { tag: "@project" },
    async ({ loggedToProjectPage }) => {
      // Generate a random project name
      const projectName = generateRandomName("Project");

      await test.step("Create Project", async () => {
        // Create a new project and verify that the success notification is displayed
        await Promise.all([
          loggedToProjectPage.createProject(projectName),
          expect(await loggedToProjectPage.createdProjectNotification).toBeVisible(),
        ]);
      });

      await test.step("Verify Project successfully created", async () => {
        // Verify that the project name appears in the project table
        const isProjectNameInTable = await loggedToProjectPage.findProjectNameInTable(
          projectName
        );
        expect(isProjectNameInTable).toBeTruthy();
      });
    }
  );
});
//Flaky test - there are some issues with the flow (possible bugs in the app)
test.describe("Bonus Payment", () => {
  test(
    "User successfully creates a one-time payment ",
    { tag: "@payment" },
    async ({ loggedToPaymentsPage }) => {
      // Generate random payment amount and note
      const paymentAmount = generateRandomAmount();
      const note = `Unique note ${generateRandomName()}`;

      test.step("Create one time payment and validate if payment summary is shown in Payment table", async () => {
        // Create a one-time payment for a specific member
        await loggedToPaymentsPage.createOneTimePaymentForMember(
          paymentAmount,
          note,
          TEST_USER.fullName
        );
      });
    }
  );
});