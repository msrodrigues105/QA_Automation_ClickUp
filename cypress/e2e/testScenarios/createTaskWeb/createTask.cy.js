describe('Validate Create Task via Web Application', () => {
  const token = 'pk_80504027_MSHZHZ3SB8SJMVVZLJ196QAF42CJCQPL';
  let workspaceId;
  let spaceId;
  let spaceName;
  let folderId;
  let folderName;
  let listId;

  // Store the name of the space that will be created via Web
  const taskName2 = 'TaskViaWeb';

  before(() => {
    // Retrieve the workspace ID before running any tests
    cy.getWorkspaceId().then((id) => {
      workspaceId = id;
      cy.log('Workspace ID:', workspaceId);
    });
  });

  it('Create Task via Web Application and Validate via API', () => {
    // Ensure the workspace ID is available
    cy.wrap(workspaceId).then((id) => {
      // Step 1: Get Space ID and Space Name via API
      cy.getSpaceId(id).then((result) => {
        spaceId = result.id;
        spaceName = result.name;
        cy.log('Space ID:', spaceId);
        cy.log('Space Name:', spaceName);

        // Step 2: Login to the Web Application and Navigate to Space
        cy.login();
        cy.contains('span', spaceName, { timeout: 45000 }).click({ force: true, waitForAnimations: false });

        // Step 3: Create a Folder in the Space
        cy.contains('button', 'Folder', { timeout: 50000 })
          .should('exist')
          .and('be.visible')
          .click({ waitForAnimations: false });

        cy.get('#cu-create-category__name-input')
          .should('exist')
          .and('be.visible')
          .type('FolderChallenge', { force: true });

        cy.get('div.cu-modal__footer')
          .find('button[buttontype="primary"]')
          .contains('Create')
          .click();

        // Step 4: Create a Task Inside the Folder
        cy.contains('button', 'Add Task').click({ force: true });

        cy.get('[data-test="draft-view__title-task"]', { timeout: 10000 })
          .clear()
          .type(taskName2, { delay: 100, force: true });

        cy.get('[data-test="draft-view__quick-create-create"]', { timeout: 10000 }).click();

        // Step 5: Get Folder ID and Folder Name via API
        cy.getFolderId(spaceId).then((result) => {
          folderId = result.id;
          folderName = result.name;
          cy.log('Folder ID:', folderId);
          cy.log('Folder Name:', folderName);

          // Step 6: Get List ID via API
          cy.getListId(folderId).then((id) => {
            listId = id;
            cy.log('List ID:', listId);

            // Step 7: Validate Task Name via API
            cy.getTaskDetails(listId).then(({ taskName }) => {
              expect(taskName).to.eq(taskName2);
            });
          });
        });
      });
    });
  });
});