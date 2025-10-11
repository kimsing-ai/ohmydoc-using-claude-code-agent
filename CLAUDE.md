# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **ohmydoc-v2**, an XML-to-HTML real-time transformer application built with Nuxt.js. The app provides a dual-panel interface where users can edit XML documents in a Monaco editor (left panel) and see instant HTML preview rendering (right panel). It's designed for document formatting (e.g., cover letters, resumes) with template-based rendering using Vue Single File Components.

**Current Status**: MVP planning complete. Ready to begin MVP 1 implementation.

## Essential Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run postinstall  # Prepare Nuxt (runs automatically after install)
```

### Installation
```bash
npm install          # Install dependencies
```

## Architecture

### Core Technology Stack
- **Framework**: Nuxt 4.1.3 (Vue 3.5.22)
- **Language**: TypeScript 5.9.3
- **UI Components**: @nuxt/ui for application chrome (buttons, inputs, modals, alerts)
- **Styling**: Vue Scoped CSS for document templates (exportable content)
- **XML Parsing**: Native browser DOMParser API
- **Code Editor**: Monaco Editor (via nuxt-monaco-editor)
- **Linting**: ESLint with @nuxt/eslint

### Key Architectural Patterns

#### 1. Styling Separation (@nuxt/ui vs Scoped CSS)
**Critical Design Decision**: Two distinct styling approaches coexist:
- **Application UI**: Uses @nuxt/ui components (AppHeader, XmlEditor wrapper, PreviewPanel wrapper, modals, alerts)
  - Professional, accessible components out-of-the-box
  - NOT included in HTML export
- **Document Templates**: Use scoped CSS only (CoverLetterModern.vue, CoverLetterClassic.vue, etc.)
  - Must be exportable as standalone HTML
  - Each template has own `styles.css` file
  - CSS referenced from `docs/sample/styles.css`

#### 2. Template-Based Rendering System
The application uses Vue SFCs as transformation templates:
- Each template in `/templates/{name}/` is a complete Vue component with its own HTML structure and scoped CSS
- Templates consume the same XML data structure but render completely different HTML outputs
- Template switching is handled at code level via `composables/useTemplate.ts` (PoC limitation)
- CSS is template-specific and swaps entirely when templates change

**Important**: Multiple templates can render the same XML data with completely different semantic HTML (e.g., Modern uses `<article>/<header>`, Classic might use `<table>`, Minimal uses plain `<div>`).

#### 3. Agile MVP Development Approach
Development follows 12 progressive MVPs, each delivering a working, testable component:
- **MVP 1-5**: Foundation (app shell, parser, template, editor, preview components)
- **MVP 6**: Integration (dual-panel main app)
- **MVP 7-9**: Core features (export, editor actions, zoom)
- **MVP 10-11**: Enhancement (panel resize, additional templates)
- **MVP 12**: Production-ready (accessibility, cross-browser)

**See `docs/MVP-PLAN.md` for detailed breakdown of each MVP.**

#### 4. Demo Pages at `/debug/*`
Components are first built and tested in isolation at debug routes:
- `/debug/parser` - XML parser testing (MVP 2)
- `/debug/template` - Template rendering showcase (MVP 3)
- `/debug/editor` - Monaco editor testing (MVP 4)
- `/debug/preview` - Preview panel with error handling (MVP 5)

These demo pages remain in production as live documentation.

#### 5. Data Flow Architecture
```
User Input → XmlEditor Component → v-model binding →
Debounced watcher (300ms) → useXmlParser composable →
Parsed Data Object → Template Component (props) →
Vue renders → PreviewPanel displays
```

#### 6. Composables Pattern
The app uses Vue composables for shared logic (no Pinia/Vuex):
- `useTemplate.ts`: Template configuration and selection
- `useXmlParser.ts`: XML parsing and validation using DOMParser
- `useExport.ts`: HTML export with embedded CSS

### Project Structure

```
/pages
  index.vue                    # Main application page (MVP 6)
  /debug
    parser.vue                 # XML parser demo (MVP 2)
    template.vue               # Template renderer demo (MVP 3)
    editor.vue                 # Editor component demo (MVP 4)
    preview.vue                # Preview panel demo (MVP 5)
/components
  XmlEditor.vue                # Monaco editor wrapper (@nuxt/ui + Monaco)
  PreviewPanel.vue             # Preview container (@nuxt/ui wrapper)
  AppHeader.vue                # Header with action buttons (@nuxt/ui)
/templates
  /modern
    CoverLetterModern.vue      # Modern template (default, scoped CSS)
    styles.css                 # Modern-specific styles
  /classic
    CoverLetterClassic.vue     # Classic template (scoped CSS)
    styles.css                 # Classic-specific styles
  /minimal
    CoverLetterMinimal.vue     # Minimal template (scoped CSS)
    styles.css                 # Minimal-specific styles
/composables
  useTemplate.ts               # Template selection config
  useXmlParser.ts              # XML→Object parser
  useExport.ts                 # HTML export logic
/public
  samples/
    cover-letter.xml           # Default sample (copied from docs/sample/)
/docs
  PRD.md                       # Complete product requirements (v3.0)
  MVP-PLAN.md                  # 12 MVP breakdown with acceptance criteria
  DECISIONS.md                 # Architectural decisions and rationale
  sample/
    cover-letter.xml           # Reference XML structure
    styles.css                 # Reference CSS for templates
```

### XML Data Schema

The application expects this XML structure:
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

The parser in `useXmlParser.ts` transforms this into a typed JavaScript object that templates consume via props.

## Adding New Templates

To add a new template (e.g., "elegant"):

1. Create directory: `templates/elegant/`
2. Create `CoverLetterElegant.vue` with same Props interface as existing templates
3. Create `styles.css` with template-specific styling
4. Import and register in `composables/useTemplate.ts`:
   ```typescript
   import ElegantTemplate from '~/templates/elegant/CoverLetterElegant.vue';

   const templates = {
     modern: ModernTemplate,
     classic: ClassicTemplate,
     elegant: ElegantTemplate
   };

   const ACTIVE_TEMPLATE = 'elegant';  // Switch here
   ```

Templates must accept Props interface matching the parsed XML data structure (see PRD.md section 5.2.3).

## Styling Strategy

### Application UI (@nuxt/ui)
Use @nuxt/ui components for all application chrome:
- Buttons, inputs, modals, alerts, dropdowns
- AppHeader, navigation elements
- Error messages, loading states
- **Never use @nuxt/ui inside template components**

### Document Templates (Scoped CSS)
Each template defines its own styling:
- Reference: `docs/sample/styles.css`
- Color palette: `--ink: #111`, `--muted: #555`, `--accent: #0f6fec`
- Typography: `--font-body: ui-serif, Georgia, serif`
- Templates must be exportable as standalone HTML (no @nuxt/ui dependency)

## Development Workflow

### When Implementing MVPs
1. **Read the MVP plan first**: Check `docs/MVP-PLAN.md` for the specific MVP you're implementing
2. **Check acceptance criteria**: Each MVP has clear acceptance criteria that must be met
3. **Build demo pages first** (MVP 2-5): Components are built in `/debug/*` pages before integration
4. **Test in isolation**: Demo pages allow testing components independently
5. **Follow the sequence**: MVPs have dependencies (see dependency diagram in MVP-PLAN.md)
6. **Mark as complete**: Only mark MVP complete when all acceptance criteria pass

### Key Development Principles
- **Agile**: Each MVP delivers a working, usable feature
- **Component Reusability**: Demo components are reused in main app
- **No global state**: Use composables and component-level state (ref, computed)
- **Accessibility first**: WCAG 2.1 Level AA from day one
- **@nuxt/ui for UI**: Don't build buttons/inputs from scratch

## Development Notes

- This is a **Proof of Concept** - template switching is code-level only (no UI switcher)
- App is pure frontend, no backend required
- Default sample XML loads automatically from `public/samples/cover-letter.xml`
- Debouncing (300ms) optimizes real-time preview performance
- HTML export includes only template CSS (no @nuxt/ui styles)
- Target document size: < 100KB XML files
- Minimum supported viewport: 1024px (desktop-first)
- Demo pages at `/debug/*` remain in production as documentation

## Important Files

**Must Read Before Starting**:
- `docs/MVP-PLAN.md` - 12 MVP breakdown with acceptance criteria (start here!)
- `docs/DECISIONS.md` - Architectural decisions and rationale (understand the "why")
- `docs/PRD.md` - Complete product requirements (v3.0, updated for MVP approach)

**Reference**:
- `docs/sample/cover-letter.xml` - Reference XML structure
- `docs/sample/styles.css` - Reference CSS for templates
- `public/samples/cover-letter.xml` - Sample loaded by app (copied from docs/sample/)

**Configuration**:
- `nuxt.config.ts` - Nuxt configuration (modules: @nuxt/eslint, @nuxt/ui)
- `tsconfig.json` - TypeScript project references for Nuxt

## Constraints

- Must be pure frontend (browser-only)
- XML structure is standardized (no `formatStyle` attribute)
- No backend, authentication, or database
- Browser support: Chrome/Edge/Firefox/Safari (latest 2 versions)
- Performance target: < 100ms transformation for documents up to 50KB
