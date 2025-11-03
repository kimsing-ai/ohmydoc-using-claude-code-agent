# E2E Test Notes

## MVP 5 Preview Panel Tests

### Test Coverage Status

**Passing Tests (21/38):**
- Page load and basic rendering ✓
- Valid XML sample rendering ✓
- Parse status display ✓
- Zoom functionality ✓
- Component reusability ✓
- Integration with parser and template system ✓
- Accessibility (basic) ✓

**Known Limitations (17 failing tests):**
The tests that involve selecting different XML samples from the USelect dropdown are currently timing out. This is due to the @nuxt/ui Select component's implementation not exposing options with `role="option"` as standard HTML select elements do.

**Affected Test Scenarios:**
- Invalid XML syntax handling
- Empty XML handling
- Missing required fields handling
- Extra/unexpected fields handling
- Error recovery
- Some zoom + dropdown interaction tests

**Impact:** These tests validate edge cases and error handling, which have been manually verified during development. The core functionality (rendering, parsing, error display) works correctly, but automated tests for dropdown-based scenario switching need adjustment.

**Future Fix:** Update tests to use @nuxt/ui-specific locators once the component's internal structure is better documented, or switch to a standard HTML select for testing purposes.

### Manual Verification Completed

All functionality tested manually at `/debug/preview`:
- ✓ Valid XML renders correctly
- ✓ Invalid XML shows error without crashing
- ✓ Empty XML handled gracefully
- ✓ Missing fields display error messages
- ✓ Extra fields are ignored
- ✓ Zoom controls work (75%, 100%, 125%, 150%)
- ✓ Error recovery when switching back to valid XML

### Test Execution

```bash
# Run all MVP 5 tests
npm run test:e2e tests/e2e/mvp5-preview-panel.spec.ts

# Current results: 21 passed, 17 failed (dropdown interaction timeouts)
```
