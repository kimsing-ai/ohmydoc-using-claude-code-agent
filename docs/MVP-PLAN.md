# MVP Development Plan

**Project**: ohmydoc-v2 - XML-to-HTML Real-Time Transformer
**Date**: 2025-10-11
**Version**: 1.0
**Status**: Approved

## Overview

This document outlines the agile MVP breakdown for developing the XML-to-HTML transformer application. Each MVP delivers a working, testable, and usable component that builds progressively toward the complete application.

## Development Principles

1. **Agile**: Each MVP is independently usable and testable
2. **Progressive**: Later MVPs build on earlier ones using reusable components
3. **Demo-Driven**: Debug pages at `/debug/*` demonstrate component capabilities
4. **Functionality First**: Focus on working features before optimization
5. **Component Reusability**: Components built in demo pages are reused in main app

## MVP Breakdown

---

### MVP 1: Basic App Shell

**Goal**: Foundation with header and routing ready

**What to Build**:
- Basic app layout structure (app.vue or pages structure)
- `components/AppHeader.vue` using @nuxt/ui components (UContainer, title text)
- Initially: just app title, empty action slots for future buttons
- Verify routing works (can navigate to `/debug/parser`)

**Deliverable**:
- App loads with header displaying app title
- Navigation to `/debug/*` pages works
- @nuxt/ui styling applied

**Reusable Components**:
- `AppHeader.vue` - will be expanded in later MVPs with action buttons

**Acceptance Criteria**:
- [ ] App loads without errors
- [ ] AppHeader displays with app title
- [ ] Can navigate to `/debug/parser` (even if page is empty)
- [ ] @nuxt/ui components render correctly

---

### MVP 2: XML Parser with Interactive Demo

**Goal**: Working, testable XML parser composable

**What to Build**:
- `composables/useXmlParser.ts` with full TypeScript interfaces
  - `ParsedData` interface matching XML schema
  - `parseXml(xmlString)` function
  - `validateXml(xmlString)` function
- Create page: `pages/debug/parser.vue`
  - Textarea for XML input (use @nuxt/ui `UTextarea`)
  - Button to trigger parse (use @nuxt/ui `UButton`)
  - Display parsed JSON output (formatted)
  - Display validation errors using @nuxt/ui `UAlert`
- Load sample XML from `/public/samples/cover-letter.xml` on mount

**Deliverable**:
- Visit `/debug/parser`
- Paste/edit XML in textarea
- Click parse button → see structured JSON output
- Invalid XML shows clear error message

**Reusable Components**:
- `composables/useXmlParser.ts` - used by all preview/rendering MVPs

**Acceptance Criteria**:
- [ ] Parser extracts all fields from sample XML correctly
- [ ] Invalid XML returns validation error
- [ ] Demo page displays parsed data in readable format
- [ ] No console errors

---

### MVP 3: Template System with Static Renderer

**Goal**: First template rendering with hardcoded data

**What to Build**:
- `composables/useTemplate.ts` with template selection logic
- `templates/modern/CoverLetterModern.vue`
  - Full template structure per PRD section 5.2.3
  - Props interface for parsed data
- `templates/modern/styles.css`
  - Complete styling with color palette from PRD section 4.2
  - Typography from PRD section 4.3
- Create page: `pages/debug/template.vue`
  - Hardcoded sample data object (matching ParsedData interface)
  - Render Modern template with data
  - Display rendered output

**Deliverable**:
- Visit `/debug/template`
- See beautifully rendered cover letter with proper styling
- Template uses scoped CSS (no @nuxt/ui in template)

**Reusable Components**:
- `templates/modern/CoverLetterModern.vue` - the actual template
- `composables/useTemplate.ts` - template selection logic

**Acceptance Criteria**:
- [ ] Template renders all sections of cover letter
- [ ] Styling matches design system (colors, typography)
- [ ] Scoped CSS only (no @nuxt/ui dependency in template)
- [ ] Template accepts props matching ParsedData interface

---

### MVP 4: XML Editor Component

**Goal**: Monaco editor ready for integration

**What to Build**:
- Install `nuxt-monaco-editor` dependency
- Configure Monaco in `nuxt.config.ts`
- `components/XmlEditor.vue`
  - Monaco editor wrapper with XML language
  - v-model support for two-way binding
  - Props: `modelValue: string`
  - Emits: `update:modelValue`, `error`
  - Editor configuration: line numbers, auto-indent, syntax highlighting
- Create page: `pages/debug/editor.vue`
  - Display XmlEditor component
  - Load sample XML on mount
  - Show current content length below editor
  - Use @nuxt/ui for page layout

**Deliverable**:
- Visit `/debug/editor`
- Working XML editor with syntax highlighting
- Can type and edit XML
- Line numbers visible

**Reusable Components**:
- `components/XmlEditor.vue` - used in main app (MVP 6)

**Acceptance Criteria**:
- [ ] Monaco editor loads without errors
- [ ] XML syntax highlighting works
- [ ] Can type and edit content
- [ ] v-model binding works (content updates reactively)
- [ ] Line numbers and auto-indentation enabled

---

### MVP 5: Preview Panel Component

**Goal**: Preview container with XML parsing and error handling

**What to Build**:
- `components/PreviewPanel.vue`
  - Props: `xmlContent: string`, `zoom: number` (default 1)
  - Uses `useXmlParser` to parse XML
  - Uses `useTemplate` to get template component
  - Renders template with parsed data
  - Shows error UI for invalid XML (using @nuxt/ui `UAlert`)
  - Applies zoom transform to preview content
- Create page: `pages/debug/preview.vue`
  - Dropdown to select sample XMLs (valid, invalid, edge cases)
  - Display PreviewPanel
  - Show parse status (success/error)
  - Use @nuxt/ui for page layout and controls

**Deliverable**:
- Visit `/debug/preview`
- Select different XML samples from dropdown
- See preview update with rendered template
- Invalid XML shows friendly error message

**Reusable Components**:
- `components/PreviewPanel.vue` - used in main app (MVP 6)

**Acceptance Criteria**:
- [ ] Preview renders template correctly with valid XML
- [ ] Invalid XML displays error message (not crash)
- [ ] Zoom prop works (scales preview)
- [ ] Component handles edge cases (empty XML, missing fields)
- [ ] Error messages are user-friendly

---

### MVP 6: Dual-Panel Integration with Real-Time Updates

**Goal**: Main application - editor and preview working together

**What to Build**:
- Main page: `pages/index.vue`
  - Dual-panel layout using CSS Grid or Flexbox
  - Left panel: `XmlEditor` component
  - Right panel: `PreviewPanel` component
  - Wire v-model from editor to preview with 300ms debounce
  - Load sample XML from `/public/samples/cover-letter.xml` on mount
  - Use @nuxt/ui for layout structure
- Update `AppHeader.vue`
  - Add app title and tagline
  - Empty action button slots (filled in MVP 7-9)

**Deliverable**:
- Visit `/` (root page)
- Edit XML in left panel → see preview update on right (300ms delay)
- Sample XML pre-loaded
- Full editing experience

**Reusable Components**:
- Main app page using all previous components

**Acceptance Criteria**:
- [ ] Dual-panel layout displays correctly (50/50 split)
- [ ] Sample XML loads automatically
- [ ] Typing in editor updates preview (with 300ms debounce)
- [ ] Invalid XML shows error in preview panel
- [ ] No layout shift or flicker during updates
- [ ] Responsive layout works (minimum 1024px width)

---

### MVP 7: HTML Export

**Goal**: Download rendered HTML as standalone file

**What to Build**:
- `composables/useExport.ts`
  - `exportHtml(previewElementId, templateName)` function
  - Extract rendered HTML from preview
  - Extract scoped CSS from template (not @nuxt/ui styles)
  - Generate standalone HTML document with embedded CSS
  - Trigger download with proper filename
- Update `AppHeader.vue`
  - Add "Export HTML" button (right side) using @nuxt/ui `UButton`
  - Wire to export function
- Update `pages/index.vue`
  - Add ref to preview element
  - Connect export button to useExport composable

**Deliverable**:
- Click "Export HTML" button in header
- Download `cover-letter-modern.html` file
- Open file in browser → see standalone rendered document

**Reusable Components**:
- `composables/useExport.ts` - export logic

**Acceptance Criteria**:
- [ ] Export button appears in header
- [ ] Clicking button downloads HTML file
- [ ] Downloaded HTML opens in browser correctly
- [ ] CSS is embedded (no external dependencies)
- [ ] HTML is properly formatted and valid
- [ ] Only template CSS included (no @nuxt/ui styles)

---

### MVP 8: Editor Actions (Format, Clear, Import)

**Goal**: Complete editor toolbar functionality

**What to Build**:
- **Format XML**:
  - Add "Format" button in AppHeader (left side actions)
  - Implement XML prettify/auto-indent logic
  - Update editor content with formatted XML
- **Clear Editor**:
  - Add "Clear" button in AppHeader (left side actions)
  - Show confirmation modal using @nuxt/ui `UModal`
  - Clear editor content on confirm
- **Import XML**:
  - Add "Import" button in AppHeader (left side actions)
  - File picker for XML files using @nuxt/ui `UInput` type="file"
  - Load file content into editor
  - Validate file type (.xml)

**Deliverable**:
- Format button: click → XML auto-indents and prettifies
- Clear button: click → confirmation dialog → clear on confirm
- Import button: click → file picker → load XML file into editor

**Reusable Components**:
- File handling patterns
- Confirmation modal pattern

**Acceptance Criteria**:
- [ ] Format button prettifies XML correctly
- [ ] Clear button shows confirmation before clearing
- [ ] Import button opens file picker
- [ ] Only .xml files accepted for import
- [ ] Imported file loads into editor correctly
- [ ] All buttons use @nuxt/ui components
- [ ] Error handling for invalid files

---

### MVP 9: Preview Zoom Controls

**Goal**: Zoom functionality for preview panel

**What to Build**:
- Update `AppHeader.vue`
  - Add zoom controls (right side with export button)
  - Zoom levels: 75%, 100%, 125%, 150%
  - Use @nuxt/ui button group or dropdown
- Update `pages/index.vue`
  - Add zoom state (ref)
  - Pass zoom to PreviewPanel component
- Optional: Persist zoom level to localStorage

**Deliverable**:
- Zoom buttons in header
- Click zoom level → preview scales accordingly
- Current zoom level highlighted

**Reusable Components**:
- Zoom control pattern

**Acceptance Criteria**:
- [ ] Zoom controls appear in header (right side)
- [ ] Clicking zoom level scales preview immediately
- [ ] All zoom levels work (75%, 100%, 125%, 150%)
- [ ] Current zoom level visually indicated
- [ ] Preview content scales without layout break
- [ ] Optional: Zoom persists across page reloads

---

### MVP 10: Panel Resizing

**Goal**: Draggable divider between editor and preview

**What to Build**:
- Option A: Use `splitpanes` npm package
- Option B: Custom CSS resize with drag handle
- Update `pages/index.vue`
  - Add resizable split between editor and preview
  - Drag divider to adjust widths
  - Minimum widths enforced (e.g., 30% each)
- Optional: Persist panel sizes to localStorage

**Deliverable**:
- Drag divider between panels
- Editor and preview resize smoothly
- Layout doesn't break during resize

**Reusable Components**:
- Resizable layout pattern

**Acceptance Criteria**:
- [ ] Divider is visible and draggable
- [ ] Dragging resizes both panels
- [ ] Minimum widths enforced
- [ ] Monaco editor resizes correctly
- [ ] Preview content reflows properly
- [ ] Optional: Sizes persist across reloads

---

### MVP 11: Additional Templates (Classic & Minimal)

**Goal**: Demonstrate template extensibility

**What to Build**:
- `templates/classic/CoverLetterClassic.vue`
  - Different HTML structure (e.g., table-based layout)
  - `templates/classic/styles.css`
- `templates/minimal/CoverLetterMinimal.vue`
  - Minimal HTML structure (plain divs)
  - `templates/minimal/styles.css`
- Update `composables/useTemplate.ts`
  - Import and register new templates
  - Document how to change `ACTIVE_TEMPLATE` constant
- Update `/debug/template` page
  - Dropdown to switch between templates
  - Show all three rendering side-by-side or with switcher

**Deliverable**:
- Three templates available (Modern, Classic, Minimal)
- Change constant in `useTemplate.ts` → different template renders
- `/debug/template` page shows all templates

**Reusable Components**:
- Classic and Minimal template components
- Template switching pattern

**Acceptance Criteria**:
- [ ] Classic template renders with different HTML structure
- [ ] Minimal template renders with simpler structure
- [ ] All templates use same Props interface
- [ ] Changing `ACTIVE_TEMPLATE` switches template in main app
- [ ] Each template has own scoped CSS
- [ ] `/debug/template` page demonstrates all templates
- [ ] Documentation updated for template switching

---

### MVP 12: Accessibility & Cross-Browser Polish

**Goal**: Production-ready, WCAG AA compliant application

**What to Build**:
- **Keyboard Navigation**:
  - Tab order logical (header → editor → preview)
  - Keyboard shortcuts (e.g., Ctrl+S to export)
  - Focus management (visible focus indicators)
- **ARIA Labels**:
  - Add aria-label to buttons
  - Add aria-live to error messages
  - Screen reader announcements for preview updates
- **Color Contrast**:
  - Verify all text meets WCAG AA contrast ratio
  - Adjust colors if needed
- **Cross-Browser Testing**:
  - Test on Chrome, Firefox, Safari
  - Fix browser-specific issues
  - Add polyfills if needed
- **Performance**:
  - Lazy load Monaco if needed
  - Code splitting for debug pages
  - Optimize bundle size

**Deliverable**:
- Passes WCAG AA accessibility audit
- Works smoothly on Chrome, Firefox, Safari
- Keyboard navigation fully functional
- Screen reader compatible

**Reusable Components**:
- Accessibility patterns for future features

**Acceptance Criteria**:
- [ ] Keyboard navigation works (tab order, shortcuts)
- [ ] All interactive elements have aria-labels
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader can navigate and use app
- [ ] No console errors in any browser
- [ ] App works on Chrome, Firefox, Safari (latest 2 versions)
- [ ] Lighthouse accessibility score > 95
- [ ] Performance optimized (load time < 2s)

---

## MVP Dependencies

```
MVP 1 (App Shell)
  ↓
MVP 2 (Parser) → MVP 5 (Preview Panel)
  ↓                 ↓
MVP 3 (Template) →  ↓
  ↓                 ↓
MVP 4 (Editor) →    ↓
                    ↓
                MVP 6 (Integration)
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    MVP 7       MVP 8       MVP 9
    (Export)    (Actions)   (Zoom)
        └───────────┼───────────┘
                    ↓
                MVP 10 (Resize)
                    ↓
                MVP 11 (Templates)
                    ↓
                MVP 12 (Polish)
```

## Testing Strategy

Each MVP must be tested before proceeding to the next:

1. **Manual Testing**: Developer tests all acceptance criteria
2. **Browser Testing**: Verify in Chrome (primary), Firefox, Safari
3. **Functionality**: All features work as specified
4. **No Regressions**: Previous MVP features still work
5. **Clean Console**: No errors or warnings in browser console

## Deployment Notes

- Demo pages (`/debug/*`) remain in production as documentation/testing tools
- Main app is at root path `/`
- All pages should work without additional configuration
- Static site generation compatible (Nuxt generate)

## Success Criteria

The MVP plan is complete when:
- ✅ All 12 MVPs delivered and tested
- ✅ Main app works end-to-end (edit XML → see preview → export)
- ✅ All PRD acceptance criteria met (section 13.1)
- ✅ WCAG AA compliant
- ✅ Works on all supported browsers
- ✅ Demo pages document component capabilities

---

**Next Steps**: Begin MVP 1 implementation after PRD updates are complete.
