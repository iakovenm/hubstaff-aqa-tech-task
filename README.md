# QA Automation Framework for Hubstaff

This framework is a robust and scalable solution for automation tech task for Hubstaff. It leverages modern tools like Playwright, Javascript, MailSlurp to ensure high-quality testing practices.

## 🌟 Highlights

- **Email Automation**: Uses MailSlurp API to handle email workflows, including inbox creation, email retrieval, and link extraction for verification processes.
- **Modular Architecture**: Implements the Page Object Model (POM) for better code organization and maintainability.
- **Detailed Reports**: Generates insightful reports using Playwright's HTML reporting and Junit for better debugging and analysis.
- **CI/CD Ready**: Integrated with GitHub Actions for automated test execution, reporting, and artifact management.
- **Environment Management**: Securely handles credentials and configurations through environment variables.

## 🛠️ Setup Guide

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies using `npm install`.
3. Install the necessary browsers for Playwright.
4. Create a `.env` file and configure the following variables:
   - `EMAIL_API_KEY`: Your MailSlurp email API key.

## 🔍 Build and Test on a local machine

To set up and run your tests in test location (currently set only one test env):

-   $env:TEST_ENV="test"
-   npx playwright test OR npx playwright test --grep '@test' (where @test is a tag of the test you wish to run)

## 📈 Reporting

Generate and view detailed HTML reports for test results:

-   npx playwright show-report (to show report for the last test run)

## 🔑 Key Features

### Email Workflow Automation

This framework integrates with MailSlurp to automate email-related tasks. It dynamically creates inboxes, retrieves emails, and extracts links for verification. To use this feature, sign up at [MailSlurp](https://www.mailslurp.com/), obtain your API key, and configure it in the `.env` file.

### Continuous Integration

The GitHub Actions workflow automates the following:
- Installing dependencies
- Running tests
- Generating reports
- Storing artifacts
- Publishing results to Uploadcare

### Data Generation

The framework supports data generation mechanism. It provides functions to create random data such as names, email addresses, and passwords. This helps in generating unique test data for each test run, ensuring test reliability and avoiding data conflicts.

To use the data generation feature, you can utilize the following methods:

- `generateRandomName()`: Generates a random name.
- `generateRandomEmail()`: Generates a random email address.
- `generateRandomPassword()`: Generates a random password.

## 🔒 Security Recommendations

- Avoid committing sensitive data like API keys to the repository.
- Use `.env` files for local development and add them to `.gitignore`(for test task purpose it was commited to repo for better visibility)
- Store sensitive information in GitHub Secrets or other secret storages for CI/CD pipelines. For current implementation the following secrets need to be set up on Github in order to be able to run tests in Github Actions:
 
 EMAIL_API_KEY: ${{ secrets.EMAIL_API_KEY }}
 TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
 TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
 TEST_USER_FIRST_NAME: ${{ secrets.TEST_USER_FIRST_NAME }}
 TEST_USER_LAST_NAME: ${{ secrets.TEST_USER_LAST_NAME }}
 UPLOADCARE_PUB_KEY: {{ secrets.UPLOADCARE_PUB_KEY }}