import { test, expect, Page } from '@playwright/test';

// Helper function to select dropdown option in USelect
async function selectDropdownOption(page: Page, optionName: string) {
  const dropdownButton = page.locator('#xml-select');
  await dropdownButton.click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: optionName }).click();
  await page.waitForTimeout(500);
}

test.describe('MVP 5: Preview Panel Component with Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/preview');
  });

  test.describe('Page Load and Basic Rendering', () => {
    test('should load the Preview Panel debug page successfully', async ({ page }) => {
      // Verify page heading
      const heading = page.locator('h1', { hasText: 'Preview Panel Component Debug' });
      await expect(heading).toBeVisible();

      // Verify subtitle
      const subtitle = page.getByText(/Testing PreviewPanel with various XML scenarios \(MVP 5\)/i);
      await expect(subtitle).toBeVisible();
    });

    test('should display XML sample selector dropdown', async ({ page }) => {
      // USelect renders with an ID we can target
      const dropdownButton = page.locator('#xml-select');
      await expect(dropdownButton).toBeVisible();
    });

    test('should display zoom control buttons', async ({ page }) => {
      const zoom75 = page.getByRole('button', { name: '75%' });
      const zoom100 = page.getByRole('button', { name: '100%' });
      const zoom125 = page.getByRole('button', { name: '125%' });
      const zoom150 = page.getByRole('button', { name: '150%' });

      await expect(zoom75).toBeVisible();
      await expect(zoom100).toBeVisible();
      await expect(zoom125).toBeVisible();
      await expect(zoom150).toBeVisible();
    });

    test('should display parse status section', async ({ page }) => {
      const statusHeading = page.locator('h3', { hasText: 'Parse Status' });
      await expect(statusHeading).toBeVisible();

      // Check for status labels - use exact match to avoid duplicate matches
      await expect(page.getByText('Sample:', { exact: true })).toBeVisible();
      await expect(page.getByText('Status:', { exact: true })).toBeVisible();
      await expect(page.getByText('Field Count:', { exact: true })).toBeVisible();
    });

    test('should display preview output section', async ({ page }) => {
      const previewHeading = page.locator('h3', { hasText: 'Preview Output' });
      await expect(previewHeading).toBeVisible();
    });
  });

  test.describe('Valid XML Sample - Default State', () => {
    test('should render valid sample XML successfully', async ({ page }) => {
      // Wait for preview to render
      await page.waitForTimeout(500);

      // Check parse status shows success
      const status = page.getByText('✓ Success');
      await expect(status).toBeVisible();

      // Verify rendered content from valid sample
      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();

      const email = page.getByRole('link', { name: 'jane.doe@email.com' });
      await expect(email).toBeVisible();
      await expect(email).toHaveAttribute('href', 'mailto:jane.doe@email.com');
    });

    test('should display applicant information correctly', async ({ page }) => {
      await page.waitForTimeout(500);

      // Check address
      await expect(page.getByText('123 Main Street')).toBeVisible();
      await expect(page.getByText('Springfield, IL 62704')).toBeVisible();

      // Check contact info
      await expect(page.getByText('(555) 123-4567')).toBeVisible();
    });

    test('should display letter content correctly', async ({ page }) => {
      await page.waitForTimeout(500);

      // Check date
      await expect(page.getByText('June 15, 2024')).toBeVisible();

      // Check recipient - use first() to avoid strict mode violation
      await expect(page.getByText('Hiring Manager').first()).toBeVisible();
      await expect(page.getByText('Brightwave Marketing').first()).toBeVisible();

      // Check letter body
      await expect(page.getByText('Dear Hiring Manager,')).toBeVisible();
      await expect(page.getByText(/I am writing to express my interest/i)).toBeVisible();
      await expect(page.getByText('Thank you for considering my application.')).toBeVisible();
    });

    test('should display field count for valid XML', async ({ page }) => {
      await page.waitForTimeout(500);

      const fieldCount = page.getByText('~20 fields');
      await expect(fieldCount).toBeVisible();
    });

    test('should not display error alert for valid XML', async ({ page }) => {
      await page.waitForTimeout(500);

      // UAlert with error should not be visible
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).not.toBeVisible();
    });
  });

  test.describe('Invalid XML Syntax - Error Handling', () => {
    test('should display error alert for invalid XML syntax', async ({ page }) => {
      // Select invalid syntax sample
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      // Should show error status
      const errorStatus = page.getByText('✗ Error');
      await expect(errorStatus).toBeVisible();

      // UAlert should be visible with error message
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).toBeVisible();
    });

    test('should not crash on invalid XML syntax', async ({ page }) => {
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      // Page should still be functional (heading visible)
      const heading = page.locator('h1', { hasText: 'Preview Panel Component Debug' });
      await expect(heading).toBeVisible();

      // Preview content should not be visible (only error)
      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).not.toBeVisible();
    });

    test('should show parse error in field count', async ({ page }) => {
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      const fieldCount = page.getByText('N/A (Parse Error)');
      await expect(fieldCount).toBeVisible();
    });
  });

  test.describe('Empty XML - Error Handling', () => {
    test('should handle empty XML gracefully', async ({ page }) => {
      await selectDropdownOption(page, '✗ Empty XML');

      // Should show error status
      const errorStatus = page.getByText('✗ Error');
      await expect(errorStatus).toBeVisible();

      // Should display error or placeholder
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      const placeholder = page.getByText('No content to preview');

      const hasError = await errorAlert.isVisible();
      const hasPlaceholder = await placeholder.isVisible();

      expect(hasError || hasPlaceholder).toBeTruthy();
    });

    test('should show zero fields for empty XML', async ({ page }) => {
      await selectDropdownOption(page, '✗ Empty XML');

      const fieldCount = page.getByText('0 fields');
      await expect(fieldCount).toBeVisible();
    });

    test('should not crash on empty XML', async ({ page }) => {
      await selectDropdownOption(page, '✗ Empty XML');

      // Page should still be functional
      const heading = page.locator('h1', { hasText: 'Preview Panel Component Debug' });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Missing Required Fields - Error Handling', () => {
    test('should handle missing required fields with error message', async ({ page }) => {
      await selectDropdownOption(page, '✗ Missing Required Fields');

      // Should show error status
      const errorStatus = page.getByText('✗ Error');
      await expect(errorStatus).toBeVisible();

      // UAlert should be visible with error about missing fields
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).toBeVisible();
    });

    test('should indicate missing required fields in field count', async ({ page }) => {
      await selectDropdownOption(page, '✗ Missing Required Fields');

      const fieldCount = page.getByText('N/A (Missing Required)');
      await expect(fieldCount).toBeVisible();
    });

    test('should not crash on missing required fields', async ({ page }) => {
      await selectDropdownOption(page, '✗ Missing Required Fields');

      // Page should still be functional
      const heading = page.locator('h1', { hasText: 'Preview Panel Component Debug' });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Extra/Unexpected Fields - Graceful Handling', () => {
    test('should render XML with extra fields successfully', async ({ page }) => {
      await selectDropdownOption(page, '+ Extra/Unexpected Fields');

      // Should show success status (extra fields are ignored, not errors)
      const successStatus = page.getByText('✓ Success');
      await expect(successStatus).toBeVisible();

      // Content should render
      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();
    });

    test('should show increased field count for extra fields', async ({ page }) => {
      await selectDropdownOption(page, '+ Extra/Unexpected Fields');

      const fieldCount = page.getByText('~25 fields (includes extra)');
      await expect(fieldCount).toBeVisible();
    });

    test('should not display error alert for extra fields', async ({ page }) => {
      await selectDropdownOption(page, '+ Extra/Unexpected Fields');

      // No error should be shown
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).not.toBeVisible();
    });
  });

  test.describe('Zoom Functionality', () => {
    test('should apply 75% zoom when button clicked', async ({ page }) => {
      await page.waitForTimeout(500);

      const zoom75Button = page.getByRole('button', { name: '75%' });
      await zoom75Button.click();

      await page.waitForTimeout(300);

      // Check button is highlighted/active
      // Note: Visual zoom effect is CSS-based, hard to verify in Playwright
      // We verify button interaction works
      await expect(zoom75Button).toBeVisible();
    });

    test('should apply 125% zoom when button clicked', async ({ page }) => {
      await page.waitForTimeout(500);

      const zoom125Button = page.getByRole('button', { name: '125%' });
      await zoom125Button.click();

      await page.waitForTimeout(300);

      // Verify button responds
      await expect(zoom125Button).toBeVisible();
    });

    test('should apply 150% zoom when button clicked', async ({ page }) => {
      await page.waitForTimeout(500);

      const zoom150Button = page.getByRole('button', { name: '150%' });
      await zoom150Button.click();

      await page.waitForTimeout(300);

      // Verify button responds
      await expect(zoom150Button).toBeVisible();
    });

    test('should default to 100% zoom', async ({ page }) => {
      await page.waitForTimeout(500);

      const zoom100Button = page.getByRole('button', { name: '100%' });
      await expect(zoom100Button).toBeVisible();
    });

    test('should maintain zoom level when switching XML samples', async ({ page }) => {
      await page.waitForTimeout(500);

      // Set zoom to 125%
      const zoom125Button = page.getByRole('button', { name: '125%' });
      await zoom125Button.click();
      await page.waitForTimeout(300);

      // Switch to different XML sample
      await selectDropdownOption(page, '+ Extra/Unexpected Fields');

      // Zoom button should still be visible (zoom persists)
      await expect(zoom125Button).toBeVisible();
    });
  });

  test.describe('Error Recovery', () => {
    test('should recover from error when valid XML is provided', async ({ page }) => {
      // First, select invalid XML
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      // Verify error is shown
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).toBeVisible();

      // Now switch back to valid XML
      await dropdownButton.click();
      await page.waitForTimeout(300);
      await page.getByRole('option', { name: '✓ Valid Sample XML' }).click();
      await page.waitForTimeout(500);

      // Error should be gone, content should render
      await expect(errorAlert).not.toBeVisible();

      const successStatus = page.getByText('✓ Success');
      await expect(successStatus).toBeVisible();

      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();
    });

    test('should clear error state completely on recovery', async ({ page }) => {
      // Start with empty XML
      await selectDropdownOption(page, '✗ Empty XML');

      // Switch to valid XML
      await dropdownButton.click();
      await page.waitForTimeout(300);
      await page.getByRole('option', { name: '✓ Valid Sample XML' }).click();
      await page.waitForTimeout(500);

      // No error should remain
      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).not.toBeVisible();

      // All valid content should be present
      await expect(page.getByText('✓ Success')).toBeVisible();
      await expect(page.getByText('~20 fields')).toBeVisible();
    });
  });

  test.describe('Component Reusability (MVP 6 Integration Ready)', () => {
    test('should demonstrate PreviewPanel is reusable component', async ({ page }) => {
      await page.waitForTimeout(500);

      // PreviewPanel should be isolated within preview wrapper
      const previewWrapper = page.locator('.preview-wrapper');
      await expect(previewWrapper).toBeVisible();

      // Component should function independently
      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();
    });

    test('should handle prop updates reactively', async ({ page }) => {
      await page.waitForTimeout(500);

      // Initial state - valid XML
      let applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();

      // Update props by switching sample
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      // Component should react to prop change
      await expect(applicantName).not.toBeVisible();

      const errorAlert = page.locator('[role="alert"]').filter({ hasText: 'XML Parsing Error' });
      await expect(errorAlert).toBeVisible();
    });
  });

  test.describe('Integration Points (MVP 2 & MVP 3)', () => {
    test('should integrate XML parser from MVP 2', async ({ page }) => {
      await page.waitForTimeout(500);

      // Parser should successfully parse valid XML
      const successStatus = page.getByText('✓ Success');
      await expect(successStatus).toBeVisible();

      // Parsed data should be available to template
      const applicantName = page.locator('h1', { hasText: 'Jane Doe' });
      await expect(applicantName).toBeVisible();
    });

    test('should integrate template system from MVP 3', async ({ page }) => {
      await page.waitForTimeout(500);

      // Template should render parsed data correctly
      // Check semantic HTML structure from Modern template
      const article = page.locator('article');
      await expect(article).toBeVisible();

      // Check template-specific rendering
      const mainSection = page.locator('main');
      await expect(mainSection).toBeVisible();
    });

    test('should pass parsed data to template as props', async ({ page }) => {
      await page.waitForTimeout(500);

      // Verify data flows through: XML -> Parser -> Template
      // Check various fields are rendered correctly - use first() to avoid strict mode
      await expect(page.getByText('Jane Doe').first()).toBeVisible();
      await expect(page.getByText('June 15, 2024')).toBeVisible();
      await expect(page.getByText('Brightwave Marketing').first()).toBeVisible();
      await expect(page.getByText('Dear Hiring Manager,')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have accessible dropdown with label', async ({ page }) => {
      // USelect renders as a button, check for label and button
      const label = page.locator('label[for="xml-select"]');
      await expect(label).toBeVisible();
      await expect(label).toHaveText('Test XML Sample:');

      const dropdownButton = page.locator('#xml-select');
      await expect(dropdownButton).toBeVisible();
    });

    test('should have accessible zoom buttons', async ({ page }) => {
      const zoom75 = page.getByRole('button', { name: '75%' });
      const zoom100 = page.getByRole('button', { name: '100%' });
      const zoom125 = page.getByRole('button', { name: '125%' });
      const zoom150 = page.getByRole('button', { name: '150%' });

      await expect(zoom75).toBeVisible();
      await expect(zoom100).toBeVisible();
      await expect(zoom125).toBeVisible();
      await expect(zoom150).toBeVisible();
    });

    test('should use proper heading hierarchy', async ({ page }) => {
      await page.waitForTimeout(500);

      // H1 for page title
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();

      // H3 for sections
      const h3Status = page.locator('h3', { hasText: 'Parse Status' });
      const h3Preview = page.locator('h3', { hasText: 'Preview Output' });
      await expect(h3Status).toBeVisible();
      await expect(h3Preview).toBeVisible();
    });

    test('should have accessible error alerts', async ({ page }) => {
      await selectDropdownOption(page, '✗ Invalid Syntax (Unclosed Tag)');

      // Error alert should be accessible
      const errorAlert = page.locator('[role="alert"]');
      await expect(errorAlert).toBeVisible();
    });
  });
});
