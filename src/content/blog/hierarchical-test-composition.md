---
title: "Stop Duplicating Test Setup: The Background Pattern"
date: "2026-01-21"
subheader: "How Gherkin's Background steps enable reusable, cached, hierarchical test composition"
categories: ["Testing", "Story System", "Best Practices"]
readingTime: "8 min read"
featured: true
tts:
  enabled: true
  voice: "nova"
  enableSpeed: true
  enableProgress: true
---

## The Problem: Test Setup Everywhere

You've written tests like this:

```typescript
test('send message', async ({ page }) => {
  await page.goto('/chat');
  await page.locator('#chat-bubble').click();  // Setup

  // Actual test
  await page.fill('#input', 'Hello');
  await page.click('#send');
});

test('clear messages', async ({ page }) => {
  await page.goto('/chat');
  await page.locator('#chat-bubble').click();  // Same setup!

  // Actual test
  await page.click('#clear');
});

test('view history', async ({ page }) => {
  await page.goto('/chat');
  await page.locator('#chat-bubble').click();  // Same setup again!

  // Actual test
  expect(await page.locator('#messages').count()).toBe(3);
});
```

Three tests, three identical setup blocks. Now imagine 50 tests. That's a maintenance nightmare.

## The Common "Solution": Helper Functions

Most teams reach for helpers:

```typescript
async function setupChat(page) {
  await page.goto('/chat');
  await page.locator('#chat-bubble').click();
}

test('send message', async ({ page }) => {
  await setupChat(page);  // Still running setup every time
  // ... test
});
```

Better, but:
- ❌ Still runs setup for EVERY test (slow)
- ❌ No caching of intermediate states
- ❌ Can't compose setups hierarchically
- ❌ No visibility into what setup does

## The Real Solution: Background Steps

Gherkin has had the answer since 2008:

```gherkin
Feature: Chat Component

  Background:
    Given I am on the chat page
    When I expand the chat bubble

  Scenario: Send a message
    When I type "Hello"
    And I click send
    Then I should see 1 message

  Scenario: Clear messages
    When I click clear
    Then I should see 0 messages

  Scenario: View history
    Then I should see 3 messages
```

**What's different?**

The `Background` section runs before EVERY scenario, automatically. No duplication.

## But Here's the Powerful Part: Caching

Our story system goes beyond basic Gherkin. It caches Background execution by state:

```
First Test:
├─ [1] goto(/chat) → cache: "page_loaded"
├─ [2] click(#bubble) → cache: "chat_expanded"  ← CHECKPOINT
└─ [3] Run scenario... ✓

Second Test:
├─ [Resume from "chat_expanded" cache] ⚡
└─ [3] Run scenario... ✓  (50% faster!)

Third Test:
├─ [Resume from "chat_expanded" cache] ⚡
└─ [3] Run scenario... ✓  (50% faster!)
```

**Result**: First test takes 2.5s, subsequent tests take 0.8s.

With 10 tests:
- Helper function: 10 × 2.5s = **25 seconds**
- Background + cache: 2.5s + (9 × 0.8s) = **9.7 seconds**
- **Savings: 15.3 seconds (61% faster)**

## Hierarchical Composition

Background steps can build on each other:

```gherkin
Background:
  # Level 1: Get to the right place
  Given I am on the examples page

  # Level 2: Wait for things to load
  Given the counter widget is visible
  And the chat bubble is visible

  # Level 3: Interact (builds on Level 2)
  When I expand the chat bubble

  # Level 4: Set state (builds on Level 3)
  Given chat has 3 messages

Scenario: Now I can test from this starting point
  When I send a new message
  Then I should see 4 messages
```

Each level is cached independently. If another test needs Levels 1-3 but different Level 4 state, it reuses the first three caches.

## Real Example: The Chat Bug Fix

Last week we had 125 failing tests. They all needed the chat expanded, but no test was doing it.

**Bad approach** (what I initially did):
```typescript
// Added to EVERY test file
import { expandChatBubble } from './fixtures';

test('my test', async ({ page }) => {
  await expandChatBubble(page);  // Duplicated everywhere
  // ...
});
```

**Right approach** (Background):
```gherkin
Background:
  Given chat bubble is visible
  When I click chat bubble

Scenario: All scenarios now start with chat expanded!
  # No duplication needed
```

One line in the Background. 64 tests fixed. Zero duplication.

## Type Safety Bonus

Unlike helper functions with magic strings, our Background steps use type-safe contracts:

```gherkin
Background:
  Given I am on Routes.Demo              # Type-safe route
  Given Components.Chat.bubble is visible # Type-safe component ID
  When I click Components.Chat.bubble     # Type-safe action
```

If you rename a component, TypeScript errors appear in your `.feature` files. Try that with `await page.click('#chat-bubble')`!

## When NOT to Use Background

Don't use Background if tests need different starting points:

```gherkin
# ❌ Bad - Half the scenarios don't need chat expanded
Background:
  When I expand chat bubble

Scenario: Test counter (doesn't need chat!)
  When I click increment
```

```gherkin
# ✅ Good - Only common setup
Background:
  Given I am on the examples page

Scenario: Test with chat
  When I expand chat bubble
  And I send a message

Scenario: Test counter
  When I click increment
```

## The Migration Path

If you have manual tests with repeated setup:

1. **Identify the pattern**: What setup do multiple tests share?
2. **Create a .feature file**: Move common setup to Background
3. **Write scenarios**: Each one builds on the Background
4. **Generate tests**: `npm run story:generate`
5. **Enjoy**: Cached, hierarchical, maintainable tests

## Why This Matters

**For developers**: Write tests once, run them fast, maintain them easily.

**For teams**: Shared vocabulary (Gherkin), consistent patterns, less code review friction.

**For the business**: Faster CI/CD, fewer flaky tests, more confidence in releases.

## The Bigger Picture

This is part of the story system's composability:

- **Background steps** = Reusable setup (this post)
- **Data contracts** = Reusable state declarations
- **State caching** = Skip duplicate work
- **Type safety** = Catch errors at compile time

Together, they enable tests that are:
- ✅ **Fast** (cached execution)
- ✅ **Maintainable** (single source of truth)
- ✅ **Composable** (hierarchical building blocks)
- ✅ **Safe** (type-checked at compile time)

## Try It Yourself

Start simple:

```gherkin
Feature: My First Story

  Background:
    Given I am on my app's home page

  Scenario: Click around
    When I click the "About" link
    Then I should see "About Us"
```

Run `npm run story:generate` and watch it create a Playwright test that handles all the boilerplate.

Then add more scenarios. They'll all start from the same cached Background, automatically.

---

**Further Reading:**
- [Background Pattern Documentation](/docs/story-system/12_BACKGROUND_PATTERN)
- [State-Aware Caching](/docs/story-system/04_STATE_AWARE_CACHING)
- [Getting Started with Story System](/docs/story-system/00_GETTING_STARTED)

**Questions?** Check the [story system guide](/docs/story-system) or [open an issue](https://github.com/anthropics/supernal-interface/issues).
