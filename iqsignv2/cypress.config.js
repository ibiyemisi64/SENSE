import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333', // Replace with your app's URL
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Test file patterns
    supportFile: 'cypress/support/e2e.js', // Support file
  },
});
