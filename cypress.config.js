const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome', // Directory where reports are saved
      overwrite: true,                        // Set to true if you want to overwrite previous reports
      html: true,                              // Generate an HTML report
      json: true                               // Generate a JSON report
    },
    env: {
      LOGIN_EMAIL: 'creationsvski@gmail.com',
      LOGIN_PASSWORD: 'Example1978'
    }
  }
});