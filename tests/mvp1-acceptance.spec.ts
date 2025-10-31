import { test, expect } from '@playwright/test';

test.describe('MVP 1: Basic App Shell with Header and Routing', () => {
  const baseURL = 'http://localhost:3004';

  test('should load the app without errors', async ({ page }) => {
    // Navigate to the home page
    const response = await page.goto(baseURL);

    // Verify successful response
    expect(response?.status()).toBe(200);

    // Check for no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    expect(errors.length).toBe(0);
  });

  test('should display AppHeader with app title', async ({ page }) => {
    await page.goto(baseURL);

    // Check if AppHeader is visible
    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();

    // Verify the title text
    await expect(header).toHaveText('OhMyDoc');
  });

  test('should have empty action slots for future buttons', async ({ page }) => {
    await page.goto(baseURL);

    // The action slots should exist in the DOM (even if not visible when empty)
    // This verifies the structure is in place for MVPs 7-9
    const leftActions = page.locator('[class*="gap-2"]').first();
    const rightActions = page.locator('[class*="gap-2"]').last();

    // Check that the slots exist in the DOM
    await expect(leftActions).toHaveCount(1);
    await expect(rightActions).toHaveCount(1);
  });

  test('should navigate to /debug/parser without 404', async ({ page }) => {
    const response = await page.goto(`${baseURL}/debug/parser`);

    // Verify successful navigation (no 404)
    expect(response?.status()).toBe(200);

    // Verify the page content
    await expect(page.locator('h2:has-text("XML Parser Demo")')).toBeVisible();

    // Verify AppHeader appears on debug page
    await expect(page.locator('h1:has-text("OhMyDoc")')).toBeVisible();
  });

  test('should render @nuxt/ui components correctly', async ({ page }) => {
    await page.goto(`${baseURL}/debug/parser`);

    // Verify UCard component renders (from @nuxt/ui)
    // Check for the card container
    const cardContent = page.getByText('Parser component demo page');
    await expect(cardContent).toBeVisible();
  });

  test('should have header appear on all pages', async ({ page }) => {
    // Check home page
    await page.goto(baseURL);
    await expect(page.locator('h1:has-text("OhMyDoc")')).toBeVisible();

    // Check debug/parser page
    await page.goto(`${baseURL}/debug/parser`);
    await expect(page.locator('h1:has-text("OhMyDoc")')).toBeVisible();
  });
});
