---
title: "80% Less Boilerplate: The New @Tool Decorator"
date: "2025-11-17"
subheader: "Simplifying AI tool creation without sacrificing power or safety"
categories: ["Developer Experience"]
readingTime: "5 min read"
featured: true
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

## The Problem: Too Much Ceremony

When we first launched `@supernal-interface`, developers loved the power but complained about the verbosity. Creating a simple tool required **40 lines of configuration**:

```typescript
@Tool({
  name: 'Send Message',
  description: 'Sends a chat message',
  toolId: Components.ChatSendButton,
  elementId: Components.ChatSendButton,
  aiEnabled: true,
  dangerLevel: 'safe',
  category: ToolCategory.UI,
  executionContext: 'ui',
  examples: ['send message', 'send chat'],
  // ... 15 more lines of config
})
async sendMessage(text: string) {
  // Your logic here
}
```

For a simple button click, this was **overkill**.

## The Solution: Smart Defaults + Inference

We redesigned the `@Tool` decorator with three key principles:

### 1. Minimal Required Fields

Only specify **what the AI needs to know**:

```typescript
@Tool(Components.ChatSendButton, {
  examples: ['send message', 'send chat']
})
async sendMessage(text: string) {
  // That's it!
}
```

### 2. Container Inheritance

Use `@ToolProvider` to set defaults for an entire class:

```typescript
@ToolProvider(DemoContainers.Chat.id)
class ChatTools {
  @Tool(Components.SendButton, {
    examples: ['send message']
  })
  async send() { /* containerId inherited! */ }
}
```

### 3. Intelligent Inference

The decorator **infers** from your method name:

```typescript
// Method name → inferred properties
async sendMessage()      // → aiEnabled: true, dangerLevel: 'safe'
async deleteAccount()    // → aiEnabled: false, dangerLevel: 'destructive'
async updateSettings()   // → category: 'settings'
```

## Before & After Comparison

### Before (40 lines)
```typescript
@Tool({
  name: 'Increment Counter',
  description: 'Increments the counter by 1',
  toolId: 'counter-increment',
  elementId: 'counter-increment-button',
  aiEnabled: true,
  dangerLevel: 'safe',
  category: ToolCategory.UTILITY,
  executionContext: 'ui',
  examples: ['increment', 'add one', 'count up'],
  permissions: {
    level: 'user',
    sensitiveDataAccess: false,
    networkAccess: false,
  },
  callbacks: {
    storage: true,
    validation: false,
  },
  containerId: 'demo-container',
  tags: ['counter', 'increment'],
  keywords: ['add', 'increment', 'plus'],
})
async incrementCounter() {
  this.count++;
}
```

### After (3 lines!)
```typescript
@Tool('counter-increment-button', {
  examples: ['increment', 'add one', 'count up']
})
async incrementCounter() {
  this.count++;
}
```

## What Gets Inferred?

| Property | Inference Logic |
|---|---|
| `name` | Method name → "Increment Counter" |
| `aiEnabled` | Safe method names → `true` |
| `dangerLevel` | Method name patterns → 'safe', 'moderate', 'dangerous' |
| `category` | Method context → ToolCategory |
| `containerId` | From `@ToolProvider` parent |
| `description` | Generated from name |

## Hierarchical Naming Prevents Collisions

The image you shared showed a key insight: **hierarchical naming prevents ID collisions**.

```typescript
// Main navigation menu
const MainMenuNames = {
  open: 'demo-simple-mainmenu-open',
  close: 'demo-simple-mainmenu-close',
  home: 'demo-simple-mainmenu-home',
} as const;

// User profile menu (different feature)
const UserMenuNames = {
  open: 'demo-simple-usermenu-open',    // ✅ No collision!
  profile: 'demo-simple-usermenu-profile',
  settings: 'demo-simple-usermenu-settings',
} as const;
```

Pattern: `{container}-{feature}-{element}`

## Benefits

### For Developers
- **80% less code** to write and maintain
- **Faster onboarding** - just elementId + examples
- **Type-safe** - compile-time validation still works
- **Flexible** - can still use full config when needed

### For Teams
- **Consistent patterns** across the codebase
- **Less room for errors** - fewer fields to misconfigure
- **Better DX** - developers focus on logic, not config

## Migration Path

Existing code? **No changes required**. The old syntax still works:

```typescript
// Old syntax - still supported
@Tool({
  toolId: 'my-tool',
  elementId: 'my-element',
  aiEnabled: true,
  // ... full config
})
async myMethod() { }

// New syntax - use when ready
@Tool('my-element', {
  examples: ['do thing']
})
async myMethod() { }
```

## Try It Yourself

```bash
npm install @supernal-interface/core@latest
```

Then explore the [Examples](/examples) page to see the shorthand in action with interactive demos.

## What's Next?

We're exploring:
- **CLI tool** to help migrate existing code
- **ESLint plugin** to suggest simplifications
- **VS Code extension** with snippets for common patterns

Join the conversation on [GitHub](https://github.com/supernalintelligence/supernal-interface).

