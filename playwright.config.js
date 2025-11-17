// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  use: { headless: true },
  reporter: [
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }]
  ]
});
