---
title: "Type-Safe UI Testing Without the Pain"
date: "2025-11-16"
description: "How name contracts eliminate magic strings and enable compile-time validation for UI automation"
subheader: "From fragile string IDs to bulletproof type-safe selectors"
categories: ["Testing", "Type Safety"]
tags: ["typescript", "testing", "playwright", "type-safety"]
author: "Supernal Team"
readingTime: "6 min read"
featured: false
headerStyle: "minimal"
showToc: true
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

## The Magic String Problem

Traditional UI testing relies on fragile string identifiers:

```typescript
// ❌ Brittle - typos break at runtime
await page.locator('[data-testid="chat-send-buton"]').click(); // Oops!

// ❌ No refactoring support
// If you rename the button, all tests break silently
```

One typo. Runtime failure. Hours of debugging.

## Name Contracts: The Solution

Name contracts are **typed string constants** that act as a single source of truth:

```typescript
// Define once
export const ChatNames = {
  sendButton: 'chat-send-button',
  input: 'chat-input',
  clearButton: 'chat-clear-button'
} as const;

// Use everywhere with autocomplete
<button data-testid={ChatNames.sendButton}>Send</button>

// Playwright tests get type safety
await page.locator(`[data-testid="${ChatNames.sendButton}"]`).click();

// AI tools reference the same constants
@Tool(ChatNames.sendButton, {
  examples: ['send message']
})
```

## Benefits

### 1. Compile-Time Validation
```typescript
// ✅ TypeScript catches typos instantly
<button data-testid={ChatNames.sendButon}> // Error: Property doesn't exist
```

### 2. Refactoring Safety
```typescript
// Change the name in ONE place
export const ChatNames = {
  sendButton: 'chat-message-send-button', // Updated
} as const;

// ALL references update automatically
// Tests, components, and AI tools stay in sync
```

### 3. IDE Autocomplete
Just type `ChatNames.` and get instant suggestions for all available elements.

### 4. No Runtime Errors
If it compiles, your IDs are correct.

## Hierarchical Naming

Prevent collisions with structured naming:

```typescript
// Pattern: {container}-{feature}-{element}

export const MainMenu = {
  open: 'demo-simple-mainmenu-open',
  close: 'demo-simple-mainmenu-close',
} as const;

export const UserMenu = {
  open: 'demo-simple-usermenu-open', // Different feature, no collision!
} as const;
```

## Real-World Example

### Before (Magic Strings)
```typescript
// Component
<button data-testid="submit-btn">Submit</button>

// Test
await page.locator('[data-testid="submit-btn"]').click();

// AI Tool
@Tool({
  elementId: 'submit-btn', // Might be different!
  examples: ['submit form']
})
```

**Problem:** Three different places. Easy to get out of sync.

### After (Name Contracts)
```typescript
// Names file (single source of truth)
export const FormNames = {
  submitButton: 'form-submit-button'
} as const;

// Component
<button data-testid={FormNames.submitButton}>Submit</button>

// Test  
await page.locator(`[data-testid="${FormNames.submitButton}"]`).click();

// AI Tool
@Tool(FormNames.submitButton, {
  examples: ['submit form']
})
```

**Solution:** One definition. Always in sync. Type-safe.

## Organization Patterns

### Centralized (Small Projects)
```typescript
// src/names/index.ts
export const ChatNames = { /* ... */ };
export const UserNames = { /* ... */ };
```

### Co-located (Large Projects)
```typescript
// src/features/chat/Chat.names.ts
export const ChatNames = { /* ... */ };

// src/features/user/User.names.ts  
export const UserNames = { /* ... */ };
```

Both work! Pick what fits your project size.

## Validation

Add a validation script to catch duplicates:

```typescript
// scripts/validate-names.ts
const allNames = Object.values({
  ...ChatNames,
  ...UserNames,
  // ... more
});

const duplicates = allNames.filter((name, i) => 
  allNames.indexOf(name) !== i
);

if (duplicates.length > 0) {
  throw new Error(`Duplicate IDs found: ${duplicates}`);
}
```

Run it in CI to prevent collisions.

## Migration Path

Incrementally adopt name contracts:

1. **Create names file** for one feature
2. **Update component** to use names
3. **Update tests** to use names
4. **Add AI tools** using names
5. **Repeat** for next feature

No big-bang rewrites required.

## Best Practices

✅ **DO:**
- Use kebab-case for IDs (`'chat-send-button'`)
- Use PascalCase for containers (`'ChatContainer'`)
- Export as `const` with `as const`
- Add JSDoc comments explaining usage

❌ **DON'T:**
- Use magic strings directly in components
- Create names inline
- Duplicate IDs across files
- Forget the `as const` (loses type safety!)

## Learn More

- See [Examples](/examples) for live demos
- Read [80% Less Boilerplate](/blog/80-percent-less-boilerplate) for decorator usage
- Check [GitHub](https://github.com/supernal-nova/supernal-interface) for full docs

