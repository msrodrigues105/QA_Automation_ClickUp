describe('Validate Create Task via API Application', () => {
  const token = 'pk_80504027_MSHZHZ3SB8SJMVVZLJ196QAF42CJCQPL';
  let workspaceId;
  let spaceId;
  let spaceName;
  let folderId;
  let folderName;
  let listId;
  const taskName = 'TaskViaAPI'; // Define your task name here

  before(() => {
    // Step 1: Get Workspace ID
    cy.getWorkspaceId()
      .then((id) => {
        workspaceId = id;
        cy.log('Workspace ID:', workspaceId);
        return cy.getSpaceId(workspaceId); // Step 2: Get Space ID
      })
      .then((result) => {
        spaceId = result.id;
        spaceName = result.name;
        cy.log('Space ID:', spaceId);
        cy.log('Space Name:', spaceName);
        return cy.getFolderId(spaceId); // Step 3: Get Folder ID
      })
      .then((result) => {
        folderId = result.id;
        folderName = result.name;
        cy.log('Folder ID:', folderId);
        cy.log('Folder Name:', folderName);
        return cy.getListId(folderId); // Step 4: Get List ID
      })
      .then((id) => {
        listId = id;
        cy.log('List ID:', listId);
        expect(listId).to.be.a('string').and.not.be.empty;
      });
  });

  it('Create Task via API and Verify on Web Application', () => {
    cy.wrap(listId)
      .should('exist')
      .then(() => {
        // Step 1: Create Task via API
        cy.createTask(listId, taskName, token).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('Task created via API');
        });

        // Step 2: Log in to Web Application
        cy.login();

        // Step 3: Validate Space and Folder on Web Application
        cy.log('Searching for space name:', spaceName);
        cy.log('Searching for folder name:', folderName);

        // Click on the space name
        cy.contains('span', spaceName, { timeout: 50000 }).click({
          force: true,
          waitForAnimations: false,
        });

        // Click on the folder name
        cy.contains('span', folderName, { timeout: 50000 })
          .should('be.visible')
          .click({ force: true, waitForAnimations: false });

        // Step 4: Open the list and search for the task
        cy.get('span[data-test="subcategory-row__List"]')
          .should('be.visible')
          .click({ force: true, waitForAnimations: false });

        // Step 5: Search for the created task using the input field
        cy.get('input[data-test="search-filter-input"]', { timeout: 25000 })
          .clear() // Clear the existing text
          .type(`${taskName}{enter}`); // Type the task name and press Enter
      });
  });
});