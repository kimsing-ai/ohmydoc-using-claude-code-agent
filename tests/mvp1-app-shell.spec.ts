import { test, expect } from '@playwright/test';

test.describe('MVP 1: Basic App Shell with Header and Routing', () => {
  test('should load the app without errors', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/OhMyDoc/);
  });

  test('should display AppHeader with title', async ({ page }) => {
    await page.goto('/');

    // Check that AppHeader displays the app title
    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();
  });

  test('should navigate to /debug/parser page', async ({ page }) => {
    await page.goto('/');

    // Click on the XML Parser Demo button
    await page.click('text=XML Parser Demo');

    // Verify we're on the debug/parser page
    await expect(page).toHaveURL(/\/debug\/parser/);

    // Verify the page content - check for the heading
    const heading = page.locator('h2', { hasText: 'XML Parser Demo' });
    await expect(heading).toBeVisible();
  });

  test('should navigate back to home from debug page', async ({ page }) => {
    await page.goto('/debug/parser');

    // Click the Back to Home button
    await page.click('text=Back to Home');

    // Verify we're back on the home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should display empty action slots in header', async ({ page }) => {
    await page.goto('/');

    // The header should exist with the structure for left and right action slots
    // These slots are empty for now but the structure should be present
    const header = page.locator('h1:has-text("OhMyDoc")').locator('..');
    await expect(header).toBeVisible();
  });
});
