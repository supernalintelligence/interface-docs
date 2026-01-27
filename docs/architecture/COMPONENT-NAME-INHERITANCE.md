# Component Name Inheritance Pattern

## Overview

This document describes how `ComponentNames.ts` inherits and extends component testids from installed packages.

## Architecture

### File: `src/architecture/ComponentNames.ts`

```typescript
// 1. Re-export package components for direct access
export { Components as InterfaceComponents } from '@supernal/interface-nextjs';

// 2. Import for mapping to semantic namespaces
import { Components as IC } from '@supernal/interface-nextjs';

// 3. Create semantic namespaces that combine package + app components
export const Chat = {
  // Package-provided (source of truth)
  bubble: IC.ChatToggleButton,
  input: IC.ChatInput,
  sendButton: IC.ChatSendButton,
  clearButton: IC.ChatClearButton,
  // App-specific
  messages: 'chat-messages',
  minimizeButton: 'chat-minimize',
  unreadBadge: 'chat-unread-badge'
} as const;
```

## Usage Patterns

### Pattern 1: Semantic Namespaces (Recommended for App Code)

```typescript
import { Chat } from '@/architecture/ComponentNames';

// Semantic, readable
await page.locator(testId(Chat.bubble)).click();
```

### Pattern 2: Direct Package Access (Advanced)

```typescript
import { InterfaceComponents } from '@/architecture/ComponentNames';

// Explicit package source
await page.locator(testId(InterfaceComponents.ChatToggleButton)).click();
```

### Pattern 3: Flat Imports (Optional)

```typescript
import { Chat, Blog, Counter } from '@/architecture/ComponentNames';

// Multiple namespaces
const elements = {
  chat: Chat.bubble,
  blog: Blog.container,
  counter: Counter.widget
};
```

## Precedence Rules

When component names could clash between package and app:

1. **Package components are source of truth** - Always use package testids for package-provided components
2. **App components complement** - Add app-specific testids that don't exist in the package
3. **Semantic mapping** - Use descriptive names (`bubble` instead of `ChatToggleButton`)

## Benefits

### ✅ Type Safety
- TypeScript enforces package component names
- Rename refactoring works across package boundaries
- IDE autocomplete for both package and app components

### ✅ Single Source of Truth
- Package testids automatically stay in sync
- No manual copy-paste of component names
- Package updates automatically propagate

### ✅ Clear Ownership
- `InterfaceComponents.*` = from package
- Semantic namespaces = app-specific grouping
- Comments distinguish package vs app components

### ✅ No Duplication
- Don't duplicate hardcoded strings
- Don't manually sync package changes
- Automatic inheritance via imports

## Anti-Patterns

### ❌ Don't Hardcode Package Component Names

```typescript
// BAD: Hardcoded, can drift from package
export const Chat = {
  bubble: 'chat-toggle-button',
  input: 'chat-message-input',
};
```

```typescript
// GOOD: Import from package
export const Chat = {
  bubble: IC.ChatToggleButton,
  input: IC.ChatInput,
};
```

### ❌ Don't Copy-Paste from Package

```typescript
// BAD: Manual copy-paste
export const ChatToggleButton = 'chat-toggle-button';
```

```typescript
// GOOD: Re-export
export { Components as InterfaceComponents } from '@supernal/interface-nextjs';
```

### ❌ Don't Create Namespace Clashes

```typescript
// BAD: Unclear which Chat namespace
import { Components } from '@supernal/interface-nextjs';
export const Chat = Components; // Clashes with semantic Chat namespace
```

```typescript
// GOOD: Clear aliasing
export { Components as InterfaceComponents } from '@supernal/interface-nextjs';
export const Chat = { ... }; // Semantic namespace
```

## Future-Proofing

If the package adds a `Chat` namespace in the future:

```typescript
// Option A: Merge package namespace with app-specific
export const Chat = {
  ...IC.Chat,  // Package components (if exists)
  // App-specific overrides
  messages: 'chat-messages',
} as const;

// Option B: Rename app namespace to avoid clash
export const AppChat = {
  bubble: IC.Chat.bubble,
  messages: 'chat-messages',
} as const;
```

## Testing

Tests automatically use the correct testids:

```typescript
import { Chat } from '@/architecture/ComponentNames';

test('chat bubble appears', async ({ page }) => {
  // Uses IC.ChatToggleButton internally
  await expect(page.locator(testId(Chat.bubble))).toBeVisible();
});
```

## Summary

✅ **Pattern established**: Re-export + semantic mapping
✅ **TypeScript validated**: No compilation errors
✅ **Tests passing**: Component testids resolve correctly
✅ **Maintainable**: Package updates automatically propagate
