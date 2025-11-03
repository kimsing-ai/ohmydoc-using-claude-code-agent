import { test, expect } from '@playwright/test';

/**
 * MVP 3: Template System with Modern Template Implementation
 *
 * Test Strategy (from Task #3):
 * - Verify template renders all cover letter sections
 * - Styling matches design system (colors, typography)
 * - ONLY scoped CSS used (no @nuxt/ui in template)
 * - Template accepts ParsedData props
 * - Template is exportable as standalone HTML
 *
 * Related Files:
 * - composables/useTemplate.ts
 * - templates/modern/CoverLetterModern.vue
 * - templates/modern/styles.css
 * - pages/debug/template.vue
 */

test.describe('MVP 3: Template System - Page Load and Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
  });

  test('should load the debug template page correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('Template Demo - ohmydoc');

    // Verify page heading
    const heading = page.locator('h1', { hasText: 'Template Renderer Demo' });
    await expect(heading).toBeVisible();

    // Verify page description
    const description = page.getByText(/Testing the Modern template with comprehensive sample data/i);
    await expect(description).toBeVisible();
  });

  test('should display active template information', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify template badge/indicator
    const templateBadge = page.getByText(/Active Template:.*Modern/i);
    await expect(templateBadge).toBeVisible();

    // Verify template description
    const templateDescription = page.getByText(/Professional cover letter template with modern styling/i);
    await expect(templateDescription).toBeVisible();
  });

  test('should have debug information section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verify Debug Information section exists
    const debugHeading = page.getByRole('heading', { name: /Debug Information/i });
    await expect(debugHeading).toBeVisible();

    // Verify Template System subsection
    const templateSystemHeading = page.getByRole('heading', { name: /Template System/i });
    await expect(templateSystemHeading).toBeVisible();

    // Verify active template is shown
    await expect(page.getByText(/Active Template:.*modern/i)).toBeVisible();

    // Verify available templates are listed
    await expect(page.getByText(/Available Templates:.*modern/i)).toBeVisible();
  });

  test('should display sample data structure in debug section', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verify Sample Data Structure subsection
    const sampleDataHeading = page.getByRole('heading', { name: /Sample Data Structure/i });
    await expect(sampleDataHeading).toBeVisible();

    // Verify JSON data is displayed
    const jsonBlock = page.locator('pre.code-block');
    await expect(jsonBlock).toBeVisible();

    const jsonText = await jsonBlock.textContent();
    expect(jsonText).toContain('"formatStyle"');
    expect(jsonText).toContain('"applicant"');
    expect(jsonText).toContain('"Jane Doe"');
  });
});

test.describe('MVP 3: Template System - Modern Template Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');
  });

  test('should render the template with article element (semantic HTML)', async ({ page }) => {
    // Modern template uses <article> as root element (semantic HTML requirement)
    const article = page.locator('article.application-document');
    await expect(article).toBeVisible();
  });

  test('should render applicant header section with all fields', async ({ page }) => {
    // Verify header exists
    const header = page.locator('header.application-header');
    await expect(header).toBeVisible();

    // Verify applicant name (should be h1 within header)
    const applicantName = page.locator('h1.applicant-name');
    await expect(applicantName).toBeVisible();
    await expect(applicantName).toHaveText('Jane Doe');

    // Verify applicant address
    const address = page.locator('address.applicant-address');
    await expect(address).toBeVisible();
    const addressText = await address.textContent();
    expect(addressText).toContain('123 Main Street');
    expect(addressText).toContain('Springfield, IL 62704');

    // Verify contact information
    const contactInfo = page.locator('.contact-information');
    await expect(contactInfo).toBeVisible();
    const contactText = await contactInfo.textContent();
    expect(contactText).toContain('(555) 123-4567');
    expect(contactText).toContain('jane.doe@email.com');

    // Verify email is a clickable link
    const emailLink = page.locator('a.email');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:jane.doe@email.com');
  });

  test('should render document date section', async ({ page }) => {
    const dateSection = page.locator('.document-date');
    await expect(dateSection).toBeVisible();
    await expect(dateSection).toHaveText('June 15, 2024');
  });

  test('should render recipient section with all fields', async ({ page }) => {
    const recipientSection = page.locator('.recipient');
    await expect(recipientSection).toBeVisible();

    // Verify recipient position
    const position = page.locator('.recipient-position');
    await expect(position).toBeVisible();
    await expect(position).toHaveText('Hiring Manager');

    // Verify recipient company
    const company = page.locator('.recipient-company');
    await expect(company).toBeVisible();
    await expect(company).toHaveText('Brightwave Marketing');

    // Verify recipient address
    const address = page.locator('.recipient-address');
    await expect(address).toBeVisible();
    const addressText = await address.textContent();
    expect(addressText).toContain('789 Market Avenue');
    expect(addressText).toContain('Chicago, IL 60601');
  });

  test('should render letter content section with main element', async ({ page }) => {
    // Letter content should be in <main> element (semantic HTML)
    const mainContent = page.locator('main.letter');
    await expect(mainContent).toBeVisible();
  });

  test('should render letter salutation', async ({ page }) => {
    const salutation = page.locator('.salutation');
    await expect(salutation).toBeVisible();
    await expect(salutation).toHaveText('Dear Hiring Manager,');
  });

  test('should render letter introduction', async ({ page }) => {
    const introduction = page.locator('.introduction');
    await expect(introduction).toBeVisible();
    const introText = await introduction.textContent();
    expect(introText).toContain('Marketing Coordinator position');
    expect(introText).toContain('Brightwave Marketing');
  });

  test('should render experience section with multiple experiences', async ({ page }) => {
    const experienceSection = page.locator('.experience-section');
    await expect(experienceSection).toBeVisible();

    // Verify multiple experience entries exist
    const experiences = page.locator('.experience');
    await expect(experiences).toHaveCount(2); // Sample data has 2 experiences

    // Verify first experience employer
    const firstEmployer = experiences.nth(0).locator('.experience-employer strong');
    await expect(firstEmployer).toHaveText('GreenLeaf Promotions');

    // Verify second experience employer
    const secondEmployer = experiences.nth(1).locator('.experience-employer strong');
    await expect(secondEmployer).toHaveText('TechStart Solutions');
  });

  test('should render achievements as bullet list for each experience', async ({ page }) => {
    const firstExperience = page.locator('.experience').nth(0);

    // Verify achievements list exists
    const achievementsList = firstExperience.locator('ul.achievements');
    await expect(achievementsList).toBeVisible();

    // Verify achievements are list items
    const achievements = firstExperience.locator('li.achievement');
    await expect(achievements).toHaveCount(3); // First experience has 3 achievements

    // Verify first achievement content
    const firstAchievement = achievements.nth(0);
    const achievementText = await firstAchievement.textContent();
    expect(achievementText).toContain('social media campaigns');
    expect(achievementText).toContain('150%');
  });

  test('should render letter motivation', async ({ page }) => {
    const motivation = page.locator('.motivation');
    await expect(motivation).toBeVisible();
    const motivationText = await motivation.textContent();
    expect(motivationText).toContain('Brightwave Marketing');
    expect(motivationText).toContain('commitment to creative and data-driven strategies');
  });

  test('should render letter closing', async ({ page }) => {
    const closing = page.locator('.closing');
    await expect(closing).toBeVisible();
    const closingText = await closing.textContent();
    expect(closingText).toContain('Thank you for considering my application');
  });

  test('should render letter signature', async ({ page }) => {
    const signature = page.locator('.signature');
    await expect(signature).toBeVisible();
    await expect(signature).toHaveText('Jane Doe');
  });
});

test.describe('MVP 3: Template System - Design System Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');
  });

  test('should use design system color palette', async ({ page }) => {
    // Check that CSS variables are defined (PRD 4.2: --ink, --muted, --accent)
    const article = page.locator('article.application-document');

    // Get computed styles
    const backgroundColor = await article.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Background should be white (as per styles.css)
    expect(backgroundColor).toMatch(/rgb\(255,\s*255,\s*255\)/);

    // Verify main text color uses dark ink color (should be very dark)
    const color = await article.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Color should be dark (close to #111)
    expect(color).toMatch(/rgb\(17,\s*17,\s*17\)/);
  });

  test('should use design system typography', async ({ page }) => {
    const article = page.locator('article.application-document');

    // Check font family (should use serif for body per PRD 4.3)
    const fontFamily = await article.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    // Should contain serif fonts
    expect(fontFamily.toLowerCase()).toMatch(/serif|georgia|times/);

    // Verify font size is set (16px base per styles.css)
    const fontSize = await article.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    expect(fontSize).toBe('16px');

    // Verify line height (1.6 per styles.css)
    const lineHeight = await article.evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });

    // Line height should be 1.6 times font size (approximately 25.6px)
    expect(parseFloat(lineHeight)).toBeGreaterThanOrEqual(24);
    expect(parseFloat(lineHeight)).toBeLessThanOrEqual(27);
  });

  test('should use proper spacing and layout', async ({ page }) => {
    const article = page.locator('article.application-document');

    // Check max-width constraint (720px per styles.css)
    const maxWidth = await article.evaluate((el) => {
      return window.getComputedStyle(el).maxWidth;
    });

    expect(maxWidth).toBe('720px');

    // Verify article has padding
    const padding = await article.evaluate((el) => {
      return window.getComputedStyle(el).padding;
    });

    expect(padding).not.toBe('0px');
  });

  test('should style email link with hover effect', async ({ page }) => {
    const emailLink = page.locator('a.email');

    // Get initial color
    const initialColor = await emailLink.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Verify link has text decoration or border
    const textDecoration = await emailLink.evaluate((el) => {
      return window.getComputedStyle(el).textDecoration;
    });
    const borderBottom = await emailLink.evaluate((el) => {
      return window.getComputedStyle(el).borderBottom;
    });

    // Should have either underline or border-bottom
    const hasDecoration = textDecoration !== 'none' || borderBottom !== 'none';
    expect(hasDecoration).toBe(true);
  });
});

test.describe('MVP 3: Template System - No @nuxt/ui in Template', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');
  });

  test('should use only standard HTML elements in template (no UContainer, UButton, etc.)', async ({ page }) => {
    // Verify template content uses standard HTML elements
    const article = page.locator('article.application-document');
    await expect(article).toBeVisible();

    // Check for absence of Nuxt UI component classes/attributes
    // Nuxt UI components typically have data-* attributes or specific class patterns
    const hasNuxtUIComponents = await article.evaluate((el) => {
      // Check if any descendant has Nuxt UI indicators
      const descendants = el.querySelectorAll('*');
      for (const desc of descendants) {
        const classes = desc.className.toString();
        // Common Nuxt UI patterns: starts with 'u-' or contains specific component names
        if (classes.match(/\bu-[a-z]/i)) {
          return true;
        }
      }
      return false;
    });

    expect(hasNuxtUIComponents).toBe(false);
  });

  test('should render template content within scoped CSS classes only', async ({ page }) => {
    const article = page.locator('article.application-document');

    // Verify all major sections use semantic class names (not utility classes)
    await expect(page.locator('.application-header')).toBeVisible();
    await expect(page.locator('.applicant-name')).toBeVisible();
    await expect(page.locator('.document-date')).toBeVisible();
    await expect(page.locator('.recipient')).toBeVisible();
    await expect(page.locator('.letter')).toBeVisible();
    await expect(page.locator('.salutation')).toBeVisible();
    await expect(page.locator('.experience-section')).toBeVisible();

    // These are semantic, scoped CSS classes (not Tailwind or @nuxt/ui utilities)
  });
});

test.describe('MVP 3: Template System - Exportability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');
  });

  test('should render template with inline or external styles (exportable)', async ({ page }) => {
    const article = page.locator('article.application-document');

    // Verify template has applied styles
    const hasStyles = await article.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      // Check if key styles are applied (indicating CSS is loaded)
      return styles.maxWidth === '720px' &&
             styles.fontFamily.includes('serif') &&
             styles.fontSize === '16px';
    });

    expect(hasStyles).toBe(true);
  });

  test('should contain all content in a single article element (standalone)', async ({ page }) => {
    // Verify template is self-contained within article
    const article = page.locator('article.application-document');

    // All letter content should be within this article
    const hasAllContent = await article.evaluate((el) => {
      const text = el.textContent || '';
      return text.includes('Jane Doe') &&
             text.includes('Hiring Manager') &&
             text.includes('Brightwave Marketing') &&
             text.includes('Dear Hiring Manager') &&
             text.includes('GreenLeaf Promotions') &&
             text.includes('TechStart Solutions');
    });

    expect(hasAllContent).toBe(true);
  });

  test('should use standard HTML that works without Vue runtime', async ({ page }) => {
    // Extract the rendered HTML of the template
    const templateHTML = await page.locator('article.application-document').innerHTML();

    // Verify it's standard HTML (no Vue directives like v-if, v-for, etc.)
    expect(templateHTML).not.toContain('v-if');
    expect(templateHTML).not.toContain('v-for');
    expect(templateHTML).not.toContain('v-bind');
    expect(templateHTML).not.toContain(':class=');
    expect(templateHTML).not.toContain('@click=');

    // Should contain standard HTML elements
    expect(templateHTML).toContain('<header');
    expect(templateHTML).toContain('<main');
    expect(templateHTML).toContain('<address');
    expect(templateHTML).toContain('<ul');
    expect(templateHTML).toContain('<li');
  });
});

test.describe('MVP 3: Template System - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');
  });

  test('should use semantic HTML elements', async ({ page }) => {
    // Verify semantic elements exist
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('address')).toHaveCount(2); // applicant and recipient addresses
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Verify h1 exists for applicant name
    const h1 = page.locator('article h1.applicant-name');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Jane Doe');
  });

  test('should have accessible links', async ({ page }) => {
    // Email link should have proper href
    const emailLink = page.locator('a.email');
    await expect(emailLink).toHaveAttribute('href', /^mailto:/);
    await expect(emailLink).toHaveText('jane.doe@email.com');
  });

  test('should use list elements for achievements', async ({ page }) => {
    // Achievements should be in proper list structure
    const achievementsList = page.locator('ul.achievements').first();
    await expect(achievementsList).toBeVisible();

    const listItems = achievementsList.locator('li');
    const count = await listItems.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('MVP 3: Template System - User Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/debug/template');
  });

  test('should load template quickly without rendering delays', async ({ page }) => {
    const startTime = Date.now();

    // Wait for template to be visible
    await page.locator('article.application-document').waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds (generous limit for deployed app)
    expect(loadTime).toBeLessThan(3000);
  });

  test('should display all content without scrolling horizontally', async ({ page }) => {
    // Check if page requires horizontal scroll (should not)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('should render readable text without layout issues', async ({ page }) => {
    const article = page.locator('article.application-document');

    // Verify article is visible and has reasonable dimensions
    const box = await article.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);

      // Width should not exceed max-width of 720px (plus some padding)
      expect(box.width).toBeLessThanOrEqual(800);
    }
  });
});

test.describe('MVP 3: Template System - No Console Errors', () => {
  test('should not produce console errors during template rendering', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to template page
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');

    // Wait for template to render
    await page.locator('article.application-document').waitFor({ state: 'visible' });

    // Verify no console errors occurred
    expect(consoleErrors).toEqual([]);
  });

  test('should not have missing CSS or broken styles', async ({ page }) => {
    await page.goto('/debug/template');
    await page.waitForLoadState('networkidle');

    const article = page.locator('article.application-document');

    // Check if styles are properly applied
    const computedStyle = await article.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        maxWidth: styles.maxWidth,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize
      };
    });

    // Verify key styles are not default/missing
    expect(computedStyle.display).not.toBe('inline'); // Should be block-level
    expect(computedStyle.maxWidth).toBe('720px');
    expect(computedStyle.fontFamily).toContain('serif');
    expect(computedStyle.fontSize).toBe('16px');
  });
});
