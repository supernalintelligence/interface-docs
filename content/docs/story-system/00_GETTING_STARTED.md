---
title: "Getting Started with Story System"
description: "Complete AI-accelerated workflow guide: from problem identification to deployed code with human-in-the-loop validation"
category: "Story System"
order: 0
---

# Story System: Getting Started

**Purpose**: Complete end-to-end guide for using the Story System  
**Audience**: Developers new to the system  
**Time to Read**: 15 minutes

---

## 🎯 What is the Story System?

The Story System lets you:
1. **Write stories** in natural language (Gherkin)
2. **Reference type-safe data** instead of magic strings
3. **Generate Playwright tests** automatically
4. **Execute stories** with state-aware caching
5. **Resume from checkpoints** when tests fail

**Key Innovation**: Stories use **data contracts** (typed references) instead of inline data, making them refactorable and type-safe.

---

## 📋 Complete Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              AI-ACCELERATED STORY SYSTEM PIPELINE                │
│                   (Human-in-the-Loop)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 0: Identify Problem                                       │
│          AI: Analyze codebase, find gaps                        │
│          Human: Review, prioritize, clarify                     │
│                                                                  │
│  Step 1: Research & Get Stories                                 │
│          AI: Generate user stories from problem                 │
│          Human: Review, refine, approve                         │
│                                                                  │
│  Step 2: Define Data Contracts (Model)                          │
│          AI: Suggest component shapes, states, transitions      │
│          Human: Review, adjust, validate types                  │
│                                                                  │
│  Step 3: Write Stories (Gherkin)                                │
│          AI: Generate Gherkin from contracts                    │
│          Human: Review, add edge cases                          │
│                                                                  │
│  Step 4: Generate Tests                                         │
│          AI: Generate Playwright tests from stories             │
│          Human: Review, run, verify                             │
│                                                                  │
│  Step 5: Generate Code (Scaffolding)                            │
│          AI: Generate components from contracts                 │
│          Human: Implement business logic                        │
│                                                                  │
│  Step 6: Run Tests & Iterate                                    │
│          AI: Suggest fixes from test failures                   │
│          Human: Apply fixes, re-run                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principle**: AI accelerates each step, humans ensure correctness.

---

## Step 0: Identify Problem

**Goal**: Understand what needs to be built or fixed

### AI Role: Problem Discovery
```bash
# Future: AI analyzes codebase
sc story analyze --codebase

# AI outputs:
# - Missing features (no user authentication)
# - Incomplete implementations (counter has no reset)
# - Potential bugs (state not persisting)
# - Coverage gaps (chat has no tests)
```

### Human Role: Prioritization
- Review AI findings
- Prioritize which problems to solve first
- Clarify ambiguous requirements
- Set success criteria

**Example Output**:
```
Problem: Counter component needs reset functionality
Priority: High
Success: User can reset counter to 0 from any value
```

---

## Step 1: Research & Get Stories

**Goal**: Convert problem into user stories

### AI Role: Story Generation
```bash
# Future: AI generates stories
sc story research --problem="Counter needs reset"

# AI researches:
# - Similar implementations (best practices)
# - User expectations (what "reset" means)
# - Edge cases (reset from negative values)
# - Generates user stories:
```

**AI-Generated Stories** (Draft):
```
Story 1: As a user, I want to reset the counter to zero
Story 2: As a user, I want to reset from any value (positive/negative)
Story 3: As a user, I want visual feedback when resetting
Story 4: As a user, I want reset to work even if counter is already zero
```

### Human Role: Story Refinement
- Review AI-generated stories
- Add missing scenarios
- Remove irrelevant ones
- Clarify acceptance criteria

**Refined Stories**:
```
✓ Story 1: Reset counter to zero
✓ Story 2: Reset from negative values  
✗ Story 3: Visual feedback (out of scope)
✓ Story 4: Reset when already zero (idempotent)
```

**Output**: Approved user stories ready for modeling

---

## Step 2: Define Data Contracts (Model)

**Goal**: Create type-safe component models

**Why First**: You need to define your component shapes before referencing them in stories.

### AI Role: Contract Suggestion

```bash
# Future: AI suggests contracts
sc story model --from-stories="Reset counter to zero"

# AI analyzes stories and suggests:
```

**AI-Suggested Contract** (Draft):
```typescript
// AI proposes this structure
export const CounterContract = {
  state: {
    zero: { count: 0 },
    // AI suggests common states based on stories
    negative: { count: -5 },
    positive: { count: 10 },
  },
  after: {
    // AI suggests transitions from stories
    reset: () => ({ count: 0 }),
    increment: (state) => ({ count: state.count + 1 }),
    decrement: (state) => ({ count: state.count - 1 }),
  },
  testData: {
    // AI suggests edge cases
    valid: { count: 100 },
    invalid: { count: NaN },
    edge: { count: Number.MAX_SAFE_INTEGER },
  },
} satisfies ComponentContract<CounterState>;
```

### Human Role: Contract Validation

- Review AI-suggested types
- Add missing states or transitions
- Remove unnecessary complexity
- Validate against business rules
- Ensure type safety

**Refined Contract**:
```typescript
// Human-approved version
export const CounterContract = {
  state: {
    zero: { count: 0 } as const,     // ✓ Keep - common case
    five: { count: 5 } as const,     // ✓ Add - for testing
    negative: { count: -3 } as const, // ✓ Keep - edge case
    max: { count: 100 } as const,    // ✓ Add - business rule (max value)
  },
  after: {
    // Human validates these match actual component behavior
    increment: (state: CounterState): CounterState => 
      ({ count: Math.min(state.count + 1, 100) }), // Added max constraint
    decrement: (state: CounterState): CounterState => 
      ({ count: state.count - 1 }),
    reset: (): CounterState => 
      ({ count: 0 }),
  },
} as const satisfies ComponentContract<CounterState>;
```

### What Gets Defined

**1. Component Names** (centralized):
```typescript
// demo/src/names/Components.ts
export const Components = {
  counterWidget: 'counter-widget',
  counterDisplay: 'counter-display',
  incrementButton: 'counter-increment',
  resetButton: 'counter-reset',  // AI suggests, human approves
} as const;
```

**2. State Types** (TypeScript interfaces):
```typescript
// demo/src/data/ComponentStates.ts
export interface CounterState extends ComponentState {
  readonly count: number;
}
```

**3. Data Contracts** (states + transitions):
```typescript
// demo/src/data/DemoComponentData.ts
export const DemoComponentData = {
  counter: CounterContract,
  chat: ChatContract,
  // ... more contracts
} as const satisfies DataContractRegistry;
```

**Output**: Type-safe contracts ready for stories

---

## Step 3: Write Stories (Gherkin)

**Goal**: Formalize approved stories with type-safe references

### AI Role: Gherkin Generation

```bash
# Future: AI generates Gherkin from approved stories
sc story write --from-contracts --stories="Reset counter to zero"

# AI generates:
```

**AI-Generated Gherkin** (Draft):
```gherkin
Feature: Counter Reset
  As a user
  I want to reset the counter
  So that I can start counting from zero

  Background:
    Given I am on the counter page

  Scenario: Reset from positive value
    Given counter state is Components.counter.state.five
    When I click reset button
    Then counter state should be Components.counter.state.zero

  # AI suggests additional scenarios
  Scenario: Reset from negative value
    Given counter state is Components.counter.state.negative
    When I click reset button
    Then counter state should be Components.counter.state.zero

  # AI generates scenario outline for comprehensive testing
  Scenario Outline: Reset from various states
    Given counter state is <start>
    When I click reset button
    Then counter state should be Components.counter.state.zero

    Examples:
      | start                               |
      | Components.counter.state.five       |
      | Components.counter.state.negative   |
      | Components.counter.state.max        |
      | Components.counter.state.zero       |
```

### Human Role: Story Review & Enhancement

- Review AI-generated scenarios
- Add missing edge cases
- Clarify ambiguous steps
- Add data tables for complex cases
- Ensure readability

**Enhanced Stories**:
```gherkin
Feature: Counter Reset
  As a user
  I want to reset the counter
  So that I can start counting from zero

  Background:
    Given I am on the counter page

  Scenario: Reset from positive value
    Given counter state is Components.counter.state.five
    When I click reset button
    Then counter state should be Components.counter.state.zero
    And I should see "0" displayed

  Scenario: Reset is idempotent (human adds)
    Given counter state is Components.counter.state.zero
    When I click reset button
    Then counter state should be Components.counter.state.zero
    And no error should occur

  # Human adds business rule validation
  Scenario: Reset respects max value constraint
    Given counter state is Components.counter.state.max
    When I click reset button
    And I click increment button
    Then counter count should be 1
    And counter should not exceed 100
```

### Story Reference Format

**Format**: `Components.<component>.<section>.<property>`

```gherkin
# State reference
Given counter state is Components.counter.state.zero
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                     Registry  Component  Section  Property

# After transition reference
Then counter state should be Components.counter.after.reset
                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            Registry  Component  Section  Action
```

**Output**: Gherkin files ready for test generation

---

## Step 4: Generate Tests

**Goal**: Create executable Playwright tests from stories

### AI Role: Automatic Test Generation

```bash
# Current: Test generation from stories
npm run generate:story-tests

# AI automatically generates:
```

**AI-Generated Test** (Automatic):
```typescript
// demo/generated/tests/counter-reset.spec.ts
import { test, expect } from '@playwright/test';
import { 
  injectState, 
  readState 
} from '@supernal-interface/core/testing';

test.describe('Counter Reset', () => {
  test('Reset from positive value', async ({ page }) => {
    // Navigate to page
    await page.goto('/demo');
    
    // Given: Set initial state (from contract)
    await injectState(page, 'counter', { count: 5 });
    
    // When: Perform action
    await page.locator('[data-testid="counter-reset"]').click();
    
    // Then: Verify state (from contract)
    const state = await readState(page, 'counter');
    expect(state.count).toBe(0);
    
    // Human-added assertion
    await expect(page.locator('[data-testid="counter-display"]'))
      .toHaveText('0');
  });

  test('Reset is idempotent', async ({ page }) => {
    await page.goto('/demo');
    await injectState(page, 'counter', { count: 0 });
    
    // No error should occur
    await expect(async () => {
      await page.locator('[data-testid="counter-reset"]').click();
    }).not.toThrow();
    
    const state = await readState(page, 'counter');
    expect(state.count).toBe(0);
  });
});
```

### Human Role: Test Verification & Enhancement

- Run generated tests
- Verify they match requirements
- Add visual/UX assertions
- Handle special cases AI might miss
- Validate error handling

**Enhanced Test**:
```typescript
test('Reset respects max value constraint', async ({ page }) => {
  await page.goto('/demo');
  
  // Start at max
  await injectState(page, 'counter', { count: 100 });
  
  // Reset
  await page.locator('[data-testid="counter-reset"]').click();
  let state = await readState(page, 'counter');
  expect(state.count).toBe(0);
  
  // Increment
  await page.locator('[data-testid="counter-increment"]').click();
  state = await readState(page, 'counter');
  expect(state.count).toBe(1);
  
  // Human adds: Verify can't exceed max
  for (let i = 0; i < 200; i++) {
    await page.locator('[data-testid="counter-increment"]').click();
  }
  state = await readState(page, 'counter');
  expect(state.count).toBeLessThanOrEqual(100);
});
```

### Test Generation Features

- ✅ **State Setup**: `Given` steps → `injectState()` calls
- ✅ **Actions**: `When` steps → element interactions
- ✅ **Assertions**: `Then` steps → `expect()` statements
- ✅ **Background**: Shared setup in `beforeEach()`
- ✅ **Scenario Outlines**: Expanded into multiple tests

**Output**: Runnable Playwright tests

---

## Step 5: Generate Code (Scaffolding)

**Goal**: Create component implementation from contracts

### AI Role: Component Scaffolding

```bash
# Future: AI generates component from contract
sc story scaffold --component=counter

# AI generates:
```

**AI-Generated Component** (Draft):
```typescript
// demo/src/components/Counter.tsx
import { useState } from 'react';
import { useTestStateInjection } from '@supernal-interface/core/testing';
import { Components } from '../names/Components';
import type { CounterState } from '../data/ComponentStates';

export const Counter = () => {
  // AI infers state from contract
  const [count, setCount] = useState(0);
  
  // AI adds test injection automatically
  useTestStateInjection<CounterState>(
    'counter',
    { count },
    (newState) => setCount(newState.count)
  );
  
  // AI generates handlers from contract transitions
  const handleIncrement = () => {
    setCount(c => Math.min(c + 1, 100)); // AI includes max constraint
  };
  
  const handleDecrement = () => {
    setCount(c => c - 1);
  };
  
  const handleReset = () => {
    setCount(0);
  };
  
  return (
    <div data-testid={Components.counterWidget}>
      <span data-testid={Components.counterDisplay}>{count}</span>
      <button 
        data-testid={Components.incrementButton}
        onClick={handleIncrement}
      >
        +
      </button>
      <button 
        data-testid={Components.decrementButton}
        onClick={handleDecrement}
      >
        -
      </button>
      <button 
        data-testid={Components.resetButton}
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
};
```

### Human Role: Business Logic Implementation

- Review AI-generated scaffold
- Implement complex business logic
- Add styling and UX polish
- Connect to backend APIs
- Handle edge cases AI might miss

**Enhanced Component**:
```typescript
export const Counter = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null); // Human adds error handling
  
  useTestStateInjection<CounterState>(
    'counter',
    { count },
    (newState) => {
      setCount(newState.count);
      setError(null); // Clear errors on state injection
    }
  );
  
  const handleIncrement = () => {
    if (count >= 100) {
      setError('Maximum value reached'); // Human adds validation feedback
      return;
    }
    setCount(c => c + 1);
    setError(null);
  };
  
  // Human adds: Persist to backend
  const handleReset = async () => {
    try {
      await fetch('/api/counter/reset', { method: 'POST' });
      setCount(0);
      setError(null);
    } catch (err) {
      setError('Failed to reset counter');
    }
  };
  
  return (
    <div className="counter-widget" data-testid={Components.counterWidget}>
      {/* Human adds: Better styling and UX */}
      <div className="counter-display">
        <span data-testid={Components.counterDisplay}>{count}</span>
        <span className="counter-max">/ 100</span>
      </div>
      {error && <div className="counter-error">{error}</div>}
      {/* ... buttons */}
    </div>
  );
};
```

**Output**: Implemented components ready for testing

---

## Step 6: Run Tests & Iterate

**Goal**: Verify implementation and fix issues

### AI Role: Failure Analysis & Fix Suggestions

```bash
# Run tests
npx playwright test

# AI watches test results
# If test fails, AI suggests fixes:
```

**AI Analysis of Test Failure**:
```
❌ Test Failed: Reset from positive value
   Expected: { count: 0 }
   Actual: { count: 5 }

🤖 AI Analysis:
- Reset button click handler not connected
- setState not called in handleReset
- Suggested fix: Add onClick={handleReset} to reset button

🔧 Suggested Diff:
<button 
  data-testid={Components.resetButton}
+ onClick={handleReset}
>
  Reset
</button>
```

### Human Role: Apply Fixes & Validate

- Review AI suggestions
- Apply fixes (or reject if incorrect)
- Re-run tests
- Validate in browser
- Commit when green

**Iteration Cycle**:
```
1. Run tests → Some fail
2. AI suggests fixes
3. Human applies fixes
4. Re-run tests → More pass
5. Repeat until all green
6. Human validates manually
7. Commit and deploy
```

### With Caching & Checkpoints

```bash
# Run with caching (faster on reruns)
npm run test:cached

# Resume from last failure
npm run test:resume --from=checkpoint-123

# AI tracks which tests cached vs executed
# Human focuses on new failures
```

**Output**: All tests passing, feature complete

---

## 🔄 Complete Workflow Example

### Real-World Example: Adding Chat Feature

**1. Define Names**
```typescript
// demo/src/names/Components.ts
export const Components = {
  // ... existing
  chatInput: 'chat-input',
  sendButton: 'chat-send',
  messageList: 'chat-messages',
} as const;
```

**2. Define Contract**
```typescript
// demo/src/data/DemoComponentData.ts
export const ChatContract = {
  state: {
    empty: { messages: [] },
    single: { messages: [{ author: 'Alice', text: 'Hi!' }] },
  },
  after: {
    sendMessage: (state, text) => ({
      messages: [...state.messages, { author: 'User', text }]
    }),
  },
} as const;
```

**3. Write Story**
```gherkin
# demo/features/chat.feature
Feature: Chat
  Scenario: Send message
    Given chat state is Components.chat.state.empty
    When I type "Hello" into chat input
    And I click send button
    Then chat state should have 1 message
```

**4. Generate Tests**
```bash
npm run generate:story-tests
# Creates demo/generated/tests/chat.spec.ts
```

**5. Implement Component**
```typescript
// demo/src/components/Chat.tsx
export const Chat = () => {
  const [messages, setMessages] = useState([]);
  
  useTestStateInjection('chat', { messages }, setMessages);
  
  return (
    <div data-testid={Components.chatContainer}>
      <input data-testid={Components.chatInput} />
      <button data-testid={Components.sendButton}>Send</button>
      <ul data-testid={Components.messageList}>
        {messages.map(m => <li>{m.text}</li>)}
      </ul>
    </div>
  );
};
```

**6. Run Tests**
```bash
npx playwright test chat.spec.ts
# ✓ Chat › Send message (523ms)
```

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Read [00_README.md](./00_README.md) - Overview
2. Read this guide (00_GETTING_STARTED.md) - Complete pipeline
3. Read [02_DATA_CONTRACTS.md](./02_DATA_CONTRACTS.md) - Contracts in depth
4. **Try it**: Create a simple counter feature

### Intermediate
5. Read [03_STATE_INTEGRATION.md](./03_STATE_INTEGRATION.md) - State management
6. Read [04_STATE_AWARE_CACHING.md](./04_STATE_AWARE_CACHING.md) - Performance
7. **Try it**: Add chat feature with caching

### Advanced
8. Read [05_IMPLEMENTATION_PLAN.md](./05_IMPLEMENTATION_PLAN.md) - Internal architecture
9. Read [06_TESTING_PLAN.md](./06_TESTING_PLAN.md) - Testing strategy
10. **Try it**: Contribute to the story system

---

## 🚀 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Define component names in `src/names/Components.ts`
- [ ] Define state types in `src/data/ComponentStates.ts`
- [ ] Define contracts in `src/data/DemoComponentData.ts`
- [ ] Write stories in `features/*.feature`
- [ ] Generate tests: `npm run generate:story-tests`
- [ ] Implement components with `useTestStateInjection`
- [ ] Run tests: `npx playwright test`

---

## 🤔 Common Questions

**Q: Why not just write Playwright tests directly?**  
A: Stories are:
- More readable (Gherkin vs code)
- Reusable (same story, multiple test formats)
- Type-safe (contracts vs magic strings)
- AI-friendly (easier to generate/modify)

**Q: Do I need to define contracts for everything?**  
A: No. Only for states you want to reference in stories. Simple components don't need contracts.

**Q: Can I mix contracts and inline data?**  
A: Yes. Use contracts for common states, inline data for one-offs:
```gherkin
Given counter state is Components.counter.state.zero   # Contract
When I set count to 42                                 # Inline
```

**Q: What if my state shape changes?**  
A: Update the contract, TypeScript catches all references that need updating. Stories reference contracts, so they update automatically.

**Q: How does this compare to Cucumber?**  
A: Similar syntax (Gherkin), but:
- Type-safe data contracts (not just strings)
- Automatic test generation (no step definitions)
- State-aware caching (50-80% faster)
- Built-in checkpoint/resume

---

## 📚 Next Steps

- **Understand Contracts**: Read [02_DATA_CONTRACTS.md](./02_DATA_CONTRACTS.md)
- **See Architecture**: Read [01_STORY_SYSTEM_ARCHITECTURE.md](./01_STORY_SYSTEM_ARCHITECTURE.md)
- **Run Demo**: `cd demo && npm run generate:story-tests && npx playwright test`
- **Contribute**: Check [07_IMPLEMENTATION_STATUS.md](./07_IMPLEMENTATION_STATUS.md)

---

**Last Updated**: November 19, 2025  
**Version**: 1.0.0  
**Status**: Complete

