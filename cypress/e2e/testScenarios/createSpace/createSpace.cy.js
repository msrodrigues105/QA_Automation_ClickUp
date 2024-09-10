describe('Validate Create Space Functionality', () => {
  const token = 'pk_80504027_MSHZHZ3SB8SJMVVZLJ196QAF42CJCQPL';
  let workspaceId;
  let spaceId;
  let spaceName;

  // Store the name of the space that will be created via API
  const createdSpaceName = 'Challenge';

  before(() => {
    // Fetch workspace ID before the tests run
    cy.getWorkspaceId().then((id) => {
      workspaceId = id;
      cy.log(`Workspace ID: ${workspaceId}`);
      expect(workspaceId).to.be.a('string').and.not.be.empty;
    });
  });

  it('Create Space via API and Validate in Web Application', () => {
    cy.wrap(workspaceId).should('exist'); // Ensure workspaceId is available

    // Step 1: Create Space via API
    cy.createSpace(workspaceId, token, createdSpaceName).then((response) => {
      // Validate API response
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name');

      // Extract Space ID and Space Name from the API response
      spaceId = response.body.id;
      spaceName = response.body.name;
      cy.log(`Space ID created: ${spaceId}`);
      cy.log(`Space Name created: ${spaceName}`);

      // Step 2: Log in to Web Application
      cy.login();

      // Debug: Log the space name for verification
      cy.log('Searching for space name:', spaceName);

      // Step 3: Validate created space in the web app
      cy.contains('span', spaceName, { timeout: 50000 }).click({
        force: true,
        waitForAnimations: false,
      });

      // Step 4: Validate the URL contains the Space ID
      cy.url({ timeout: 35000 }).should('include', spaceId);
    });
  });
});