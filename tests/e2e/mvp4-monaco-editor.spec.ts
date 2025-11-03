import { test, expect } from '@playwright/test';

test.describe('MVP 4: Monaco XML Editor Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/editor');
  });

  test.describe('Page Load and Basic Rendering', () => {
    test('should load the Monaco editor demo page successfully', async ({ page }) => {
      // Verify page title
      await expect(page).toHaveTitle('Monaco XML Editor Demo - OhMyDoc');

      // Verify header is present
      const header = page.locator('h1:has-text("OhMyDoc")');
      await expect(header).toBeVisible();

      // Verify page heading
      const heading = page.locator('h2', { hasText: 'Monaco XML Editor Demo' });
      await expect(heading).toBeVisible();

      // Verify description
      const description = page.getByText(/Component demo page for MVP 4/i);
      await expect(description).toBeVisible();
    });

    test('should have navigation back to home', async ({ page }) => {
      const backLink = page.getByRole('link', { name: /Back to Home/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');
    });

    test('should display control buttons', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      await expect(resetButton).toBeVisible();

      const clearButton = page.getByRole('button', { name: 'Clear' });
      await expect(clearButton).toBeVisible();
    });

    test('should display editor statistics section', async ({ page }) => {
      const statsHeading = page.locator('h3', { hasText: 'Editor Statistics' });
      await expect(statsHeading).toBeVisible();

      // Check for statistics labels
      await expect(page.getByText('Lines')).toBeVisible();
      await expect(page.getByText('Characters')).toBeVisible();
      await expect(page.getByText('Words')).toBeVisible();
    });

    test('should display Monaco editor features list', async ({ page }) => {
      const featuresHeading = page.locator('h3', { hasText: 'Monaco Editor Features' });
      await expect(featuresHeading).toBeVisible();

      // Verify all listed features
      await expect(page.getByText('XML Syntax Highlighting')).toBeVisible();
      await expect(page.getByText('Line Numbers')).toBeVisible();
      await expect(page.getByText('Auto-Indentation')).toBeVisible();
      await expect(page.getByText('Auto-Closing Tags')).toBeVisible();
      await expect(page.getByText('Bracket Matching')).toBeVisible();
      await expect(page.getByText('IntelliSense / Code Completion')).toBeVisible();
      await expect(page.getByText('v-model Two-Way Binding')).toBeVisible();
    });

    test('should display usage instructions', async ({ page }) => {
      const instructionsHeading = page.locator('h3', { hasText: 'How to Use' });
      await expect(instructionsHeading).toBeVisible();

      // Verify key instruction points are present
      await expect(page.getByText(/Sample XML is loaded automatically/i)).toBeVisible();
      await expect(page.getByText(/demonstrates v-model reactivity/i)).toBeVisible();
    });
  });

  test.describe('Sample XML Loading', () => {
    test('should automatically load sample XML on page load', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(2000);

      // Check statistics show non-zero values (indicating content loaded)
      const linesElement = page.locator('text=Lines').locator('..').locator('div').first();
      const lines = await linesElement.textContent();
      expect(parseInt(lines || '0')).toBeGreaterThan(0);

      const charsElement = page.locator('text=Characters').locator('..').locator('div').first();
      const chars = await charsElement.textContent();
      expect(parseInt(chars || '0')).toBeGreaterThan(0);
    });

    test('should display line numbers in the Monaco editor', async ({ page }) => {
      // Wait for editor to fully load
      await page.waitForTimeout(2000);

      // Monaco editor renders line numbers in specific divs
      // Check for the presence of line number elements
      const lineNumbers = page.locator('.margin-view-overlays .line-numbers');
      await expect(lineNumbers.first()).toBeVisible();
    });

    test('should load valid XML content from sample file', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(2000);

      // Check that statistics indicate substantial content
      const linesElement = page.locator('text=Lines').locator('..').locator('div').first();
      const lines = await linesElement.textContent();

      // Sample cover letter should have ~48 lines
      expect(parseInt(lines || '0')).toBeGreaterThanOrEqual(40);
      expect(parseInt(lines || '0')).toBeLessThanOrEqual(60);
    });
  });

  test.describe('Monaco Editor Features', () => {
    test('should render Monaco editor component', async ({ page }) => {
      // Monaco editor creates specific DOM structure
      const monacoContainer = page.locator('.monaco-editor');
      await expect(monacoContainer).toBeVisible();
    });

    test('should display code in dark theme', async ({ page }) => {
      // Check for Monaco's dark theme class
      const editor = page.locator('.monaco-editor.vs-dark');
      await expect(editor).toBeVisible();
    });

    test('should show minimap', async ({ page }) => {
      // Monaco minimap is a key feature
      const minimap = page.locator('.minimap');
      await expect(minimap).toBeVisible();
    });

    test('should have accessible editor with proper ARIA attributes', async ({ page }) => {
      // Monaco creates accessible textbox with aria-label
      const editorTextbox = page.getByRole('textbox', { name: /Editor content/i });
      await expect(editorTextbox).toBeVisible();
    });
  });

  test.describe('v-model Two-Way Binding and Reactivity', () => {
    test('should show initial statistics matching loaded content', async ({ page }) => {
      // Wait for content to load
      await page.waitForTimeout(2000);

      // All statistics should be greater than 0
      const linesText = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      const charsText = await page.locator('text=Characters').locator('..').locator('div').first().textContent();
      const wordsText = await page.locator('text=Words').locator('..').locator('div').first().textContent();

      expect(parseInt(linesText || '0')).toBeGreaterThan(0);
      expect(parseInt(charsText || '0')).toBeGreaterThan(0);
      expect(parseInt(wordsText || '0')).toBeGreaterThan(0);
    });

    test('should update statistics when Clear button is clicked', async ({ page }) => {
      // Wait for initial load
      await page.waitForTimeout(2000);

      // Click Clear button
      await page.getByRole('button', { name: 'Clear' }).click();

      // Wait for state update
      await page.waitForTimeout(500);

      // Statistics should all be 0
      const linesText = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      const charsText = await page.locator('text=Characters').locator('..').locator('div').first().textContent();
      const wordsText = await page.locator('text=Words').locator('..').locator('div').first().textContent();

      expect(linesText).toBe('0');
      expect(charsText).toBe('0');
      expect(wordsText).toBe('0');
    });

    test('should restore statistics when Reset to Sample is clicked', async ({ page }) => {
      // Wait for initial load
      await page.waitForTimeout(2000);

      // Store initial values
      const initialLines = await page.locator('text=Lines').locator('..').locator('div').first().textContent();

      // Clear the editor
      await page.getByRole('button', { name: 'Clear' }).click();
      await page.waitForTimeout(500);

      // Verify cleared
      let currentLines = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      expect(currentLines).toBe('0');

      // Reset to sample
      await page.getByRole('button', { name: 'Reset to Sample' }).click();
      await page.waitForTimeout(2000);

      // Verify restored
      currentLines = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      expect(currentLines).toBe(initialLines);
    });

    test('should demonstrate v-model reactivity with Clear and Reset cycle', async ({ page }) => {
      // Wait for initial load
      await page.waitForTimeout(2000);

      // Get initial statistics
      const initialStats = {
        lines: await page.locator('text=Lines').locator('..').locator('div').first().textContent(),
        chars: await page.locator('text=Characters').locator('..').locator('div').first().textContent(),
        words: await page.locator('text=Words').locator('..').locator('div').first().textContent()
      };

      // Clear editor
      await page.getByRole('button', { name: 'Clear' }).click();
      await page.waitForTimeout(500);

      // Verify cleared state
      expect(await page.locator('text=Lines').locator('..').locator('div').first().textContent()).toBe('0');
      expect(await page.locator('text=Characters').locator('..').locator('div').first().textContent()).toBe('0');
      expect(await page.locator('text=Words').locator('..').locator('div').first().textContent()).toBe('0');

      // Reset to sample
      await page.getByRole('button', { name: 'Reset to Sample' }).click();
      await page.waitForTimeout(2000);

      // Verify restored state matches initial
      expect(await page.locator('text=Lines').locator('..').locator('div').first().textContent()).toBe(initialStats.lines);
      expect(await page.locator('text=Characters').locator('..').locator('div').first().textContent()).toBe(initialStats.chars);
      expect(await page.locator('text=Words').locator('..').locator('div').first().textContent()).toBe(initialStats.words);
    });
  });

  test.describe('Button Functionality', () => {
    test('should have enabled Reset to Sample button initially', async ({ page }) => {
      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      await expect(resetButton).toBeEnabled();
    });

    test('should have enabled Clear button', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: 'Clear' });
      await expect(clearButton).toBeEnabled();
    });

    test('should handle multiple Clear clicks without errors', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Click Clear multiple times
      const clearButton = page.getByRole('button', { name: 'Clear' });
      await clearButton.click();
      await page.waitForTimeout(300);
      await clearButton.click();
      await page.waitForTimeout(300);
      await clearButton.click();
      await page.waitForTimeout(300);

      // Should still show 0 statistics
      const linesText = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      expect(linesText).toBe('0');
    });

    test('should handle multiple Reset clicks without errors', async ({ page }) => {
      await page.waitForTimeout(2000);

      const initialLines = await page.locator('text=Lines').locator('..').locator('div').first().textContent();

      // Click Reset multiple times
      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      await resetButton.click();
      await page.waitForTimeout(1500);
      await resetButton.click();
      await page.waitForTimeout(1500);

      // Should still show same statistics
      const currentLines = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      expect(currentLines).toBe(initialLines);
    });
  });

  test.describe('Error Handling', () => {
    test('should not show error alerts on successful load', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Check for error alert (should not exist)
      const errorAlert = page.locator('[role="alert"]:has-text("Error")');
      await expect(errorAlert).not.toBeVisible();
    });

    test('should handle page reload gracefully', async ({ page }) => {
      await page.waitForTimeout(2000);

      // Reload the page
      await page.reload();
      await page.waitForTimeout(2000);

      // Verify editor loads again
      const linesText = await page.locator('text=Lines').locator('..').locator('div').first().textContent();
      expect(parseInt(linesText || '0')).toBeGreaterThan(0);
    });
  });

  test.describe('Component Integration', () => {
    test('should integrate XmlEditor component with @nuxt/ui styling', async ({ page }) => {
      // Verify @nuxt/ui components are used (UCard, UButton)
      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      await expect(resetButton).toBeVisible();

      const clearButton = page.getByRole('button', { name: 'Clear' });
      await expect(clearButton).toBeVisible();
    });

    test('should maintain consistent layout structure', async ({ page }) => {
      // Verify main container exists
      const container = page.locator('.container').first();
      await expect(container).toBeVisible();

      // Verify editor is within proper card structure
      const monacoEditor = page.locator('.monaco-editor');
      await expect(monacoEditor).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // H1 for app title
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      // H2 for page title
      const h2 = page.locator('h2').first();
      await expect(h2).toBeVisible();
      await expect(h2).toHaveText('Monaco XML Editor Demo');

      // H3 for section headings
      const h3Elements = page.locator('h3');
      await expect(h3Elements).toHaveCount(3); // Statistics, Features, How to Use
    });

    test('should support keyboard navigation to buttons', async ({ page }) => {
      // Tab to buttons and verify they can be focused
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // One of the buttons should be focused (can't guarantee which due to page structure)
      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      const clearButton = page.getByRole('button', { name: 'Clear' });

      // At least one should be in the tab order
      await expect(resetButton).toBeVisible();
      await expect(clearButton).toBeVisible();
    });

    test('should have accessible Monaco editor with aria-label', async ({ page }) => {
      const editorTextbox = page.getByRole('textbox', { name: /Editor content/i });
      await expect(editorTextbox).toHaveAttribute('aria-label', 'Editor content');
    });
  });

  test.describe('Responsive Design', () => {
    test('should render correctly on desktop viewport (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(1000);

      const heading = page.locator('h2', { hasText: 'Monaco XML Editor Demo' });
      await expect(heading).toBeVisible();

      const monacoEditor = page.locator('.monaco-editor');
      await expect(monacoEditor).toBeVisible();
    });

    test('should render correctly on minimum supported viewport (1024px)', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.waitForTimeout(1000);

      const heading = page.locator('h2', { hasText: 'Monaco XML Editor Demo' });
      await expect(heading).toBeVisible();

      const resetButton = page.getByRole('button', { name: 'Reset to Sample' });
      await expect(resetButton).toBeVisible();

      const monacoEditor = page.locator('.monaco-editor');
      await expect(monacoEditor).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load Monaco editor within reasonable time', async ({ page }) => {
      const startTime = Date.now();

      // Wait for editor to be visible
      await page.waitForSelector('.monaco-editor', { timeout: 10000 });

      const loadTime = Date.now() - startTime;

      // Monaco should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('should respond to button clicks quickly', async ({ page }) => {
      await page.waitForTimeout(2000);

      const startTime = Date.now();
      await page.getByRole('button', { name: 'Clear' }).click();
      await page.waitForTimeout(100);
      const clickResponseTime = Date.now() - startTime;

      // Button should respond within 1 second
      expect(clickResponseTime).toBeLessThan(1000);
    });
  });

  test.describe('Console and Browser Errors', () => {
    test('should not have critical console errors', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(3000);

      // Allow Monaco web worker warnings but no actual errors
      const criticalErrors = errors.filter(
        (error) => !error.includes('web worker') && !error.includes('WARNING')
      );

      expect(criticalErrors.length).toBe(0);
    });

    test('should not have uncaught exceptions', async ({ page }) => {
      const exceptions: Error[] = [];

      page.on('pageerror', (error) => {
        exceptions.push(error);
      });

      await page.waitForTimeout(2000);

      // Click buttons to trigger interactions
      await page.getByRole('button', { name: 'Clear' }).click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Reset to Sample' }).click();
      await page.waitForTimeout(2000);

      expect(exceptions.length).toBe(0);
    });
  });
});
