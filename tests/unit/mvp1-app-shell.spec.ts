import { test, expect } from '@playwright/test';

test.describe('MVP 1: Basic App Shell with Header and Routing', () => {
  test('should load the app without errors', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/OhMyDoc/);
  });

  test('should display AppHeader with title on main page', async ({ page }) => {
    await page.goto('/');

    // Check that AppHeader displays the app title (use .first() since header appears once)
    const header = page.getByRole('heading', { name: 'OhMyDoc v2' });
    await expect(header).toBeVisible();
  });

  test('should display AppHeader with tagline', async ({ page }) => {
    await page.goto('/');

    // Check that the tagline is visible
    const tagline = page.getByText('XML to HTML Transformer');
    await expect(tagline).toBeVisible();
  });

  test('should navigate to /debug/parser page directly', async ({ page }) => {
    // Navigate directly to debug page (no navigation buttons on main page)
    await page.goto('/debug/parser');

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

  test('should display dual-panel layout on main page', async ({ page }) => {
    await page.goto('/');

    // The main page should have the dual-panel layout with editor and preview
    // Use first() to select the first visible instance of each panel
    const editorPanel = page.locator('.editor-panel').first();
    const previewPanel = page.locator('.preview-panel').first();

    await expect(editorPanel).toBeVisible();
    await expect(previewPanel).toBeVisible();
  });
});
