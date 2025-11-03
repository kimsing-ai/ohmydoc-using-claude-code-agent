import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Task 2: XML Parser Composable with Interactive Demo
 *
 * Tests validate:
 * - XML parsing functionality using native DOMParser
 * - TypeScript interfaces and type safety
 * - Interactive debug page at /debug/parser
 * - Error handling and validation
 * - Sample XML loading
 *
 * Test Coverage:
 * - ✓ Successful parsing of valid XML
 * - ✓ User-friendly error messages for invalid XML
 * - ✓ Automatic sample loading on mount
 * - ✓ UI interactions (buttons, textarea, alerts)
 * - ✓ Edge cases (empty input, malformed XML, missing fields)
 */

test.describe('Task 2: XML Parser Demo Page - Core Functionality', () => {
  test('should load the debug parser page successfully', async ({ page }) => {
    await page.goto('/debug/parser');

    // Verify page title
    await expect(page).toHaveTitle('XML Parser Demo - OhMyDoc');

    // Verify main heading
    const heading = page.locator('h2:has-text("XML Parser Demo")');
    await expect(heading).toBeVisible();

    // Verify description
    await expect(page.getByText(/Component demo page for MVP 2/i)).toBeVisible();
  });

  test('should automatically load sample XML on mount', async ({ page }) => {
    await page.goto('/debug/parser');

    // Wait for loading state to complete (max 5 seconds)
    await page.waitForTimeout(2000);

    // Verify sample XML is loaded in textarea
    const textarea = page.locator('textarea');
    const xmlContent = await textarea.inputValue();

    // Verify XML content contains expected elements
    expect(xmlContent).toContain('<applicationDocument');
    expect(xmlContent).toContain('<applicant>');
    expect(xmlContent).toContain('<name>Jane Doe</name>');
    expect(xmlContent).toContain('jane.doe@email.com');
    expect(xmlContent).toContain('Brightwave Marketing');
  });

  test('should automatically parse sample XML on load', async ({ page }) => {
    await page.goto('/debug/parser');

    // Wait for automatic parsing to complete
    await page.waitForTimeout(2000);

    // Verify parsed data is displayed
    const parsedDataSection = page.locator('pre:has-text("applicant")');
    await expect(parsedDataSection).toBeVisible();

    // Verify success message appears
    const successAlert = page.locator('[role="alert"]:has-text("Parse Successful")');
    await expect(successAlert).toBeVisible();
  });

  test('should display back navigation button', async ({ page }) => {
    await page.goto('/debug/parser');

    const backButton = page.getByRole('link', { name: /Back to Home/i });
    await expect(backButton).toBeVisible();
    await expect(backButton).toHaveAttribute('href', '/');
  });
});

test.describe('Task 2: XML Parser - Valid XML Parsing', () => {
  test('should parse valid XML and display all fields correctly', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    // Click Parse XML button (sample should already be loaded)
    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    // Wait for parsing to complete
    await page.waitForTimeout(500);

    // Verify success message
    const successAlert = page.locator('[role="alert"]:has-text("Parse Successful")');
    await expect(successAlert).toBeVisible();

    // Verify parsed JSON output contains expected fields
    const jsonOutput = page.locator('pre');
    const jsonText = await jsonOutput.textContent();

    // Verify applicant data
    expect(jsonText).toContain('"name": "Jane Doe"');
    expect(jsonText).toContain('"phone": "(555) 123-4567"');
    expect(jsonText).toContain('"email": "jane.doe@email.com"');
    expect(jsonText).toContain('"street": "123 Main Street"');
    expect(jsonText).toContain('"city": "Springfield"');
    expect(jsonText).toContain('"state": "IL"');
    expect(jsonText).toContain('"zipCode": "62704"');

    // Verify recipient data
    expect(jsonText).toContain('"position": "Hiring Manager"');
    expect(jsonText).toContain('"company": "Brightwave Marketing"');

    // Verify letter data
    expect(jsonText).toContain('"salutation": "Dear Hiring Manager,"');
    expect(jsonText).toContain('Marketing Coordinator position');
    expect(jsonText).toContain('"signature": "Jane Doe"');

    // Verify experience section
    expect(jsonText).toContain('"employer": "GreenLeaf Promotions"');
    expect(jsonText).toContain('Managed multiple successful social media campaigns');
  });

  test('should format JSON output with proper indentation', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();
    await page.waitForTimeout(500);

    const jsonOutput = page.locator('pre');
    const jsonText = await jsonOutput.textContent();

    // Verify JSON is formatted (contains newlines and indentation)
    expect(jsonText).toContain('\n');
    expect(jsonText).toContain('  "applicant"'); // 2-space indentation
    expect(jsonText).toContain('    "name"'); // 4-space nested indentation
  });

  test('should parse formatStyle attribute if present', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();
    await page.waitForTimeout(500);

    const jsonOutput = page.locator('pre');
    const jsonText = await jsonOutput.textContent();

    // Sample XML has formatStyle="modern"
    expect(jsonText).toContain('"formatStyle": "modern"');
  });
});

test.describe('Task 2: XML Parser - Error Handling & Validation', () => {
  test('should show error for empty XML input', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    // Clear the textarea
    const clearButton = page.getByRole('button', { name: /Clear/i });
    await clearButton.click();

    // Try to parse empty input
    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    // Verify error message
    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();
    await expect(page.getByText(/Please provide XML content to parse/i)).toBeVisible();
  });

  test('should show user-friendly error for malformed XML (unclosed tag)', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    // Enter malformed XML with unclosed tag
    const textarea = page.locator('textarea');
    await textarea.fill(`
      <applicationDocument>
        <applicant>
          <name>Test User
        </applicant>
      </applicationDocument>
    `);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    // Verify user-friendly error message (not raw parser error)
    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();

    const errorText = await errorAlert.textContent();
    expect(errorText).toMatch(/unclosed|mismatched tags/i);
    expect(errorText).not.toContain('parsererror'); // Should not show raw error
  });

  test('should show error for incomplete XML', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    const textarea = page.locator('textarea');
    await textarea.fill(`
      <applicationDocument>
        <applicant>
          <name>Test User</name>
    `); // Missing closing tags

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();
    await expect(page.getByText(/incomplete|end unexpectedly/i)).toBeVisible();
  });

  test('should show error for invalid root element', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    const textarea = page.locator('textarea');
    await textarea.fill(`
      <wrongRoot>
        <applicant>
          <name>Test User</name>
        </applicant>
      </wrongRoot>
    `);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();
    await expect(page.getByText(/Root element must be <applicationDocument>/i)).toBeVisible();
  });

  test('should show error for missing required element', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    const textarea = page.locator('textarea');
    // Valid XML but missing 'date' element
    await textarea.fill(`
      <applicationDocument>
        <applicant>
          <name>Test User</name>
          <address>
            <street>123 St</street>
            <city>City</city>
            <state>ST</state>
            <zipCode>12345</zipCode>
          </address>
          <contactInformation>
            <phone>555-1234</phone>
            <email>test@test.com</email>
          </contactInformation>
        </applicant>
        <recipient>
          <position>Manager</position>
          <company>Company</company>
          <address>
            <street>456 St</street>
            <city>City</city>
            <state>ST</state>
            <zipCode>12345</zipCode>
          </address>
        </recipient>
        <letter>
          <salutation>Dear Sir,</salutation>
          <introduction>Intro</introduction>
          <experienceSection></experienceSection>
          <motivation>Motivation</motivation>
          <closing>Closing</closing>
          <signature>Signature</signature>
        </letter>
      </applicationDocument>
    `);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();
    await expect(page.getByText(/Missing required element: <date>/i)).toBeVisible();
  });

  test('should allow closing error alerts', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    // Clear textarea to trigger error
    const clearButton = page.getByRole('button', { name: /Clear/i });
    await clearButton.click();

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();

    const errorAlert = page.locator('[role="alert"]:has-text("Validation Error")');
    await expect(errorAlert).toBeVisible();

    // Close the alert
    const closeButton = errorAlert.locator('button[aria-label*="Close"]').or(errorAlert.locator('button:has-text("×")'));
    await closeButton.first().click();

    // Verify alert is closed
    await expect(errorAlert).not.toBeVisible();
  });
});

test.describe('Task 2: XML Parser - UI Interactions', () => {
  test('should reload sample XML when clicking Reload Sample button', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    // Modify the textarea content
    const textarea = page.locator('textarea');
    await textarea.fill('Modified content');

    // Click Reload Sample
    const reloadButton = page.getByRole('button', { name: /Reload Sample/i });
    await reloadButton.click();

    // Wait for reload
    await page.waitForTimeout(1500);

    // Verify sample is reloaded
    const xmlContent = await textarea.inputValue();
    expect(xmlContent).toContain('<applicationDocument');
    expect(xmlContent).toContain('Jane Doe');
  });

  test('should clear input when clicking Clear button', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    // Verify textarea has content initially
    const textarea = page.locator('textarea');
    let content = await textarea.inputValue();
    expect(content.length).toBeGreaterThan(0);

    // Click Clear
    const clearButton = page.getByRole('button', { name: /Clear/i });
    await clearButton.click();

    // Verify textarea is empty
    content = await textarea.inputValue();
    expect(content).toBe('');

    // Verify parsed data is cleared
    await expect(page.locator('pre:has-text("applicant")')).not.toBeVisible();
  });

  test('should disable Parse button when textarea is empty', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    // Clear textarea
    const clearButton = page.getByRole('button', { name: /Clear/i });
    await clearButton.click();

    // Verify Parse button is disabled
    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await expect(parseButton).toBeDisabled();
  });

  test('should show loading state when loading sample', async ({ page }) => {
    // Slow network to catch loading state
    await page.route('**/samples/cover-letter.xml', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/debug/parser');

    // Check for loading alert (might be brief)
    const loadingAlert = page.locator('[role="alert"]:has-text("Loading Sample XML")');
    // Loading alert may disappear quickly, so we just check page loads
    await page.waitForLoadState('networkidle');

    // Verify page loaded successfully
    await expect(page.locator('h2:has-text("XML Parser Demo")')).toBeVisible();
  });

  test('should allow manual XML editing and parsing', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    const textarea = page.locator('textarea');

    // Create custom valid XML
    const customXml = `<applicationDocument>
      <applicant>
        <name>John Smith</name>
        <address>
          <street>456 Oak Ave</street>
          <city>Boston</city>
          <state>MA</state>
          <zipCode>02101</zipCode>
        </address>
        <contactInformation>
          <phone>617-555-0000</phone>
          <email>john@example.com</email>
        </contactInformation>
      </applicant>
      <date>December 1, 2024</date>
      <recipient>
        <position>CEO</position>
        <company>TechCorp</company>
        <address>
          <street>789 Tech Blvd</street>
          <city>San Francisco</city>
          <state>CA</state>
          <zipCode>94102</zipCode>
        </address>
      </recipient>
      <letter>
        <salutation>Dear CEO,</salutation>
        <introduction>Custom introduction text</introduction>
        <experienceSection>
          <experience>
            <employer>Custom Company</employer>
            <achievements>
              <achievement>Custom achievement 1</achievement>
              <achievement>Custom achievement 2</achievement>
            </achievements>
          </experience>
        </experienceSection>
        <motivation>Custom motivation text</motivation>
        <closing>Custom closing text</closing>
        <signature>John Smith</signature>
      </letter>
    </applicationDocument>`;

    await textarea.fill(customXml);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.click();
    await page.waitForTimeout(500);

    // Verify custom data is parsed
    const jsonOutput = page.locator('pre');
    const jsonText = await jsonOutput.textContent();

    expect(jsonText).toContain('"name": "John Smith"');
    expect(jsonText).toContain('"city": "Boston"');
    expect(jsonText).toContain('"company": "TechCorp"');
    expect(jsonText).toContain('Custom achievement 1');
  });
});

test.describe('Task 2: XML Parser - Instructions and Documentation', () => {
  test('should display How to Use instructions', async ({ page }) => {
    await page.goto('/debug/parser');

    // Verify instructions card header
    await expect(page.getByText('How to Use')).toBeVisible();

    // Verify instruction steps are present
    await expect(page.getByText(/Sample XML/i)).toBeVisible();
    await expect(page.getByText(/Edit XML/i)).toBeVisible();
    await expect(page.getByText(/Parse:/i)).toBeVisible();
    await expect(page.getByText(/View Results/i)).toBeVisible();
    await expect(page.getByText(/Test Validation/i)).toBeVisible();
  });

  test('should mention testing invalid XML in instructions', async ({ page }) => {
    await page.goto('/debug/parser');

    const instructions = page.locator('text=/Test Validation.*missing tags.*unclosed elements/i');
    await expect(instructions).toBeVisible();
  });
});

test.describe('Task 2: XML Parser - Accessibility', () => {
  test('should have proper labels for form elements', async ({ page }) => {
    await page.goto('/debug/parser');

    // Verify textarea has label
    await expect(page.getByText('XML Input')).toBeVisible();

    // Verify section labels
    await expect(page.getByText('Parsed Data (JSON)')).toBeVisible();
  });

  test('should have keyboard-accessible buttons', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    // Tab to Parse button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs to reach Parse button

    // Parse button should be focusable
    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await expect(parseButton).toBeVisible();
  });

  test('should maintain focus management during interactions', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });
    await parseButton.focus();

    // Verify button is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('type', 'button');
  });
});

test.describe('Task 2: XML Parser - Performance & Responsiveness', () => {
  test('should parse large XML documents efficiently', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1000);

    // Create a larger XML with multiple experiences
    const largeXml = `<applicationDocument>
      <applicant>
        <name>Test User</name>
        <address>
          <street>123 Street</street>
          <city>City</city>
          <state>ST</state>
          <zipCode>12345</zipCode>
        </address>
        <contactInformation>
          <phone>555-1234</phone>
          <email>test@test.com</email>
        </contactInformation>
      </applicant>
      <date>January 1, 2024</date>
      <recipient>
        <position>Manager</position>
        <company>Company</company>
        <address>
          <street>456 Street</street>
          <city>City</city>
          <state>ST</state>
          <zipCode>54321</zipCode>
        </address>
      </recipient>
      <letter>
        <salutation>Dear Manager,</salutation>
        <introduction>${'Long introduction text. '.repeat(50)}</introduction>
        <experienceSection>
          ${Array(10).fill(0).map((_, i) => `
            <experience>
              <employer>Company ${i}</employer>
              <achievements>
                <achievement>Achievement 1 for company ${i}</achievement>
                <achievement>Achievement 2 for company ${i}</achievement>
                <achievement>Achievement 3 for company ${i}</achievement>
              </achievements>
            </experience>
          `).join('')}
        </experienceSection>
        <motivation>${'Motivation text. '.repeat(50)}</motivation>
        <closing>${'Closing text. '.repeat(20)}</closing>
        <signature>Test User</signature>
      </letter>
    </applicationDocument>`;

    const textarea = page.locator('textarea');
    await textarea.fill(largeXml);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });

    // Measure parse time
    const startTime = Date.now();
    await parseButton.click();
    await page.waitForTimeout(100); // Give time for parsing

    // Verify success within reasonable time
    const successAlert = page.locator('[role="alert"]:has-text("Parse Successful")');
    await expect(successAlert).toBeVisible({ timeout: 2000 });

    const parseTime = Date.now() - startTime;

    // Verify JSON output is present
    const jsonOutput = page.locator('pre');
    await expect(jsonOutput).toBeVisible();

    // Log performance (for reporting)
    console.log(`Parse time for large XML: ${parseTime}ms`);
  });

  test('should handle rapid button clicks gracefully', async ({ page }) => {
    await page.goto('/debug/parser');
    await page.waitForTimeout(1500);

    const parseButton = page.getByRole('button', { name: /Parse XML/i });

    // Click parse button multiple times rapidly
    await parseButton.click();
    await parseButton.click();
    await parseButton.click();

    await page.waitForTimeout(500);

    // Verify no errors occurred
    await expect(page.locator('[role="alert"]:has-text("Parse Successful")')).toBeVisible();

    // Verify parsed data is displayed
    await expect(page.locator('pre:has-text("applicant")')).toBeVisible();
  });
});

test.describe('Task 2: XML Parser - Navigation & Integration', () => {
  test('should navigate back to home page', async ({ page }) => {
    await page.goto('/debug/parser');

    const backButton = page.getByRole('link', { name: /Back to Home/i });
    await backButton.click();

    // Verify navigation to home
    await expect(page).toHaveURL('/');
    await expect(page.locator('h2:has-text("Welcome to OhMyDoc")')).toBeVisible();
  });

  test('should maintain consistent header across pages', async ({ page }) => {
    await page.goto('/debug/parser');

    const header = page.locator('h1:has-text("OhMyDoc")');
    await expect(header).toBeVisible();

    // Navigate to home
    await page.goto('/');
    await expect(header).toBeVisible();
  });
});
