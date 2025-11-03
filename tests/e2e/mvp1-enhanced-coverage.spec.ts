import { test, expect } from '@playwright/test';

test.describe('MVP 1: Enhanced Test Coverage - Accessibility & UX', () => {
  test('should have proper page titles on all pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle('OhMyDoc - XML to HTML Transformer');

    // Debug parser page
    await page.goto('/debug/parser');
    await expect(page).toHaveTitle('XML Parser Demo - OhMyDoc');
  });

  test('should display header consistently across all pages', async ({ page }) => {
    // Verify header on home page
    await page.goto('/');
    const homeHeader = page.locator('h1:has-text("OhMyDoc")');
    await expect(homeHeader).toBeVisible();

    // Verify header persists on debug page
    await page.goto('/debug/parser');
    const debugHeader = page.locator('h1:has-text("OhMyDoc")');
    await expect(debugHeader).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab to the XML Parser Demo button and activate with Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/debug\/parser/);
  });

  test('should have accessible navigation links', async ({ page }) => {
    await page.goto('/');

    // Check that navigation link has proper role
    const parserLink = page.getByRole('link', { name: /XML Parser Demo/i });
    await expect(parserLink).toBeVisible();
    await expect(parserLink).toHaveAttribute('href', '/debug/parser');

    // Navigate to debug page
    await page.goto('/debug/parser');

    // Check back navigation link
    const backLink = page.getByRole('link', { name: /Back to Home/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check h1 exists (app title)
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('OhMyDoc');

    // Check h2 exists (welcome heading)
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();
    await expect(h2).toHaveText('Welcome to OhMyDoc');
  });

  test('should render @nuxt/ui components correctly', async ({ page }) => {
    await page.goto('/');

    // Verify UButton component renders with proper styling
    const button = page.getByRole('link', { name: /XML Parser Demo/i });
    await expect(button).toBeVisible();

    // Verify button is functional and clickable
    await expect(button).toHaveAttribute('href', '/debug/parser');
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Navigate directly to debug page via URL
    await page.goto('/debug/parser');

    // Verify page loads correctly
    await expect(page).toHaveTitle('XML Parser Demo - OhMyDoc');
    const heading = page.locator('h2', { hasText: 'XML Parser Demo' });
    await expect(heading).toBeVisible();

    // Verify header is present
    const appTitle = page.locator('h1:has-text("OhMyDoc")');
    await expect(appTitle).toBeVisible();
  });

  test('should display action slot placeholders in header', async ({ page }) => {
    await page.goto('/');

    // The header should have the structure for left and right action slots
    // Even though they're empty, the container divs should exist
    const header = page.locator('h1:has-text("OhMyDoc")').locator('..');
    await expect(header).toBeVisible();

    // Verify header has flex layout for action slots
    const headerContainer = header.locator('..');
    await expect(headerContainer).toBeVisible();
  });

  test('should load XML parser functionality on debug/parser page', async ({ page }) => {
    await page.goto('/debug/parser');

    // MVP 2 is now implemented, verify parser functionality is present
    const heading = page.locator('h2', { hasText: 'XML Parser Demo' });
    await expect(heading).toBeVisible();

    const description = page.getByText(/Component demo page for MVP 2/i);
    await expect(description).toBeVisible();
  });

  test('should maintain consistent styling across pages', async ({ page }) => {
    // Home page styling check
    await page.goto('/');
    const homeContainer = page.locator('.container').first();
    await expect(homeContainer).toBeVisible();

    // Debug page styling check
    await page.goto('/debug/parser');
    const debugContainer = page.locator('.container').first();
    await expect(debugContainer).toBeVisible();
  });
});

test.describe('MVP 1: Error Handling & Edge Cases', () => {
  test('should handle invalid routes gracefully', async ({ page }) => {
    // Navigate to non-existent route
    const response = await page.goto('/nonexistent-page');

    // Nuxt should handle this with a 404 page or redirect
    // We just verify the page loads without crashing
    expect(response?.status()).toBeTruthy();
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/');

    // Rapidly navigate between pages
    await page.click('text=XML Parser Demo');
    await expect(page).toHaveURL(/\/debug\/parser/);

    await page.click('text=Back to Home');
    await expect(page).toHaveURL('/');

    await page.click('text=XML Parser Demo');
    await expect(page).toHaveURL(/\/debug\/parser/);

    // Verify page is still functional
    const heading = page.locator('h2', { hasText: 'XML Parser Demo' });
    await expect(heading).toBeVisible();
  });

  test('should preserve header state during navigation', async ({ page }) => {
    await page.goto('/');

    // Store the header text
    const headerText = await page.locator('h1').textContent();

    // Navigate to debug page
    await page.click('text=XML Parser Demo');

    // Verify header text is preserved
    const newHeaderText = await page.locator('h1').textContent();
    expect(newHeaderText).toBe(headerText);
  });
});

test.describe('MVP 1: Responsive Design Verification', () => {
  test('should render correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();

    const welcomeHeading = page.locator('h2:has-text("Welcome to OhMyDoc")');
    await expect(welcomeHeading).toBeVisible();
  });

  test('should render correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();

    const welcomeHeading = page.locator('h2:has-text("Welcome to OhMyDoc")');
    await expect(welcomeHeading).toBeVisible();
  });

  test('should render correctly on minimum supported viewport (1024px)', async ({ page }) => {
    // Per CLAUDE.md: Minimum supported viewport: 1024px (desktop-first)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();

    const button = page.getByRole('link', { name: /XML Parser Demo/i });
    await expect(button).toBeVisible();

    // Verify button is clickable
    await button.click();
    await expect(page).toHaveURL(/\/debug\/parser/);
  });
});
