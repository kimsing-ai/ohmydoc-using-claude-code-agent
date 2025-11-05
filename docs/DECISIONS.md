# Architectural Decisions & Key Concepts

**Project**: ohmydoc-v2
**Date**: 2025-10-11
**Version**: 1.0

## Overview

This document captures the key architectural decisions, rationale, and concepts that shaped the MVP plan for the XML-to-HTML transformer application. Future developers and AI agents should reference this to understand the "why" behind the structure.

---

## Decision 1: Agile MVP Approach

### Decision
Break down development into 12 progressive MVPs, each delivering a working, testable component.

### Rationale
- **Agile Principle**: Each MVP is independently usable, not just a partial feature
- **Risk Mitigation**: Catch issues early with incremental testing
- **Flexibility**: Can adjust priorities or pivot based on learnings from each MVP
- **Demonstrable Progress**: Stakeholders see working features at each stage
- **AI Agent Friendly**: Each MVP has clear, bounded scope for autonomous execution

### Alternatives Considered
- **Waterfall**: Build all components, then integrate → Rejected: High risk of integration issues
- **Feature-based**: Group by features (editor, preview, export) → Rejected: Less granular, harder to test incrementally

### Impact
- Development follows MVP-PLAN.md sequence (MVP 1 → MVP 12)
- Each MVP must pass acceptance criteria before proceeding
- Demo pages at `/debug/*` demonstrate component capabilities

---

## Decision 2: Use @nuxt/ui for Application Chrome

### Decision
Use @nuxt/ui component library for all application UI (buttons, inputs, modals, headers, alerts), but NOT for document template content.

### Rationale
- **Efficiency**: @nuxt/ui provides professional, accessible components out-of-the-box
- **Consistency**: Unified design language across app interface
- **Accessibility**: Components are WCAG compliant by default
- **Maintenance**: Reduce custom CSS/component development
- **Time Savings**: Focus on business logic, not reinventing UI components

### Separation of Concerns
```
Application UI (@nuxt/ui):
- AppHeader (UButton, UContainer)
- XmlEditor wrapper (UTextarea, UButton for controls)
- PreviewPanel wrapper (UAlert for errors)
- Modals, file inputs, dropdowns

Template Content (Scoped CSS):
- CoverLetterModern.vue
- CoverLetterClassic.vue
- CoverLetterMinimal.vue
- Must be exportable as standalone HTML
```

### Alternatives Considered
- **Global CSS Variables**: Create custom design system → Rejected: Premature optimization (YAGNI)
- **Pure Scoped CSS**: Build all UI components from scratch → Rejected: Time-consuming, accessibility burden
- **Tailwind CSS**: Utility-first approach → Rejected: @nuxt/ui already installed, more cohesive

### Impact
- Faster MVP development (pre-built components)
- Consistent, accessible UI without custom work
- Templates remain independent (scoped CSS only)
- HTML export excludes @nuxt/ui styles (only template CSS)

---

## Decision 3: Demo Pages at `/debug/*`

### Decision
Build demo pages for each major component (parser, template, editor, preview) at `/debug/*` routes during MVP 2-5.

### Rationale
- **Component Testing**: Each component can be tested in isolation
- **Reusability**: Components built for demos are reused in main app (MVP 6)
- **Documentation**: Demo pages serve as live documentation for component capabilities
- **Debugging**: Easier to troubleshoot issues in isolated environment
- **Future Reference**: Developers can see component behavior without digging through main app

### Demo Page Purpose
| Page | Purpose | MVP |
|------|---------|-----|
| `/debug/parser` | Test XML parsing and validation | MVP 2 |
| `/debug/template` | View template rendering (all variants) | MVP 3 |
| `/debug/editor` | Test Monaco editor integration | MVP 4 |
| `/debug/preview` | Test preview with error handling | MVP 5 |

### Alternatives Considered
- **Delete demos after integration**: → Rejected: Lose valuable testing/documentation
- **Build in main app directly**: → Rejected: Harder to test, less reusable
- **Use Storybook**: → Rejected: Overkill for PoC, adds complexity

### Impact
- Demo pages remain in production as documentation
- Components are built with reusability in mind from day one
- Easier onboarding for new developers (see working examples)

---

## Decision 4: Template System Architecture

### Decision
Use Vue Single File Components (SFCs) as transformation templates, where each template:
- Defines its own HTML structure
- Includes its own scoped CSS file (`styles.css`)
- Accepts same Props interface (ParsedData)
- Can render completely different HTML from same XML data

### Rationale
- **Flexibility**: Templates can use different semantic HTML (`<article>` vs `<table>` vs `<div>`)
- **Encapsulation**: Each template is self-contained (component + styles)
- **Vue Native**: Leverages Vue's component model and scoped CSS
- **Exportability**: Scoped CSS can be extracted for standalone HTML export
- **Extensibility**: Developers add templates by creating new .vue files and registering them

### Template Switching (PoC)
Code-level only: Change `ACTIVE_TEMPLATE` constant in `composables/useTemplate.ts`

```typescript
const ACTIVE_TEMPLATE = 'modern'; // Change to 'classic' or 'minimal'
```

### Why Not UI-Based Switching?
- **PoC Scope**: Template selection via UI is post-PoC enhancement
- **Simplicity**: Reduces complexity for initial implementation
- **Focus**: Prioritize core editing/preview/export workflow

### Alternatives Considered
- **String templates**: Use template literals → Rejected: No Vue reactivity, hard to style
- **XSLT**: XML transformation standard → Rejected: Steep learning curve, less maintainable
- **Single template with CSS classes**: → Rejected: HTML structure would be fixed

### Impact
- Modern, Classic, Minimal templates have completely different HTML structures
- Each template directory contains `.vue` + `styles.css`
- Export logic must extract template CSS only (not @nuxt/ui)
- Future: Can add UI dropdown for template selection

---

## Decision 5: Debounced Real-Time Updates (300ms)

### Decision
Implement 300ms debounce between XML editor changes and preview updates.

### Rationale
- **Performance**: Avoid re-parsing and re-rendering on every keystroke
- **Smooth UX**: No lag or flicker during typing
- **Reasonable Delay**: 300ms feels instant to users (< 500ms threshold)
- **Resource Efficient**: Reduces unnecessary computations

### Alternatives Considered
- **No Debounce**: Update immediately → Rejected: Performance concerns for large XML
- **500ms Debounce**: → Rejected: Feels sluggish
- **Throttle Instead**: → Rejected: Debounce better for "wait until user stops typing"

### Impact
- User types → waits 300ms → preview updates
- Meets PRD requirement of < 500ms update delay
- Smooth editing experience without lag

---

## Decision 6: Native DOMParser for XML Parsing

### Decision
Use browser's native `DOMParser` API instead of external XML parsing library.

### Rationale
- **Zero Dependencies**: No npm package needed
- **Browser Native**: Fast, reliable, well-supported
- **Simple XML Structure**: Cover letter schema is straightforward
- **Error Handling**: DOMParser provides `parsererror` for invalid XML
- **Bundle Size**: No additional KB added to bundle

### Limitations
- Not suitable for complex XML schemas (namespaces, DTD validation)
- Limited XPath support (can use querySelector instead)

### Alternatives Considered
- **xml2js**: Popular npm library → Rejected: Unnecessary dependency for simple XML
- **fast-xml-parser**: → Rejected: Overkill for PoC
- **XSLT Processor**: → Rejected: Too complex, not Vue-friendly

### Impact
- Lightweight, fast parsing
- `useXmlParser.ts` composable wraps DOMParser logic
- Validation via `parsererror` check
- If future requirements need advanced XML features, can swap parser implementation

---

## Decision 7: Component State Management (No Pinia/Vuex)

### Decision
Use Vue composables and component-level state (`ref`, `computed`) instead of global state management library.

### Rationale
- **Simplicity**: PoC doesn't require complex state management
- **Composables Pattern**: Sufficient for shared logic (parser, template, export)
- **Avoid Overhead**: Pinia/Vuex adds learning curve and boilerplate
- **Performance**: Less abstraction, faster development

### When to Use Each
- **Composables**: Shared logic (useXmlParser, useTemplate, useExport)
- **Component State**: Local reactive data (editor content, zoom level, panel sizes)
- **Props/Emits**: Parent-child communication (v-model binding)

### Alternatives Considered
- **Pinia**: Modern Vue state management → Rejected: Overkill for PoC
- **Vuex**: Legacy state management → Rejected: Deprecated, unnecessary
- **Context/Provide-Inject**: → Rejected: Composables cleaner for this use case

### Impact
- Faster development (less boilerplate)
- Easier to understand for new developers
- If app grows complex, can migrate to Pinia later

---

## Decision 8: Monaco Editor via nuxt-monaco-editor

### Decision
Use `nuxt-monaco-editor` npm package to integrate Monaco Editor for XML editing.

### Rationale
- **Rich Editing**: Monaco is the editor powering VS Code
- **XML Support**: Built-in XML syntax highlighting, validation
- **Nuxt Integration**: `nuxt-monaco-editor` provides Nuxt-specific wrapper
- **Features**: Line numbers, auto-indent, IntelliSense out-of-the-box
- **User Expectation**: Professional editor experience

### Alternatives Considered
- **CodeMirror**: Alternative code editor → Rejected: Monaco more feature-rich
- **Plain Textarea**: → Rejected: Poor UX for XML editing
- **Ace Editor**: → Rejected: Monaco more modern, better maintained

### Impact
- Install `nuxt-monaco-editor` dependency
- Configure in `nuxt.config.ts`
- Wrap in `XmlEditor.vue` component with v-model support

---

## Decision 9: HTML Export Strategy

### Decision
Export rendered HTML with embedded template CSS only (exclude @nuxt/ui styles).

### Rationale
- **Standalone Files**: Exported HTML opens correctly in any browser
- **Portability**: No external dependencies (CDN, @nuxt/ui)
- **User Expectation**: Exported file should be self-contained
- **Template Scoped CSS**: Only document styling included, not app chrome

### Export Logic
1. Get rendered HTML from preview element
2. Extract `<style>` tags containing template CSS (filter by class like `application-document`)
3. Generate `<!doctype html>` with embedded styles
4. Trigger download as `.html` file

### Alternatives Considered
- **Export with @nuxt/ui**: → Rejected: Unnecessary bloat, styling not relevant to document
- **Export CSS as separate file**: → Rejected: Less portable (two files)
- **PDF Export**: → Rejected: Out of scope for PoC (use browser print instead)

### Impact
- `useExport.ts` composable handles extraction logic
- Exported HTML is standalone (no external dependencies)
- File size optimized (only template styles)

---

## Decision 10: Panel Resizing Implementation

### Decision
Use `splitpanes` npm package for resizable dual-panel layout (or fallback to native CSS resize).

### Rationale
- **UX**: Users can adjust editor/preview widths to their preference
- **Productivity**: Some users prefer larger editor, others larger preview
- **Proven Solution**: `splitpanes` is battle-tested for Vue
- **Optional Persistence**: Can save sizes to localStorage

### Alternatives Considered
- **Native CSS `resize` property**: → Less smooth UX, limited control
- **Custom drag implementation**: → Rejected: Reinventing wheel, time-consuming
- **Fixed 50/50 split**: → Rejected: Less flexible for users

### Impact
- Install `splitpanes` or implement custom (decided in MVP 10)
- Minimum widths enforced (e.g., 30% each panel)
- Monaco editor resizes correctly with panel

---

## Decision 11: Accessibility First (WCAG AA)

### Decision
Target WCAG 2.1 Level AA compliance from day one, with dedicated MVP 12 for accessibility polish.

### Rationale
- **Inclusive Design**: Application usable by everyone
- **PRD Requirement**: Explicitly required in section 3.4
- **@nuxt/ui Advantage**: Components are accessible by default
- **Legal/Ethical**: Accessibility is standard best practice
- **Lighthouse Goal**: Accessibility score > 95

### Focus Areas
- Keyboard navigation (tab order, shortcuts)
- ARIA labels (buttons, form controls)
- Color contrast (text readability)
- Screen reader support
- Focus indicators

### Alternatives Considered
- **Accessibility as afterthought**: → Rejected: Harder to retrofit, lower quality
- **WCAG AAA**: Higher standard → Rejected: AA sufficient for PoC

### Impact
- Use semantic HTML throughout
- Leverage @nuxt/ui accessible components
- MVP 12 dedicated to testing and fixes
- Lighthouse accessibility audit required

---

## Decision 12: CSS Import Strategy for Template Components

### Decision
Import CSS files in the `<script>` section combined with an empty `<style scoped>` block for template components.

### Rationale
- **Production Build Issue**: Using `@import` inside `<style scoped>` blocks does NOT work reliably in Vite production builds
- **Vercel Deployment Issue**: The `src` attribute approach also failed in Vercel production deployments
- **Root Cause**: Both `@import` and `src` attribute have path resolution issues in certain deployment environments
- **Script Import Solution**: Importing CSS as a module in the script section ensures reliable bundling across all platforms
- **Maintains Architecture**: Keeps both requirements intact:
  - ✅ CSS separation (separate `styles.css` file per PRD)
  - ✅ Scoped styles (empty `<style scoped>` block applies Vue's scoping mechanism)

### Problem This Solves
**Issue #19**: Template styles were not applied in production deployment (plain unstyled HTML), particularly on Vercel.

Failed attempts:
1. **Inline CSS in `<style scoped>`**: Violated PRD requirement for CSS separation
2. **Remove `scoped` attribute**: Violated architecture requirement for scoped template styles, introduced global CSS pollution risk
3. **`src` attribute**: `<style scoped src="./styles.css">` - Failed in Vercel production despite working locally
4. **`@import` statement**: `@import './styles.css'` - Did not work in production builds

### Implementation Pattern
```vue
<!-- ❌ WRONG: Does not work in production builds -->
<style scoped>
@import './styles.css';
</style>

<!-- ❌ WRONG: Failed in Vercel production -->
<style scoped src="./styles.css"></style>

<!-- ✅ CORRECT: Works across all platforms -->
<script setup>
import './styles.css'  // Import CSS as module
</script>

<style scoped>
/* Empty block applies Vue's scoping mechanism */
</style>
```

### Technical Details
- **Module Import**: CSS imported in script section is processed by Vite's module bundler
- **Build Process**: Vite includes the CSS in the component chunk during build
- **Scoping Mechanism**: Empty `<style scoped>` block ensures Vue adds unique data attributes (e.g., `data-v-7a9c3b2f`) to all template elements
- **Bundle Output**: CSS is reliably included and loaded with the component across all deployment platforms
- **Platform Compatibility**: Works consistently in local dev, local production preview, and Vercel deployments

### Alternatives Considered
1. **Inline CSS**: Copy all CSS into `<style scoped>` block
   - ❌ Makes component files very large (200+ lines)
   - ❌ Violates PRD requirement for CSS separation
   - ❌ User explicitly rejected this approach

2. **Pure script import without scoped block**: `import './styles.css'` only
   - ❌ Results in global CSS (not scoped)
   - ❌ Risk of style leakage to other components
   - ❌ Violates architecture requirement for scoped template styles

3. **Remove scoped attribute**: `<style>` with `@import`
   - ❌ Global styles can pollute @nuxt/ui components
   - ❌ Violates architecture requirement for scoped template styles
   - ❌ Attempted in commit c85828f but deemed incorrect

### Impact
- **All Template Components**: Use script import + empty `<style scoped>` pattern
  - `templates/modern/CoverLetterModern.vue` - Updated (commit 74f7cd2)
  - `templates/classic/CoverLetterClassic.vue` (future) - Use same pattern
  - `templates/minimal/CoverLetterMinimal.vue` (future) - Use same pattern
- **Documentation Updated**:
  - Comments in Vue components explain the pattern
  - Comments in `styles.css` clarify import method
  - `CLAUDE.md` updated with correct template creation pattern
  - `DECISIONS.md` documents the evolution of failed approaches and working solution
- **Export Functionality**: Scoped styles are properly extracted by `useExport.ts`

### Verification Steps
1. ✅ Styles apply correctly in development (`npm run dev`)
2. ✅ Styles apply correctly in local production build (`npm run build && npm run preview`)
3. ✅ Styles apply correctly in Vercel production deployment
4. ✅ Scoped attributes visible in browser DevTools (data-v-xxx)
5. ✅ No style leakage to other components
6. ✅ HTML export includes correct styles

### References
- **Vite CSS Handling**: CSS module imports in script section
- **Vue Scoped CSS**: [Scoped CSS in SFC](https://vuejs.org/api/sfc-css-features.html#scoped-css)
- **Issue**: #19 - Template styles not applied in production
- **PR**: #20 - Fix for CSS import strategy (commits: 8eedcea, c85828f, cd3d638, 74f7cd2)

---

## Key Concepts

### Progressive Enhancement
Each MVP builds on previous ones:
```
MVP 1 (Shell) → MVP 2 (Parser) → MVP 3 (Template) → MVP 4 (Editor) →
MVP 5 (Preview) → MVP 6 (Integration) → MVP 7-12 (Enhancements)
```

### Component Reusability
Components built in demo pages (MVP 2-5) are reused in main app (MVP 6):
- `composables/useXmlParser.ts` (MVP 2) → used by PreviewPanel (MVP 5)
- `templates/modern/CoverLetterModern.vue` (MVP 3) → used by PreviewPanel (MVP 5)
- `components/XmlEditor.vue` (MVP 4) → used in main app (MVP 6)
- `components/PreviewPanel.vue` (MVP 5) → used in main app (MVP 6)

### Styling Separation
```
┌─────────────────────────────────┐
│  Application Chrome (@nuxt/ui)  │  ← Buttons, inputs, modals
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │  Template Content         │  │  ← Scoped CSS (exportable)
│  │  (Scoped CSS)             │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### XML → HTML Data Flow
```
1. User types in XmlEditor
2. 300ms debounce
3. useXmlParser converts XML → ParsedData object
4. PreviewPanel passes ParsedData to template component
5. Template renders HTML with Vue
6. Preview displays rendered result
```

---

## Future Considerations

### Post-PoC Enhancements
These were explicitly deferred to keep PoC scope manageable:

1. **UI Template Switcher**: Dropdown in AppHeader to switch templates (no longer code-only)
2. **Multiple Templates at Once**: Side-by-side comparison view
3. **Auto-save to localStorage**: Prevent data loss on refresh
4. **Multi-document Support**: Tabs for multiple XML files
5. **Advanced XML Schemas**: Support for namespaces, attributes
6. **AI Assistance**: Auto-complete, suggestions based on schema

### Scaling Considerations
If the app grows beyond PoC:
- **State Management**: Consider Pinia when state becomes complex
- **Testing**: Add Vitest for unit tests, Playwright for E2E
- **Build Optimization**: Code splitting, lazy loading for templates
- **Backend Integration**: API for saving/loading documents
- **Advanced Export**: PDF generation via puppeteer or similar

---

## Lessons Learned

### What Went Well
- **Agile MVP Approach**: Clear progression, each MVP testable
- **@nuxt/ui Decision**: Saved significant development time
- **Demo Pages**: Proved valuable for testing and documentation
- **Component Reusability**: Building demos first ensured clean interfaces

### What We'd Do Differently
- **Earlier Styling Discussion**: Clarified @nuxt/ui vs scoped CSS upfront
- **XML Schema First**: Should have reviewed `docs/sample/cover-letter.xml` before planning
- **Explicit Non-Goals**: PRD section 10.3 helped scope decisions

---

**Last Updated**: 2025-10-11
**Next Review**: After MVP 6 integration (evaluate decisions, adjust if needed)
