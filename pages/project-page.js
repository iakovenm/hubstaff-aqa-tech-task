const SideBarPage = require("./components/side-bar-page");

/**
 * The Page that incorporates elements and methods for the Project page.
 */
class ProjectPage {
  /**
   * Constructor for the ProjectPage class.
   *
   * @param {Page} page - The Playwright page object tied to this page.
   */
  constructor(page) {
    this.page = page; // Playwright page object
    this.sideBarPage = new SideBarPage(page); // Instance of the SideBarPage component
  }

  /** Locators */

  get addProjectBtn() {
    return this.page.locator("a.btn").filter({ hasText: "Add project" });
  }

  get projectNameInput() {
    return this.page.getByPlaceholder(
      "Add project names separated by new lines"
    );
  }

  get saveBtn() {
    return this.page.getByRole("button", { name: "Save" });
  }

  get createdProjectNotification() {
    return this.page.locator(".jGrowl-message");
  }

  get projectTableNameCells() {
    return this.page.locator('table tbody td[data-label="Name"]');
  }

  /** Methods */

  /**
   * Creates a new project with the given project name.
   *
   * @param {string} projectName - The name of the project to create.
   * @throws {Error} If there is an error navigating to the projects page or creating the project.
   */
  async createProject(projectName) {
    try {
      // Click the "Add Project" button to open the project creation form
      await this.addProjectBtn.click();

      // Fill the project name input field with the provided project name
      await this.projectNameInput.fill(projectName);

      // Click the "Save" button to create the project
      await this.saveBtn.click();
    } catch (error) {
      // Throw an error if something goes wrong during project creation
      throw new Error(`Error creating a Project: ${error.message}`);
    }
  }

  /**
   * Finds the specified project name in the table.
   *
   * @param {string} projectName - The name of the project to search for.
   * @returns {Promise<boolean>} - A promise that resolves to true if the project name is found in the table, or false if it is not found.
   */
  async findProjectNameInTable(projectName) {
    // Get all the table cells containing project names
    const nameCells = await this.projectTableNameCells.all();

    // Iterate through each cell to check if it contains the specified project name
    for (const cell of nameCells) {
      const cellText = cell.filter({ hasText: projectName }); // Filter cells by the project name
      if (cellText) {
        return true; // Project name found in the table
      }
    }

    return false; // Project name not found in the table
  }
}

module.exports = ProjectPage;
