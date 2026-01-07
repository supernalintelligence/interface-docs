---
title: "What's In a Name? Type-Safe UI Automation with Name Contracts"
date: "2025-11-17"
subheader: "Type-safe, refactor-safe, AI-friendly UI automation that scales"
categories: ["Architecture"]
readingTime: "15 min read"
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

# What's In a Name? Type-Safe UI Automation with Name Contracts

**TL;DR:** We reduced UI tool boilerplate by 80% using the same pattern Redux uses for action types - but applied to DOM IDs. The result: type-safe, refactor-safe, AI-friendly UI automation that scales to hundreds of components.

---

## The Problem: Magic Strings Everywhere

If you've ever written Playwright tests, you've written code like this:

```typescript
// component.tsx
<button data-testid="menu-open">Open Menu</button>

// test.spec.ts
await page.locator('[data-testid="menu-open"]').click();
```

**This works... until you refactor.**

One day, you decide "menu-open" should be "main-menu-open" for clarity. You update the component:

```typescript
<button data-testid="main-menu-open">Open Menu</button>
```

**Your tests break at runtime.** No compile error, no warning. Just a failing test.

### The Core Problem: No Single Source of Truth

In a typical UI automation setup, the same ID appears in **three places**:

1. **Component** (`data-testid` attribute)
2. **Tool/Action** (automation script that clicks it)
3. **Test** (Playwright selector)

**Three copies = three places to update = guaranteed drift.**

---

## The Pattern: Name Contracts

If you've used Redux, you've seen this pattern:

```typescript
// Redux action types
const TOGGLE_TODO = 'todos/toggle';
const ADD_TODO = 'todos/add';

// Used in actions
dispatch({ type: TOGGLE_TODO, id: 5 });

// Used in reducers
switch (action.type) {
  case TOGGLE_TODO:
    // ...
}
```

**Why does Redux do this?**
- ✅ Single source of truth
- ✅ Type-safe (typos caught at compile-time)
- ✅ Refactor-safe (rename once, updates everywhere)
- ✅ IDE autocomplete

**What if we applied the same pattern to DOM IDs?**

---

## The Solution: Name Contracts for UI

### Step 1: Define Names Once

```typescript
// menu.names.ts
export const MenuNames = {
  container: 'demo-menu-container',
  openButton: 'demo-menu-open',
  closeButton: 'demo-menu-close',
  item1: 'demo-menu-item-1',
  item2: 'demo-menu-item-2',
} as const;

export type MenuNameId = typeof MenuNames[keyof typeof MenuNames];
```

**Just like Redux action types, but for DOM elements.**

### Step 2: Use Names Everywhere

**In Components:**
```typescript
// MenuWidget.tsx
import { MenuNames } from './menu.names';

export function MenuWidget() {
  return (
    <div data-testid={MenuNames.container}>
      <button data-testid={MenuNames.openButton}>
        Open Menu
      </button>
    </div>
  );
}
```

**In Automation Tools:**
```typescript
// MenuTools.ts
import { Tool, ToolProvider } from '@supernal-interface/core';
import { MenuNames } from './menu.names';

@ToolProvider('demo-app')
export class MenuTools {
  @Tool(MenuNames.openButton, { examples: ['open menu'] })
  async openMenu() {
    return this.state.merge({ menuOpen: true });
  }
}
```

**In Tests:**
```typescript
// menu.spec.ts
import { test, expect } from '@playwright/test';
import { MenuNames } from '@/features/menu/menu.names';

test('menu interaction', async ({ page }) => {
  await page.goto('/demo');
  
  // Use the same constant
  await page.locator(`[data-testid="${MenuNames.openButton}"]`).click();
  
  await expect(page.locator(`[data-testid="${MenuNames.container}"]`))
    .toBeVisible();
});
```

### Step 3: Refactor with Confidence

**Change the ID once:**
```typescript
export const MenuNames = {
  openButton: 'demo-main-menu-open',  // ← Changed
  // ...
} as const;
```

**All three uses update automatically:**
- ✅ Component: `<button data-testid={MenuNames.openButton}>`
- ✅ Tool: `@Tool(MenuNames.openButton, ...)`
- ✅ Test: `page.locator(\`[data-testid="${MenuNames.openButton}"]\`)`

**Typo?** TypeScript catches it at compile-time:
```typescript
<button data-testid={MenuNames.opnButton}>
//                              ^^^^^^^^^ 
// Error: Property 'opnButton' does not exist on type 'typeof MenuNames'
```

---

## The Innovation: Three-Way Contracts

Most patterns connect **two** things:
- Redux: actions ↔ reducers
- React Query: queries ↔ cache

**Name contracts connect THREE:**
- Component (`data-testid`) ↔ Tool (`@Tool` decorator) ↔ Test (Playwright)

**This is the key insight:** UI automation needs a **stronger contract** than state management because it spans three domains:
1. **Rendering** (React components)
2. **Behavior** (automation tools)
3. **Verification** (tests)

**Name contracts unify all three.**

---

## Real-World Impact: 80% Boilerplate Reduction

### Before (40 lines):
```typescript
@ToolProvider({
  category: 'demo-app',
  containerId: 'demo-stateful',
})
export class DemoTools {
  @Tool({
    elementId: StatefulDemoNames.openMenu,
    containerId: 'demo-stateful',
    callbacks: { storage: true },
    name: 'Open Menu',
    description: 'Open the main menu',
    aiEnabled: true,
    dangerLevel: 'safe',
    requiresApproval: false,
    examples: ['open menu', 'open', 'show menu'],
  })
  async openMenu() {
    await this.ensureInitialized();
    if (!this.stateManager) return { success: false };
    await this.stateManager.merge('demo-widgets', { menuOpen: true });
    return { success: true };
  }
}
```

### After (8 lines):
```typescript
@ToolProvider('demo-stateful')
export class DemoTools {
  @Tool(MenuNames.openButton, {
    examples: ['open menu', 'open', 'show menu']
  })
  async openMenu() {
    return this.state.merge({ menuOpen: true });
  }
}
```

**What happened to the other 32 lines?**
- **Inferred from method name:** `name`, `description`, `category`
- **Inferred from prefix:** `dangerLevel` (`open*` → `'safe'`)
- **Inferred from toolType:** `aiEnabled`
- **Inherited from `@ToolProvider`:** `containerId`, `category`
- **Auto-injected:** `this.state` (StateManager)

**Only explicit requirements:**
- ✅ `elementId` (must match actual DOM element)
- ✅ `examples` (for AI natural language matching)

**Everything else? Automatic.**

---

## Scaling: Hierarchical Naming Prevents Collisions

**Problem:** What if you have multiple menus in the same container?

**Solution:** Hierarchical naming: `{container}-{feature}-{element}`

```typescript
// Main navigation menu
const MainMenuNames = {
  open: 'demo-simple-mainmenu-open',
  close: 'demo-simple-mainmenu-close',
  home: 'demo-simple-mainmenu-home',
};

// User profile menu (different feature)
const UserMenuNames = {
  open: 'demo-simple-usermenu-open',     // ✅ No collision!
  profile: 'demo-simple-usermenu-profile',
  settings: 'demo-simple-usermenu-settings',
};

// App settings menu (another feature)
const SettingsMenuNames = {
  open: 'demo-simple-settings-open',     // ✅ No collision!
  theme: 'demo-simple-settings-theme',
  language: 'demo-simple-settings-language',
};
```

**Benefits:**
- ✅ Clear ownership (which container + feature)
- ✅ No collisions (multiple menus, same container)
- ✅ Searchable (`grep "demo-simple-mainmenu-*"`)
- ✅ Scales to hundreds of components

**This is the same pattern React Router uses for route hierarchies.**

---

## Type Safety: Compile-Time Validation

### Level 1: TypeScript Structure Validation

```typescript
// Enforce naming pattern with template literal types
type ValidNameId = `${string}-${string}-${string}`;

const MenuNames: Record<string, ValidNameId> = {
  openButton: 'demo-menu-open',        // ✅ Valid
  badName: 'invalid',                  // ❌ TypeScript error!
};
```

### Level 2: ESLint Convention Enforcement

```javascript
// .eslintrc.js
rules: {
  'supernal-interface/name-format': ['error', {
    pattern: '{container}-{feature}-{element}',
    detectContainerFrom: 'file-path'
  }],
  'supernal-interface/no-duplicate-names': 'error'
}
```

**IDE experience:**
```typescript
const Names = {
  openButton: 'menu-open'  
  //          ^^^^^^^^^^
  //          ESLint: Name must start with 'demo-simple-'
  //          Quick fix: Change to 'demo-simple-menu-open'
};
```

### Level 3: CI/CD Uniqueness Validation

```bash
# Build fails if duplicate names found
npm run validate:names

# Output:
❌ DUPLICATE NAME: 'demo-menu-open'
   First: src/features/menu/menu.names.ts:5
   Duplicate: src/features/nav/nav.names.ts:12
   
   Fix: Use different feature name
   - demo-mainmenu-open
   - demo-navmenu-open
```

**Three layers of validation, zero runtime cost.**

---

## AI-Friendly: Natural Language Examples

**The pattern extends to AI automation:**

```typescript
@Tool(MenuNames.openButton, {
  examples: [
    'open menu',
    'show menu',
    'open',
    'menu open',
    'display menu'
  ]
})
async openMenu() {
  return this.state.merge({ menuOpen: true });
}
```

**User types:** "open menu"  
**AI matches:** `MenuNames.openButton` tool  
**Result:** Menu opens

**The name contract bridges human language and code.**

---

## Comparison to Alternatives

### vs. Magic Strings
| Aspect | Magic Strings | Name Contracts |
|--------|---------------|----------------|
| Type-safe | ❌ No | ✅ Yes |
| Refactor-safe | ❌ No | ✅ Yes |
| IDE autocomplete | ❌ No | ✅ Yes |
| Duplicate detection | ❌ Manual | ✅ Automatic |
| Runtime cost | ✅ Zero | ✅ Zero |

### vs. Pre-Generated IDs
| Aspect | Pre-Generation | Name Contracts |
|--------|---------------|----------------|
| Build complexity | ❌ High | ✅ Low |
| Dev experience | ❌ Delayed feedback | ✅ Immediate |
| Flexibility | ❌ Rigid | ✅ Flexible |
| Maintenance | ❌ Manual regen | ✅ Automatic |

### vs. Custom DSL (like Hyperlambda)
| Aspect | Custom DSL | Name Contracts |
|--------|-----------|----------------|
| Learning curve | ❌ High | ✅ Low (if you know Redux) |
| IDE support | ❌ Limited | ✅ Full |
| Syntax | ❌ Custom | ✅ Standard TypeScript |
| Tooling | ❌ Custom parser | ✅ ESLint + TypeScript |

**Name contracts win on simplicity: no new language, just constants.**

---

## Minification Safety: Why This Works

**Critical concern:** Do function names survive minification?

**Answer:** We don't rely on function names!

### Class Methods (Metadata Captured)
```typescript
@Tool(MenuNames.openButton, { examples: ['open'] })
async openMenu() {}  // ← Name captured at decorator-time (before minification)

// After minification:
async a() {}  // ← Function name changes, but metadata already stored!
```

### Standalone Functions (Explicit IDs)
```typescript
Tool({
  toolId: MenuNames.openButton,  // ← String literal 'demo-menu-open'
  examples: ['open']
})(function openMenu() {})

// After minification:
Tool({
  toolId: 'demo-menu-open',  // ← Preserved!
  examples: ['open']
})(function a() {})  // ← Function name changes, but we never use it!
```

**Both patterns are minification-safe because we use explicit string IDs, not function names.**

---

## Implementation: Backwards Compatible

**Old syntax still works (zero breaking changes):**

```typescript
// Old (verbose, still valid)
@Tool({
  elementId: MenuNames.openButton,
  name: 'Open Menu',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['open menu'],
})
async openMenu() { ... }

// New (concise, recommended)
@Tool(MenuNames.openButton, { examples: ['open menu'] })
async openMenu() { ... }
```

**Migration is optional, incremental, and non-breaking.**

---

## The Pattern in Action: Complete Feature

### File Structure
```
src/features/menu/
├── menu.names.ts       # Name contracts (single source of truth)
├── MenuWidget.tsx      # UI component
├── MenuTools.ts        # Automation tools
└── menu.spec.ts        # Tests
```

### 1. Names (Contract)
```typescript
// menu.names.ts
export const MenuNames = {
  container: 'demo-menu-container',
  openButton: 'demo-menu-open',
  closeButton: 'demo-menu-close',
} as const;
```

### 2. Component (UI)
```typescript
// MenuWidget.tsx
import { MenuNames } from './menu.names';

export function MenuWidget() {
  return (
    <div data-testid={MenuNames.container}>
      <button data-testid={MenuNames.openButton}>Open</button>
      <button data-testid={MenuNames.closeButton}>Close</button>
    </div>
  );
}
```

### 3. Tools (Behavior)
```typescript
// MenuTools.ts
import { Tool, ToolProvider } from '@supernal-interface/core';
import { MenuNames } from './menu.names';

@ToolProvider('demo-app')
export class MenuTools {
  @Tool(MenuNames.openButton, { examples: ['open menu'] })
  async open() {
    return this.state.merge({ menuOpen: true });
  }
  
  @Tool(MenuNames.closeButton, { examples: ['close menu'] })
  async close() {
    return this.state.merge({ menuOpen: false });
  }
}
```

### 4. Tests (Verification)
```typescript
// menu.spec.ts
import { test, expect } from '@playwright/test';
import { MenuNames } from './menu.names';

test('menu interaction', async ({ page }) => {
  await page.goto('/demo');
  
  // Open menu
  await page.locator(`[data-testid="${MenuNames.openButton}"]`).click();
  await expect(page.locator(`[data-testid="${MenuNames.container}"]`))
    .toBeVisible();
  
  // Close menu
  await page.locator(`[data-testid="${MenuNames.closeButton}"]`).click();
  await expect(page.locator(`[data-testid="${MenuNames.container}"]`))
    .not.toBeVisible();
});
```

**Total: 4 files, ~70 lines, complete feature with UI + behavior + tests.**

**Change a name? Update `menu.names.ts` once. Everything else stays in sync.**

---

## Why This Matters

### For React Developers
- ✅ Same pattern as Redux action types
- ✅ Reduces test brittleness
- ✅ IDE autocomplete for test IDs
- ✅ Refactor UI without breaking tests

### For QA Engineers
- ✅ Type-safe selectors
- ✅ No runtime surprises
- ✅ Easy to find what's testable
- ✅ Less maintenance burden

### For Framework Authors
- ✅ Proven pattern (Redux validates it)
- ✅ Zero runtime cost
- ✅ Works with existing tools (TypeScript, ESLint)
- ✅ Scales to large codebases

**This pattern solves a universal problem: keeping UI, behavior, and tests in sync.**

---

## Lessons Learned

### 1. **Don't Invent a New Language**
Use existing language features (constants, decorators, TypeScript).  
**Redux didn't invent new syntax - neither should you.**

### 2. **Patterns Should Feel Natural**
If developers say "this feels weird," the pattern is wrong.  
**Name contracts feel natural because they mirror mental models.**

### 3. **Validation Should Be Automatic**
Don't rely on discipline - use tools (TypeScript, ESLint, CI/CD).  
**Make the right thing easy, make the wrong thing hard.**

### 4. **Start with Constraints, Then Simplify**
We started verbose, then found what could be inferred.  
**80% reduction came from understanding what's truly required.**

### 5. **Backwards Compatibility Matters**
Old code should keep working while new patterns emerge.  
**Progressive enhancement, not breaking changes.**

---

## Conclusion: What's In a Name?

**A lot, it turns out.**

Names are the **contracts** that bind your UI, behavior, and tests together.

**Magic strings break those contracts.**  
**Name constants enforce them.**

This isn't a new language or a complex DSL. It's just:
- ✅ Constants (like Redux action types)
- ✅ TypeScript (for compile-time safety)
- ✅ ESLint (for convention enforcement)
- ✅ Applied to DOM IDs (instead of action types)

**The result:**
- 80% less boilerplate
- Type-safe refactoring
- Scales to hundreds of components
- Works with existing tools
- Zero runtime cost

**What's in a name?** Everything.

---

## Try It Yourself

```bash
npm install @supernal-interface/core
```

**Resources:**
- [GitHub](https://github.com/supernalintelligence/supernal-interface)
- [Documentation](https://interface.supernal.ai/docs)
- [Examples](https://interface.supernal.ai/examples)

**Questions? Comments?** Find me on [Twitter](https://twitter.com/your-handle) or [GitHub](https://github.com/your-username).

---

**Special thanks to the Redux, React Query, and Playwright teams for inspiring this pattern.**

