# CRITICAL BUG: Tool Execution Without Page Context Validation

## Issue

**Date Discovered**: 2026-01-07  
**Severity**: 🚨 HIGH - Security & UX Issue

## Problem

Tools can execute successfully even when their target UI elements are **not present on the current page**. This violates the fundamental principle that tools should only work when their associated widgets are visible.

## Example

```typescript
// User is on /comparison page
// User types: "Increment the counter"
// Tool executes successfully ✅ (WRONG!)

// But counter widget is on /examples page, NOT /comparison
// Tool should FAIL with error: "Widget not available on this page"
```

## Expected Behavior

1. **Tool execution should check**:
   - Is the tool's `elementId` present in the DOM?
   - Is the element visible (not `display: none` or hidden)?
   - Is the element on the current route?

2. **If widget not present**:
   - Return error: `"Cannot execute [toolName]: Widget not available on current page"`
   - Suggest navigation: `"This tool is available on: /examples"`

3. **Global tools exception**:
   - Tools marked as `global: true` can execute anywhere
   - Examples: Navigation tools, chat tools, settings

## Root Cause

`PlaywrightExecutor` and tool execution system do not validate:
- Element existence before execution
- Element visibility
- Route-tool mapping

## Impact

- **User confusion**: Tools appear to work but have no visible effect
- **Security risk**: Tools could affect hidden elements
- **Testing failures**: E2E tests may pass incorrectly
- **Poor UX**: No feedback when tool unavailable

## Fix Required

### 1. Add Page Context Validation

```typescript
// In PlaywrightExecutor.ts or ToolRegistry
async function validateToolContext(tool: ToolMetadata, page: Page): Promise<boolean> {
  // Skip validation for global tools
  if (tool.global) return true;
  
  // Check if element exists and is visible
  const element = page.locator(`[data-testid="${tool.elementId}"]`);
  const isVisible = await element.isVisible().catch(() => false);
  
  if (!isVisible) {
    throw new Error(
      `Tool "${tool.name}" cannot execute: Widget not available on current page. ` +
      `Available on routes: ${tool.routes?.join(', ') || 'unknown'}`
    );
  }
  
  return true;
}
```

### 2. Add Route Mapping to Tools

```typescript
@Tool({
  elementId: 'examples-counter-increment',
  routes: ['/examples'], // NEW: Specify where tool is available
  global: false // NEW: Explicitly mark as page-specific
})
async incrementCounter() {
  // ...
}

@Tool({
  elementId: 'nav-examples',
  routes: '*', // Available everywhere
  global: true // Navigation is global
})
async navigateToExamples() {
  // ...
}
```

### 3. Update AI Command Processing

```typescript
// In aiInterface.findToolsForCommand()
const availableTools = allTools.filter(tool => {
  // Only include tools available on current page
  if (tool.global) return true;
  
  const currentRoute = getCurrentRoute();
  return tool.routes?.includes(currentRoute);
});
```

## Testing

Add E2E test:
```typescript
test('Tool should fail when widget not on page', async ({ page }) => {
  await page.goto('/'); // Home page
  
  // Try to execute counter tool (only available on /examples)
  const result = await aiInterface.executeCommand('Increment the counter');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Widget not available on current page');
  expect(result.suggestion).toContain('/examples');
});
```

## Priority

**MUST FIX BEFORE**: Releasing video demo feature or any production deployment

## Related Files

- `enterprise/src/execution/PlaywrightExecutor.ts`
- `enterprise/src/core/ToolRegistry.ts`
- `enterprise/src/ui/ai/aiInterface.ts`
- `enterprise/src/decorators/Tool.ts`

## Discovered During

Story video recording testing - noticed tools executing on wrong pages without error.

