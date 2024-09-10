// ***********************************************
// Common Cypress Commands for ClickUp API and Web
// ***********************************************

// 1. Login to Web Application
Cypress.Commands.add('login', () => {
  const email = Cypress.env('LOGIN_EMAIL');
  const password = Cypress.env('LOGIN_PASSWORD');

  cy.visit('https://app.clickup.com/');
  cy.get('input[id="login-email-input"]').type(email);
  cy.get('input[id="login-password-input"]').type(password);
  cy.get('button[class="login-page-new__main-form-button"]').click();
});

// 2. Create Space via API request
Cypress.Commands.add('createSpace', (workspaceId, token, createdSpaceName) => {
  cy.request({
    method: 'POST',
    url: `https://api.clickup.com/api/v2/team/${workspaceId}/space`,
    headers: {
      'Authorization': token, // Use dynamic token
      'Content-Type': 'application/json'
    },
    body: {
      name: createdSpaceName,
      multiple_assignees: true,
      features: {
        due_dates: {
          enabled: true,
          start_date: false,
          remap_due_dates: true,
          remap_closed_due_date: false
        },
        time_tracking: { enabled: false },
        tags: { enabled: true },
        time_estimates: { enabled: true },
        checklists: { enabled: true },
        custom_fields: { enabled: true },
        remap_dependencies: { enabled: true },
        dependency_warning: { enabled: true },
        portfolios: { enabled: true }
      }
    }
  });
});

// 3. Get Tasks via API request
Cypress.Commands.add('getTasks', (spaceId, folderId, token) => {
  cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/space/${spaceId}/folder/${folderId}/task`,
    headers: { 'Authorization': token }
  });
});

// 4. Create Task via API request
Cypress.Commands.add('createTask', (listId, taskName, token) => {
  cy.request({
    method: 'POST',
    url: `https://api.clickup.com/api/v2/list/${listId}/task`,
    headers: {
      'Authorization': token, // Use dynamic token
      'Content-Type': 'application/json'
    },
    body: {
      name: taskName,
      description: 'New Task Description',
      assignees: [183], // Adjust based on your needs
      tags: ['tag name 1'],
      status: '',
      priority: 3,
      due_date: 1508369194377,
      due_date_time: false,
      time_estimate: 8640000,
      start_date: 1567780450202,
      start_date_time: false,
      notify_all: true,
      parent: null,
      links_to: null,
      custom_fields: []
    }
  });
});

// 5. Get Workspace ID via API request
Cypress.Commands.add('getWorkspaceId', () => {
  cy.request({
    method: 'GET',
    url: 'https://api.clickup.com/api/v2/team',
    headers: { 'Authorization': Cypress.env('API_TOKEN') }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const workspaceId = response.body.teams[0].id; // Get the first workspace ID
    Cypress.env('workspaceId', workspaceId); // Store in environment variable
    return workspaceId;
  });
});

// 6. Get Space ID and Name via API request
Cypress.Commands.add('getSpaceId', (workspaceId) => {
  cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/team/${workspaceId}/space`,
    headers: { 'Authorization': Cypress.env('API_TOKEN') }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const space = response.body.spaces[0]; // Get the first space
    const spaceId = space.id;
    const spaceName = space.name;
    Cypress.env('spaceId', spaceId); // Store spaceId
    Cypress.env('spaceName', spaceName); // Store spaceName
    return { id: spaceId, name: spaceName };
  });
});

// 7. Get Folder ID via API request
Cypress.Commands.add('getFolderId', (spaceId) => {
  cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/space/${spaceId}/folder`,
    headers: { 'Authorization': Cypress.env('API_TOKEN') }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const folder = response.body.folders[0]; // Get the first folder
    const folderId = folder.id;
    const folderName = folder.name;
    Cypress.env('folderId', folderId); // Store folderId
    Cypress.env('folderName', folderName); // Store folderName
    return { id: folderId, name: folderName };
  });
});

// 8. Get List ID via API request
Cypress.Commands.add('getListId', (folderId) => {
  cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/folder/${folderId}/list`,
    headers: { 'Authorization': Cypress.env('API_TOKEN') }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const listId = response.body.lists[0].id; // Get the first list ID
    Cypress.env('listId', listId); // Store listId
    return listId;
  });
});

// 9. Get Task ID and Name via API request
Cypress.Commands.add('getTaskDetails', (listId) => {
  cy.request({
    method: 'GET',
    url: `https://api.clickup.com/api/v2/list/${listId}/task`,
    headers: { 'Authorization': Cypress.env('API_TOKEN') }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const tasks = response.body.tasks;

    if (tasks.length > 0) {
      const task = tasks[0]; // Get the first task
      const taskId = task.id;
      const taskName = task.name;
      Cypress.env('taskId', taskId); // Store taskId
      Cypress.env('taskName', taskName); // Store taskName
      return { taskId, taskName };
    } else {
      throw new Error('No tasks found');
    }
  });
});