// tests/e2e/example.spec.js
const { test, expect } = require('@playwright/test');

test('index.html loads and body is visible', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/index.html');
  await expect(page.locator('body')).toBeVisible();
});
