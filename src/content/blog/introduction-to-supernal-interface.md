---
title: "Making Any Application AI-Controllable: Introducing @supernal-interface/core"
description: How a single decorator transforms your code into an AI-operable, auto-testable interface
tts:
  enabled: true
  voice: "alloy"
  voices: ["alloy", "echo", "fable", "nova", "onyx", "shimmer"]
  enableSpeed: true
  enableProgress: true
---

# Making Any Application AI-Controllable: Introducing @supernal-interface/core

*How a single decorator transforms your code into an AI-operable, auto-testable interface*

---

## The Problem

Building AI-controllable applications is hard. You need to:
- Define tools for the AI to call
- Write comprehensive tests
- Document your API
- Implement safety controls
- Keep everything in sync

Traditional approaches require maintaining separate systems for each concern, leading to duplication, drift, and maintenance nightmares.

## The Solution

What if you could do all of this with a single decorator?

```typescript
@Tool({ 
  description: 'Send a chat message',
  aiEnabled: true,
  examples: ['send message "hello"', 'type and send "test"']
})
async sendMessage(text: string): Promise<ToolResult> {
  // Your business logic here
  await this.typeIntoInput(text);
  await this.clickSendButton();
  return { success: true, message: `Sent: "${text}"` };
}
```

From this one decorator:
- ✅ **AI can call it** via natural language ("send message hello")
- ✅ **Tests auto-generate** (unit, integration, E2E)
- ✅ **Documentation auto-generates**
- ✅ **Safety controls apply** automatically
- ✅ **Full type safety** through TypeScript

Meet **@supernal-interface/core**: A universal system for making any application AI-controllable and auto-testable.

---

## How It Works

### 1. Decorate Your Methods

Add `@Tool` to any async method:

```typescript
import { Tool, ToolProvider, ToolResult } from '@supernal-interface/core';

@ToolProvider({ category: 'chat' })
export class ChatTools {
  
  @Tool({
    description: 'Click the send button',
    aiEnabled: true,
    dangerLevel: 'safe'
  })
  async clickSendButton(): Promise<ToolResult> {
    const button = document.querySelector('[data-testid="send-button"]');
    if (!button) {
      return { success: false, error: 'Button not found' };
    }
    button.click();
    return { success: true };
  }
}
```

That's it. **No schemas to maintain. No separate test files. No documentation to write.**

### 2. Auto-Generate Everything

```bash
# Generate comprehensive test suites
npm run generate:tests

# Generate API documentation
npm run generate:docs

# Extract tool metadata
npm run generate:metadata
```

The system scans your `@Tool` decorators and generates:

**Unit Tests:**
```typescript
test('clickSendButton - should click send button', async () => {
  const result = await tools.clickSendButton();
  expect(result.success).toBe(true);
});

test('clickSendButton - should have correct metadata', () => {
  const meta = ToolRegistry.getTool('ChatTools.clickSendButton');
  expect(meta.aiEnabled).toBe(true);
  expect(meta.dangerLevel).toBe('safe');
});
```

**Integration Tests:**
```typescript
test('clickSendButton - AI can execute safely', async () => {
  const result = await ToolRegistry.executeForAI('ChatTools.clickSendButton', {});
  expect(result.success).toBe(true);
});
```

**E2E Tests:**
```typescript
test('clickSendButton - UI interaction works', async ({ page }) => {
  await page.goto('/chat');
  const button = page.locator('[data-testid="send-button"]');
  await expect(button).toBeVisible();
  await button.click();
});
```

### 3. Let AI Control Your App

The AI sees your decorated methods as callable tools:

```typescript
// User says: "send message hello"
// AI calls:
await chatTools.sendMessage('hello');

// User says: "search for users named John"
// AI calls:
await userTools.searchUsers('John');
```

---

## Works For Everything

### DOM Interactions

```typescript
@Tool({ elementId: 'chat-input-send-button', aiEnabled: true })
async clickSendButton(): Promise<ToolResult> {
  const element = document.querySelector('[data-testid="send-button"]');
  element.click();
  return { success: true };
}
```

### Pure Functions

```typescript
@Tool({ description: 'Validate email format', aiEnabled: true })
async validateEmail(email: string): Promise<ToolResult> {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return { 
    success: isValid, 
    data: { valid: isValid },
    error: isValid ? undefined : 'Invalid email format'
  };
}
```

### API Calls

```typescript
@Tool({ description: 'Fetch user profile from backend', aiEnabled: true })
async fetchUserProfile(userId: string): Promise<ToolResult> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Complex Workflows

```typescript
@Tool({
  description: 'Send message with validation and retry',
  aiEnabled: true,
  examples: ['send message "hello"', 'type and send "test"']
})
async sendMessage(text: string): Promise<ToolResult> {
  // 1. Validate
  const validation = await this.validateMessage(text);
  if (!validation.success) return validation;
  
  // 2. Type into input
  await this.typeIntoInput(text);
  
  // 3. Click send with retry
  for (let i = 0; i < 3; i++) {
    const result = await this.clickSendButton();
    if (result.success) return result;
    await this.wait(1000);
  }
  
  return { success: false, error: 'Failed after 3 retries' };
}
```

---

## Safety First

### Default: Test-Only

All tools are **test-only by default** - AI cannot execute them:

```typescript
@Tool()  // Default: aiEnabled = false
async deleteAllUsers() {
  // Only tests can call this
}
```

### Explicit AI Enablement

You must explicitly enable AI execution:

```typescript
@Tool({ aiEnabled: true })  // Now AI can call it
async searchUsers(query: string) { }
```

### Danger Levels (Auto-Inferred)

The system automatically infers danger levels from method names:

```typescript
// Auto-inferred: 'safe'
@Tool({ aiEnabled: true })
async searchUsers(query: string) { }

// Auto-inferred: 'moderate'
@Tool({ aiEnabled: true })
async createUser(email: string) { }

// Auto-inferred: 'dangerous'
@Tool({ aiEnabled: true })
async approveRegistration(userId: string) { }

// Auto-inferred: 'destructive'
@Tool({ aiEnabled: true })
async deleteUser(userId: string) { }
```

### Require Human Approval

For dangerous operations, require human approval:

```typescript
@Tool({ 
  aiEnabled: true, 
  dangerLevel: 'destructive',
  requiresApproval: true  // AI must ask permission first
})
async deleteAllUserData(userId: string) {
  // Requires human to click "Approve" before execution
}
```

---

## Optional: Name Contracts for Stability

For UI-heavy applications, you can define centralized name contracts:

```typescript
// src/names/Chat.names.ts
export const Chat = {
  Input: {
    sendButton: 'chat-input-send-button',
    textfield: 'chat-input-textfield',
  },
  MessageList: {
    container: 'chat-messages-container',
  }
} as const;
```

Then reference them in your tools:

```typescript
import { Chat } from '@/names';

@Tool({ 
  elementId: Chat.Input.sendButton,  // Stable reference
  aiEnabled: true 
})
async clickSendButton() {
  const element = document.querySelector(`[data-testid="${Chat.Input.sendButton}"]`);
  element.click();
}
```

And in your components:

```typescript
import { Chat } from '@/names';

export const ChatInput = () => (
  <button data-testid={Chat.Input.sendButton}>
    Send
  </button>
);
```

**Benefits:**
- Single source of truth for DOM IDs
- Type-safe references
- Easy refactoring
- Clear contracts between systems

**But it's optional** - for backend APIs or pure functions, you don't need name contracts at all.

---

## Real-World Example

Here's a complete, production-ready tool class:

```typescript
import { Tool, ToolProvider, ToolResult } from '@supernal-interface/core';
import { Chat } from '@/names';

@ToolProvider({ category: 'chat' })
export class ChatTools {
  
  // Simple DOM interaction
  @Tool({
    elementId: Chat.Input.sendButton,
    description: 'Click the send button',
    aiEnabled: true,
    dangerLevel: 'safe'
  })
  async clickSendButton(): Promise<ToolResult> {
    const element = document.querySelector(`[data-testid="${Chat.Input.sendButton}"]`);
    if (!element) return { success: false, error: 'Button not found' };
    element.click();
    return { success: true, message: 'Clicked send button' };
  }
  
  // Pure function
  @Tool({
    description: 'Validate chat message',
    aiEnabled: true,
    dangerLevel: 'safe'
  })
  async validateMessage(text: string): Promise<ToolResult> {
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Message is empty' };
    }
    if (text.length > 500) {
      return { success: false, error: 'Message too long (max 500 chars)' };
    }
    return { success: true, data: { valid: true, length: text.length } };
  }
  
  // API call
  @Tool({
    description: 'Fetch chat history',
    aiEnabled: true,
    dangerLevel: 'safe'
  })
  async fetchChatHistory(userId: string): Promise<ToolResult> {
    try {
      const response = await fetch(`/api/chat/history/${userId}`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Complex workflow
  @Tool({
    name: 'Send Message',
    description: 'Validate, type, and send a chat message',
    aiEnabled: true,
    dangerLevel: 'safe',
    examples: [
      'send message "hello"',
      'type and send "test"',
      'send "hi there"'
    ]
  })
  async sendMessage(text: string): Promise<ToolResult> {
    // 1. Validate
    const validation = await this.validateMessage(text);
    if (!validation.success) return validation;
    
    // 2. Type into input
    const typeResult = await this.typeIntoInput(text);
    if (!typeResult.success) return typeResult;
    
    // 3. Click send
    return await this.clickSendButton();
  }
  
  private async typeIntoInput(text: string): Promise<ToolResult> {
    const element = document.querySelector(`[data-testid="${Chat.Input.textfield}"]`);
    if (!element) return { success: false, error: 'Input not found' };
    (element as HTMLInputElement).value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    return { success: true };
  }
}
```

**What you get:**
- 4 AI-callable tools
- 12+ auto-generated tests (unit + integration + E2E)
- Complete API documentation
- Safety controls
- Natural language examples
- **All from decorated methods**

---

## Getting Started

### Installation

```bash
npm install @supernal-interface/core
```

### Basic Setup

1. **Create tool class:**
```typescript
// src/tools/MyTools.ts
import { Tool, ToolProvider, ToolResult } from '@supernal-interface/core';

@ToolProvider({ category: 'my-feature' })
export class MyTools {
  
  @Tool({
    description: 'Do something useful',
    aiEnabled: true
  })
  async doSomething(param: string): Promise<ToolResult> {
    // Your logic here
    return { success: true, data: { result: 'done' } };
  }
}
```

2. **Generate tests:**
```bash
npm run generate:tests
```

3. **Run tests:**
```bash
npm test
```

That's it! You now have:
- AI-controllable functionality
- Comprehensive test coverage
- Auto-generated documentation

### Advanced: Add Name Contracts (Optional)

For UI-heavy apps:

1. **Define names:**
```typescript
// src/names/MyFeature.names.ts
export const MyFeature = {
  Button: 'my-feature-button',
  Input: 'my-feature-input',
} as const;
```

2. **Reference in tools:**
```typescript
@Tool({ elementId: MyFeature.Button })
async clickButton() { }
```

3. **Use in components:**
```typescript
<button data-testid={MyFeature.Button}>Click Me</button>
```

---

## Why This Matters

### Traditional Approach

❌ **Separate systems for everything:**
- Write tool definitions (JSON/YAML schemas)
- Write implementation
- Write tests manually
- Write documentation manually
- Keep everything synchronized

**Result:** Duplication, drift, maintenance burden

### @supernal-interface/core Approach

✅ **Single source of truth:**
- Write decorated methods once
- Everything else generates automatically
- Always in sync
- Zero duplication

**Result:** Faster development, better quality, easier maintenance

---

## Comparison

| Feature | Traditional | @supernal-interface/core |
|---------|-------------|--------------------------|
| **Tool Definition** | Separate schema files | `@Tool` decorator |
| **Implementation** | Separate implementation | Same decorated method |
| **Tests** | Manual | Auto-generated |
| **Documentation** | Manual | Auto-generated |
| **Type Safety** | Loose/external | Full TypeScript |
| **AI Integration** | Complex setup | Built-in |
| **Maintenance** | High (sync multiple files) | Low (single source) |
| **Learning Curve** | Steep | Minimal |
| **Versatility** | Often domain-specific | Works for everything |

---

## Real Benefits

### For Developers

- **Write less code** - One decorator does everything
- **Better type safety** - Full TypeScript support
- **Faster iteration** - No manual test writing
- **Clear contracts** - Optional name contracts for clarity
- **Zero lock-in** - Just decorators, easy to migrate away

### For Teams

- **Consistency** - Standard pattern across codebase
- **Onboarding** - Simple concept to learn
- **Maintainability** - Single source of truth
- **Quality** - Auto-generated tests ensure coverage
- **Safety** - Built-in AI safety controls

### For Products

- **AI-ready** - Instant AI controllability
- **Testable** - Comprehensive test coverage
- **Documented** - Always up-to-date docs
- **Scalable** - Pattern works at any size
- **Flexible** - Works for any type of operation

---

## What's Next

**@supernal-interface/core is production-ready today.**

Try it on your next project:

```bash
npm install @supernal-interface/core
```

Read the [complete documentation](./ARCHITECTURE.md) for detailed guidance.

Join our community and share what you build!

---

## Key Takeaways

✅ **One decorator** transforms methods into AI-controllable, auto-testable tools  
✅ **Works for everything** - DOM, APIs, pure functions, complex workflows  
✅ **Auto-generates** tests and documentation  
✅ **Safety first** - Test-only by default, explicit AI enablement  
✅ **Optional name contracts** for UI stability (but not required)  
✅ **Zero lock-in** - Just decorators, standard TypeScript

**Making any application AI-controllable has never been simpler.**

---

*Ready to make your app AI-controllable? [Get started with @supernal-interface/core →](./ARCHITECTURE.md)*

