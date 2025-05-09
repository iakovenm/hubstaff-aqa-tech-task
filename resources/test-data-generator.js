/**
 * Helper function to generate a unique name with timestamp and optional random suffix
 */
/**
 * Generates a unique name by combining a prefix, timestamp, and random string.
 * @param {string} prefix - The prefix to be included in the generated name.
 * @param {boolean} includeTimestamp - Whether to include a timestamp in the generated name. Default is true.
 * @returns {string} The generated unique name.
 */
function generateRandomName(prefix, includeTimestamp = true) {
  const timestamp = includeTimestamp ? `-${Date.now()}` : "";
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}-${random}`;
}

/**
 * Helper function to generate random data within specified constraints
 *
 * @returns {string} A random amount as a string within the range MIN_AMOUNT to MAX_AMOUNT
 */
function generateRandomAmount() {
  const MIN_AMOUNT = 0.001;
  const MAX_AMOUNT = 999999.99;

  // Generate a random number within the range
  const randomAmount = (
    Math.random() * (MAX_AMOUNT - MIN_AMOUNT) +
    MIN_AMOUNT
  ).toFixed(3);

  // Ensure the amount is formatted to two decimal places
  return parseFloat(randomAmount).toFixed(2);
}

/**
 * Generates random user login data.
 * @returns {Object} The generated user login data.
 */
function generateRandomUserLoginData() {
  return {
    firstName: generateRandomName("User", false),
    lastName: generateRandomName("Test", false),
    password: `Test${Date.now()}!`,
  };
}

module.exports = {
  generateRandomName,
  generateRandomUserLoginData,
  generateRandomAmount,
};
