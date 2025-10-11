# Product Requirements Document: XML-to-HTML Real-Time Transformer

## 1. Overview

### 1.1 Product Vision
A modern, browser-based real-time transformer application that allows users to edit structured XML documents and see instant HTML preview rendering. The application focuses on document formatting (e.g., cover letters, resumes) with a clean, intuitive interface. **This is a Proof of Concept (PoC) version** focusing on core functionality with code-level template extensibility.

### 1.2 Target Users
- Content creators and writers
- HR professionals and recruiters
- Document designers
- Developers working with XML/HTML transformations

### 1.3 Tech Stack
- **Framework**: Nuxt.js (latest version via `npm create nuxt@latest`)
- **Language**: TypeScript
- **Styling**: Vue Scoped CSS (built-in)
- **XML Parsing**: DOMParser (native browser API)
- **Code Editor**: Monaco Editor via `nuxt-monaco-editor`

---

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Dual-Panel Layout
- **Left Panel**: XML Editor
  - Syntax highlighting for XML
  - Line numbers
  - Auto-indentation
  - Real-time validation
  - Resizable panel width

- **Right Panel**: HTML Preview
  - Live rendering of transformed HTML using Vue templates
  - Styled according to the active template's CSS
  - Scrollable content area
  - Responsive layout

#### 2.1.2 Real-Time Transformation
- **Initial State**: Application loads with `sample/cover-letter.xml` pre-populated in editor on first load
- **Instant Updates**: Changes in XML editor trigger immediate preview updates
- **Debouncing**: Implement 300ms debounce to optimize performance
- **Error Handling**: Display friendly error messages for invalid XML
- **Syntax Validation**: Highlight XML syntax errors in the editor

#### 2.1.3 XML Schema Support
Based on `sample/cover-letter.xml`, the application should support the following XML structure:

```xml
<applicationDocument>
  <applicant>
    <name>...</name>
    <address>
      <street>...</street>
      <city>...</city>
      <state>...</state>
      <zipCode>...</zipCode>
    </address>
    <contactInformation>
      <phone>...</phone>
      <email>...</email>
    </contactInformation>
  </applicant>
  <date>...</date>
  <recipient>
    <position>...</position>
    <company>...</company>
    <address>...</address>
  </recipient>
  <letter>
    <salutation>...</salutation>
    <introduction>...</introduction>
    <experienceSection>
      <experience>
        <employer>...</employer>
        <achievements>
          <achievement>...</achievement>
        </achievements>
      </experience>
    </experienceSection>
    <motivation>...</motivation>
    <closing>...</closing>
    <signature>...</signature>
  </letter>
</applicationDocument>
```

**Note**: The XML structure is standardized and does NOT include a `formatStyle` attribute. Template selection is handled at the code level only.

#### 2.1.4 Template-Based Rendering
The application uses **Vue Single File Components (SFCs)** as templates:

- Each template is a `.vue` file with its own HTML structure and scoped CSS
- Templates render the same XML data but with completely different HTML structures
- CSS is template-specific and swaps out entirely when templates change
- **PoC Scope**: Templates are swapped by changing a configuration constant in code (no UI control)

**Example Template Mapping** (Modern Template):

| XML Element | Vue Template Output | CSS Class |
|------------|---------------------|-----------|
| `<applicationDocument>` | `<article>` | `application-document` |
| `<applicant>` | `<div>` or `<header>` | `applicant` |
| `<name>` | `<h1>` | `applicant-name` |
| `<address>` | `<address>` | `applicant-address` / `recipient-address` |
| `<contactInformation>` | `<p>` | `contact-information` |
| `<email>` | `<a :href="mailto:...">` | `email` |
| `<phone>` | `<span>` | `phone` |
| `<date>` | `<time>` | `document-date` |
| `<achievements>` | `<ul>` with `v-for` | `achievements` |
| `<achievement>` | `<li>` | `achievement` |

**Different templates may use completely different HTML structures** (e.g., Classic template might use `<table>`, Minimal template might use `<div>` only).

### 2.2 Additional Features

#### 2.2.1 File Operations
- **Pre-loaded Sample**: Default cover letter XML loads automatically on app initialization
- **Import XML**: Upload XML file from local filesystem
- **Export HTML**: Download rendered HTML output only (as seen in preview) with embedded CSS

#### 2.2.2 Editor Enhancements
- **Format XML**: Auto-format/prettify XML button
- **Clear Editor**: Clear all content with confirmation

#### 2.2.3 Preview Controls
- **Zoom Control**: Scale preview (75%, 100%, 125%, 150%)

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Initial page load: < 2 seconds
- XML-to-HTML transformation: < 100ms for documents up to 50KB
- Smooth editing experience with no lag

### 3.2 Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

### 3.3 Responsive Design
- Desktop-first approach
- Minimum width: 1024px (tablet landscape)
- Stacked layout on mobile (< 768px): Editor on top, preview below

### 3.4 Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

---

## 4. Design System

### 4.1 Visual Design Principles
- **Minimalist**: Clean, uncluttered interface
- **Professional**: Suitable for business documents
- **Functional**: Focus on content and usability

### 4.2 Color Palette
Based on `sample/styles.css`:
```css
--ink: #111           /* Primary text */
--muted: #555         /* Secondary text */
--accent: #0f6fec     /* Interactive elements */
--background: #fff    /* Main background */
--panel-bg: #fafafa   /* Panel backgrounds */
--border: #e5e5e5     /* Dividers */
```

### 4.3 Typography
```css
--font-body: ui-serif, Georgia, "Times New Roman", serif
--font-ui: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto
--font-mono: ui-monospace, Menlo, Monaco, "Courier New"
```

### 4.4 Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  Header (App Title + Actions)                       │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   XML Editor         │   HTML Preview               │
│   (Monaco Editor)    │   (Vue Template Render)      │
│                      │                              │
│   [Format] [Clear]   │   [Export HTML] [Zoom]       │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

---

## 5. Technical Architecture

### 5.1 Project Structure
```
/pages
  index.vue                        # Main application page
/components
  XmlEditor.vue                    # XML editor component
  PreviewPanel.vue                 # Preview container
  AppHeader.vue                    # App header with actions
/templates
  /modern
    CoverLetterModern.vue          # Modern template (default)
    styles.css                     # Modern-specific styles
  /classic
    CoverLetterClassic.vue         # Classic template
    styles.css                     # Classic-specific styles
  /minimal
    CoverLetterMinimal.vue         # Minimal template
    styles.css                     # Minimal-specific styles
/composables
  useTemplate.ts                   # Template selection config
  useXmlParser.ts                  # XML parsing to data object
  useExport.ts                     # HTML export functionality
/public
  samples/
    cover-letter.xml               # Default XML template
/assets
  styles/
    variables.css                  # Global CSS variables
```

### 5.2 Key Components

#### 5.2.1 XML Editor Component
```typescript
// components/XmlEditor.vue
interface Props {
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'error', error: string | null): void;
}
```

#### 5.2.2 Preview Panel Component
```typescript
// components/PreviewPanel.vue
interface Props {
  xmlContent: string;
  zoom: number;
}
```

#### 5.2.3 Template Components
```vue
<!-- templates/modern/CoverLetterModern.vue -->
<template>
  <article class="application-document">
    <header>
      <h1>{{ applicant.name }}</h1>
      <address v-if="applicant.address">
        {{ applicant.address.street }}, {{ applicant.address.city }},
        {{ applicant.address.state }} {{ applicant.address.zipCode }}
      </address>
      <p class="contact-information">
        <span v-if="applicant.contactInformation?.phone">
          {{ applicant.contactInformation.phone }}
        </span>
        <a v-if="applicant.contactInformation?.email"
           :href="`mailto:${applicant.contactInformation.email}`">
          {{ applicant.contactInformation.email }}
        </a>
      </p>
    </header>

    <main class="letter">
      <p class="salutation">{{ letter.salutation }}</p>
      <p class="introduction">{{ letter.introduction }}</p>

      <section v-if="letter.experienceSection" class="experience-section">
        <p class="experience-employer">
          <strong>{{ letter.experienceSection.experience.employer }}</strong>
        </p>
        <ul class="achievements">
          <li v-for="(achievement, idx) in letter.experienceSection.experience.achievements"
              :key="idx"
              class="achievement">
            {{ achievement }}
          </li>
        </ul>
      </section>

      <p class="motivation">{{ letter.motivation }}</p>
      <p class="closing">{{ letter.closing }}</p>
      <p class="signature">{{ letter.signature }}</p>
    </main>
  </article>
</template>

<script setup lang="ts">
interface Props {
  applicant: {
    name: string;
    address?: { street: string; city: string; state: string; zipCode: string };
    contactInformation?: { phone?: string; email?: string };
  };
  date: string;
  recipient: {
    position: string;
    company: string;
    address?: { street: string; city: string; state: string; zipCode: string };
  };
  letter: {
    salutation: string;
    introduction: string;
    experienceSection?: {
      experience: {
        employer: string;
        achievements: string[];
      };
    };
    motivation: string;
    closing: string;
    signature: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
@import './styles.css';
</style>
```

### 5.3 Template Configuration

```typescript
// composables/useTemplate.ts
import ModernTemplate from '~/templates/modern/CoverLetterModern.vue';
import ClassicTemplate from '~/templates/classic/CoverLetterClassic.vue';
import MinimalTemplate from '~/templates/minimal/CoverLetterMinimal.vue';

// PoC: Developer changes this constant to switch templates
const ACTIVE_TEMPLATE = 'modern';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate
};

export const useTemplate = () => {
  const TemplateComponent = templates[ACTIVE_TEMPLATE];
  const templateName = ACTIVE_TEMPLATE;

  return {
    TemplateComponent,
    templateName
  };
};
```

### 5.4 XML Parser

```typescript
// composables/useXmlParser.ts
export interface ParsedData {
  applicant: {
    name: string;
    address?: { street: string; city: string; state: string; zipCode: string };
    contactInformation?: { phone?: string; email?: string };
  };
  date: string;
  recipient: {
    position: string;
    company: string;
    address?: { street: string; city: string; state: string; zipCode: string };
  };
  letter: {
    salutation: string;
    introduction: string;
    experienceSection?: {
      experience: {
        employer: string;
        achievements: string[];
      };
    };
    motivation: string;
    closing: string;
    signature: string;
  };
}

export const useXmlParser = () => {
  const parseXml = (xmlString: string): ParsedData | null => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML');
      }

      // Extract data from XML
      const getText = (selector: string): string => {
        return xmlDoc.querySelector(selector)?.textContent?.trim() || '';
      };

      const achievements = Array.from(
        xmlDoc.querySelectorAll('achievement')
      ).map(el => el.textContent?.trim() || '');

      return {
        applicant: {
          name: getText('applicant name'),
          address: {
            street: getText('applicant address street'),
            city: getText('applicant address city'),
            state: getText('applicant address state'),
            zipCode: getText('applicant address zipCode')
          },
          contactInformation: {
            phone: getText('applicant contactInformation phone'),
            email: getText('applicant contactInformation email')
          }
        },
        date: getText('date'),
        recipient: {
          position: getText('recipient position'),
          company: getText('recipient company'),
          address: {
            street: getText('recipient address street'),
            city: getText('recipient address city'),
            state: getText('recipient address state'),
            zipCode: getText('recipient address zipCode')
          }
        },
        letter: {
          salutation: getText('letter salutation'),
          introduction: getText('letter introduction'),
          experienceSection: achievements.length > 0 ? {
            experience: {
              employer: getText('experience employer'),
              achievements
            }
          } : undefined,
          motivation: getText('letter motivation'),
          closing: getText('letter closing'),
          signature: getText('letter signature')
        }
      };
    } catch (error) {
      console.error('XML parsing error:', error);
      return null;
    }
  };

  const validateXml = (xmlString: string): { valid: boolean; error?: string } => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      const parserError = xmlDoc.querySelector('parsererror');

      if (parserError) {
        return { valid: false, error: 'Invalid XML syntax' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: (error as Error).message };
    }
  };

  return { parseXml, validateXml };
};
```

### 5.5 HTML Export

```typescript
// composables/useExport.ts
export const useExport = () => {
  const exportHtml = (previewElementId: string, templateName: string) => {
    const previewElement = document.getElementById(previewElementId);
    if (!previewElement) return;

    const htmlContent = previewElement.innerHTML;

    // Get the active template's CSS
    const styleElements = Array.from(document.querySelectorAll('style'))
      .filter(style => style.textContent?.includes('application-document'))
      .map(style => style.textContent)
      .join('\n');

    const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cover Letter</title>
  <style>
${styleElements}
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

    // Download
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${templateName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportHtml };
};
```

### 5.6 State Management
- **Vue Composables**: Use composables for shared logic (template, parser, export)
- **Component State**: Use `ref` and `computed` for reactive state
- **No External Library**: Keep it simple, no Pinia/Vuex for PoC

### 5.7 Data Flow
```
User Types → XmlEditor Component → v-model binding →
Debounced watcher (300ms) → useXmlParser composable →
Parsed Data Object → Template Component (via props) →
Vue renders HTML → PreviewPanel displays
```

---

## 6. User Stories

### 6.1 Core User Stories

**As a user, I want to:**
1. See the sample cover letter XML pre-loaded when I open the app so I can start immediately
2. Edit XML in a syntax-highlighted editor so I can create structured documents easily
3. See real-time HTML preview so I can immediately visualize my changes
4. Export the rendered HTML so I can use it in emails or documents
5. Resize panels so I can focus on editing or preview as needed
6. Receive clear error messages when XML is invalid so I can fix issues quickly

### 6.2 Advanced User Stories

**As a user, I want to:**
7. Import my own XML files so I can edit existing documents
8. Format/prettify my XML so it's easier to read
9. Adjust preview zoom so I can see details or get an overview

**As a developer, I want to:**
10. Add new HTML/CSS templates by creating new Vue components in the codebase
11. Switch templates by changing a configuration constant
12. Have templates use completely different HTML structures while consuming the same XML data

---

## 7. Success Metrics

### 7.1 Key Performance Indicators (KPIs)
- User engagement: Average session duration > 5 minutes
- Feature adoption: 100% of users see pre-loaded sample (default state)
- Error rate: < 5% of transformations result in errors
- Export usage: > 50% of sessions include an export action

### 7.2 User Satisfaction
- Ease of use rating: > 4.5/5
- Performance satisfaction: > 4.5/5
- Visual design rating: > 4/5

---

## 8. Development Phases

### 8.1 Phase 1: MVP (Week 1-2)
- [ ] Nuxt.js project setup with TypeScript
- [ ] Basic dual-panel layout
- [ ] XML editor integration (Monaco via nuxt-monaco-editor)
- [ ] XML parser composable with validation
- [ ] Modern template component (default)
- [ ] Real-time preview rendering with Vue
- [ ] Pre-load sample XML on app initialization
- [ ] Basic styling (based on sample CSS)

### 8.2 Phase 2: Enhancement (Week 3)
- [ ] File import functionality
- [ ] HTML export (rendered output only)
- [ ] Error handling and validation UI
- [ ] XML formatting/prettify
- [ ] Panel resizing
- [ ] Preview zoom controls
- [ ] Add Classic template variant

### 8.3 Phase 3: Polish (Week 4)
- [ ] Add Minimal template variant
- [ ] Responsive design refinements
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Documentation (developer guide for adding templates)
- [ ] Deployment

---

## 9. Future Enhancements (Post-PoC)

### 9.1 Potential Features
- **UI Template Switcher**: Dropdown to switch templates in the UI (no longer code-only)
- **Multi-document support**: Tabs for multiple XML files
- **Custom templates**: User-uploadable Vue templates
- **Version history**: Undo/redo with history panel
- **Export formats**: PDF, DOCX, Markdown
- **AI assistance**: Auto-complete, suggestions

### 9.2 Integration Opportunities
- Cloud storage (Google Drive, Dropbox)
- Template marketplace
- API for programmatic transformations

---

## 10. Constraints and Assumptions

### 10.1 Constraints
- Must be a pure frontend application (no backend)
- Must use Nuxt.js as the framework
- Must work entirely in the browser
- **PoC scope**: Template switching is code-level only (no UI control)

### 10.2 Assumptions
- Users have modern browsers with JavaScript enabled
- Target document size: < 100KB XML files
- Users have basic familiarity with XML structure
- Internet connection required for initial load (CDN resources)
- Developers can edit code to add/switch templates

### 10.3 Out of Scope (PoC)
- Backend database or user authentication
- Complex XML schemas beyond document formatting
- Real-time collaboration
- Mobile app versions
- UI-based template selection
- PDF export (can use browser print)
- User-editable CSS

---

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large XML files cause performance issues | High | Implement virtual scrolling, size warnings |
| Complex XML breaks parser | Medium | Robust error handling, validation |
| Browser compatibility issues | Medium | Polyfills, progressive enhancement |
| User data loss on refresh | High | Auto-save to localStorage |
| Template switching requires code changes | Low | Acceptable for PoC; document clearly for developers |

---

## 12. Appendix

### 12.1 Sample XML Schema Reference
See: `sample/cover-letter.xml`

### 12.2 Sample HTML Output Reference
See: `sample/cover-letter.html`

### 12.3 Sample CSS Reference
See: `sample/styles.css`

### 12.4 Recommended Libraries
- **Framework**: `nuxt` (latest)
- **XML Editor**: `nuxt-monaco-editor`
- **XML Parsing**: Native `DOMParser` API
- **Panel Resizing**: `splitpanes` or native CSS resize

### 12.5 Developer Guide: Adding New Templates

**Step 1**: Create template directory
```bash
mkdir templates/my-template
```

**Step 2**: Create Vue component
```vue
<!-- templates/my-template/CoverLetterMyTemplate.vue -->
<template>
  <!-- Your custom HTML structure -->
</template>

<script setup lang="ts">
defineProps<Props>(); // Use same Props interface
</script>

<style scoped>
@import './styles.css';
</style>
```

**Step 3**: Create styles
```css
/* templates/my-template/styles.css */
/* Your custom CSS */
```

**Step 4**: Register template
```typescript
// composables/useTemplate.ts
import MyTemplate from '~/templates/my-template/CoverLetterMyTemplate.vue';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  mytemplate: MyTemplate // Add here
};

const ACTIVE_TEMPLATE = 'mytemplate'; // Switch here
```

---

## 13. Acceptance Criteria

### 13.1 MVP Launch Criteria
- ✅ User sees pre-loaded sample XML on first visit
- ✅ User can edit XML in left panel with syntax highlighting
- ✅ Preview updates in real-time (< 500ms delay)
- ✅ Invalid XML shows error message
- ✅ HTML export downloads correctly with embedded CSS
- ✅ Developer can switch templates by changing config constant
- ✅ Application works in Chrome, Firefox, Safari
- ✅ Responsive layout works on 1024px+ screens
- ✅ No critical accessibility violations

### 13.2 Quality Gates
- Zero console errors in production
- Lighthouse score: Performance > 90, Accessibility > 95
- All core features tested and working
- Developer documentation for adding templates complete

---

**Document Version**: 2.0
**Last Updated**: 2025-10-10
**Author**: Product Team
**Status**: Updated for Nuxt/Vue PoC → Ready for Development
