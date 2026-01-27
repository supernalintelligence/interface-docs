---
title: "Data Contracts"
description: "Type-safe, programmatic state references replacing magic strings in Gherkin"
category: "Story System"
order: 2
showToc: true
---
# Data Contract System

**Version**: 1.0  
**Date**: November 18, 2025  
**Status**: Design Proposal  

---

## 🎯 Core Principle

> **Data/State is referenced programmatically, just like component names.**

Instead of inline data tables or magic values:
```gherkin
❌ BAD:
Given counter state is:
  | count |
  | 0     |
```

Use **Data Contracts** with dot-notation references:
```gherkin
✅ GOOD:
Given counter state is:
  Components.Examples.counter.state.zero
```

---

## Architecture

### Name Contracts (Existing)
```typescript
// For UI element references
export const Examples = {
  counterWidget: 'examples-counter-widget',
  counterIncrement: 'examples-counter-increment',
  counterDecrement: 'examples-counter-decrement',
  counterReset: 'examples-counter-reset',
} as const;
```

### Data Contracts (NEW)
```typescript
// For component state/data references
export const ExamplesData = {
  counter: {
    // Initial states
    state: {
      zero: { count: 0 } as CounterState,
      one: { count: 1 } as CounterState,
      five: { count: 5 } as CounterState,
      ten: { count: 10 } as CounterState,
    },
    
    // State transitions (expected results)
    after: {
      increment: (prev: CounterState) => ({ count: prev.count + 1 }),
      decrement: (prev: CounterState) => ({ count: prev.count - 1 }),
      reset: () => ({ count: 0 }),
    },
    
    // Test data sets
    testCases: {
      basic: {
        start: { count: 0 },
        expected: { count: 1 },
      },
      multiple: [
        { start: { count: 0 }, clicks: 3, expected: { count: 3 } },
        { start: { count: 5 }, clicks: 2, expected: { count: 7 } },
      ],
    },
  },
  
  // Other components...
  chat: {
    state: {
      empty: { messages: [] } as ChatState,
      withMessages: { messages: [
        { id: '1', text: 'Hello', sender: 'user' },
        { id: '2', text: 'Hi there!', sender: 'assistant' },
      ]} as ChatState,
    },
    
    testCases: {
      sendMessage: {
        input: 'Test message',
        expected: { messages: [{ id: expect.any(String), text: 'Test message', sender: 'user' }] },
      },
    },
  },
} as const;

// Type inference
export type CounterState = typeof ExamplesData.counter.state.zero;
export type ChatState = typeof ExamplesData.chat.state.empty;
```

---

## Directory Structure

```
@supernal-interface/core/
├── src/
│   ├── architecture/
│   │   ├── ComponentNames.ts       # UI element references (existing)
│   │   ├── DemoComponentData.ts        # NEW: State/data references
│   │   └── index.ts                    # Export both
```

---

## Gherkin Usage

### Simple State Reference

```gherkin
Feature: Counter Component

  Scenario: Increment from zero
    Given I navigate to "/examples"
    And Components.Examples.counterWidget is visible
    And counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    Then counter state should be Components.Examples.counter.state.one
```

### State Transitions

```gherkin
  Scenario: State persistence across actions
    Given counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    And I click Components.Examples.counterDecrement
    Then counter state should be Components.Examples.counter.state.one
```

### Multiple Test Cases (Scenario Outline)

```gherkin
  Scenario Outline: Increment multiple times
    Given counter state is <startState>
    When I click Components.Examples.counterIncrement <times> times
    Then counter state should be <endState>
    
    Examples:
      | startState                                 | times | endState                                  |
      | Components.Examples.counter.state.zero     | 1     | Components.Examples.counter.state.one     |
      | Components.Examples.counter.state.zero     | 3     | Components.Examples.counter.state.ten     |
      | Components.Examples.counter.state.five     | 2     | Components.Examples.counter.state.seven   |
```

### Complex Data (Chat Example)

```gherkin
Feature: Chat Component

  Scenario: Send message to empty chat
    Given chat state is Components.Examples.chat.state.empty
    When I type "Hello" into Components.Examples.chatInput
    And I click Components.Examples.chatSend
    Then chat state should match Components.Examples.chat.testCases.sendMessage.expected
```

---

## StoryParser Integration

### Parsing Data References

```typescript
export class StoryParser {
  /**
   * Resolve data contract reference
   */
  static resolveDataContract(reference: string): any {
    // "Components.Examples.counter.state.zero"
    //  ^^^^^^^^^^^^^^^^ ^^^^^^^ ^^^^^ ^^^^
    //  namespace        comp    type  name
    
    const parts = reference.split('.');
    
    // Validate starts with "Components"
    if (parts[0] !== 'Components') {
      throw new Error(`Data contract must start with "Components", got: ${reference}`);
    }
    
    // Remove "Components" prefix
    parts.shift();
    
    // Import the data contract
    const namespace = parts[0]; // "Examples"
    const DataContract = this.loadDataContract(namespace);
    
    // Navigate the path
    let current: any = DataContract;
    for (let i = 1; i < parts.length; i++) {
      if (!(parts[i] in current)) {
        throw new Error(`Invalid data contract path: ${reference} (failed at ${parts[i]})`);
      }
      current = current[parts[i]];
    }
    
    return current;
  }
  
  /**
   * Load data contract by namespace
   */
  private static loadDataContract(namespace: string): any {
    switch (namespace) {
      case 'Examples':
        return ExamplesData;
      default:
        throw new Error(`Unknown data contract namespace: ${namespace}`);
    }
  }
  
  /**
   * Parse step with data contract reference
   */
  static parseStep(step: GherkinStep): ParsedStep {
    const parsed: ParsedStep = {
      type: step.keyword.trim() as any,
      text: step.text,
      lineNumber: step.location.line,
    };
    
    // Check for data contract reference
    const dataRefMatch = step.text.match(/Components\.[A-Za-z0-9.]+/);
    if (dataRefMatch) {
      const reference = dataRefMatch[0];
      
      // Is it a state reference?
      if (step.text.includes('state is') || step.text.includes('state should be')) {
        parsed.stateReference = reference;
        parsed.stateData = this.resolveDataContract(reference);
      }
    }
    
    return parsed;
  }
}

interface ParsedStep {
  type: 'Given' | 'When' | 'Then' | 'And' | 'But';
  text: string;
  lineNumber: number;
  
  // Component reference (for actions)
  component?: string;
  componentPath?: string;
  action?: string;
  value?: string;
  
  // NEW: Data contract reference
  stateReference?: string;      // "Components.Examples.counter.state.zero"
  stateData?: any;              // Resolved: { count: 0 }
}
```

---

## Type Safety

### Strongly Typed Data Contracts

```typescript
// core/src/architecture/DemoComponentData.ts

export interface CounterState {
  count: number;
}

export interface ChatState {
  messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'assistant';
  }>;
}

export const ExamplesData = {
  counter: {
    state: {
      zero: { count: 0 } satisfies CounterState,
      one: { count: 1 } satisfies CounterState,
      five: { count: 5 } satisfies CounterState,
      ten: { count: 10 } satisfies CounterState,
    },
    
    after: {
      increment: (prev: CounterState): CounterState => ({ 
        count: prev.count + 1 
      }),
      decrement: (prev: CounterState): CounterState => ({ 
        count: prev.count - 1 
      }),
      reset: (): CounterState => ({ 
        count: 0 
      }),
    },
  },
  
  chat: {
    state: {
      empty: { messages: [] } satisfies ChatState,
      withMessages: { 
        messages: [
          { id: '1', text: 'Hello', sender: 'user' as const },
          { id: '2', text: 'Hi!', sender: 'assistant' as const },
        ] 
      } satisfies ChatState,
    },
  },
} as const;

// Type exports
export type CounterStateContract = typeof ExamplesData.counter;
export type ChatStateContract = typeof ExamplesData.chat;
```

### Compile-Time Validation

```typescript
// ✅ Valid - TypeScript will check this
const validState: CounterState = ExamplesData.counter.state.zero;

// ❌ Invalid - TypeScript error
const invalidState: CounterState = { count: 'not a number' }; // Error!

// ✅ Type-safe transitions
const nextState = ExamplesData.counter.after.increment(validState);
// nextState is inferred as CounterState
```

---

## Naming Patterns

### Data Contract Naming Convention

```
Components.<Namespace>.<Component>.<Type>.<Name>

Where:
  Namespace: Examples, Pages, Widgets, etc.
  Component: counter, chat, settings, etc.
  Type:      state, testCases, fixtures, after, etc.
  Name:      zero, empty, basic, increment, etc.
```

### Examples

```
✅ State references:
Components.Examples.counter.state.zero
Components.Examples.counter.state.ten
Components.Pages.chat.state.empty
Components.Pages.chat.state.withMessages

✅ Transition references:
Components.Examples.counter.after.increment
Components.Examples.counter.after.reset

✅ Test case references:
Components.Examples.counter.testCases.basic
Components.Pages.chat.testCases.sendMessage

❌ Invalid (doesn't start with Components):
ExamplesData.counter.state.zero

❌ Invalid (missing namespace):
Components.counter.state.zero

❌ Invalid (typo):
Components.Examples.counterr.state.zero  // Will fail at runtime with clear error
```

---

## StoryExecutor Integration

### Using Data Contracts in Execution

```typescript
export class StoryExecutor {
  private componentStates: Map<string, any>;

  async executeStepWithState(node: StoryNode): Promise<StepResult> {
    const { step } = node;

    // 1. Set up state from data contract reference
    if (step.stateReference && step.stateData) {
      const component = this.extractComponentFromReference(step.stateReference);
      console.log(`  📦 Setting state for ${component} from ${step.stateReference}`);
      this.componentStates.set(component, step.stateData);
    }

    // 2. Execute action (if any)
    if (step.action) {
      await this.executeAction(step);
      
      // Update state using transition
      if (node.stateTransition) {
        const component = step.component!;
        const currentState = this.componentStates.get(component);
        const newState = node.stateTransition.transformState(currentState);
        this.componentStates.set(component, newState);
      }
    }

    // 3. Assert state matches data contract reference
    if (step.stateReference && step.type === 'Then') {
      const component = this.extractComponentFromReference(step.stateReference);
      const actualState = this.componentStates.get(component);
      const expectedState = step.stateData;
      
      console.log(`  ✅ Asserting state for ${component}:`);
      console.log(`     Expected (${step.stateReference}):`, expectedState);
      console.log(`     Actual:`, actualState);
      
      expect(actualState).toEqual(expectedState);
    }

    return { success: true, duration: 0, timestamp: new Date().toISOString() };
  }

  /**
   * Extract component name from data contract reference
   */
  private extractComponentFromReference(reference: string): string {
    // "Components.Examples.counter.state.zero" → "counter"
    const parts = reference.split('.');
    return parts[2]; // [Components, Examples, counter, ...]
  }
}
```

---

## GraphTestGenerator Integration

### Generating Tests with Data Contracts

```typescript
export class GraphTestGenerator {
  private static generateStepCode(node: StoryNode): string {
    let code = `    // ${node.step.type}: ${node.step.text}\n`;

    // State setup from data contract
    if (node.step.stateReference && node.step.type === 'Given') {
      const component = this.extractComponentFromReference(node.step.stateReference);
      code += `    // State setup from: ${node.step.stateReference}\n`;
      code += `    componentStates.set('${component}', ExamplesData.${this.getReferencePathForImport(node.step.stateReference)});\n`;
    }

    // Action execution
    if (node.step.action) {
      code += this.generateActionCode(node);
    }

    // State assertion from data contract
    if (node.step.stateReference && node.step.type === 'Then') {
      const component = this.extractComponentFromReference(node.step.stateReference);
      code += `    // State assertion from: ${node.step.stateReference}\n`;
      code += `    expect(componentStates.get('${component}')).toEqual(ExamplesData.${this.getReferencePathForImport(node.step.stateReference)});\n`;
    }

    return code + '\n';
  }

  /**
   * Convert "Components.Examples.counter.state.zero" 
   * to "counter.state.zero" for import
   */
  private static getReferencePathForImport(reference: string): string {
    const parts = reference.split('.');
    return parts.slice(2).join('.'); // Skip "Components.Examples"
  }

  /**
   * Generate imports
   */
  private static generateImports(): string {
    return `
import { test, expect } from '@playwright/test';
import { testId } from '@supernal-interface/core/testing';
import { Examples, ExamplesData } from '../../../src/architecture/ComponentNames';

test.describe('Counter Stories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples');
  });
`;
  }
}
```

---

## Example: Complete Story with Data Contracts

```gherkin
Feature: Counter Component

  Background:
    Given I navigate to "/examples"
    And Components.Examples.counterWidget is visible

  Scenario: Increment from zero
    Given counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    Then counter state should be Components.Examples.counter.state.one
    And Components.Examples.counterWidget should contain "Count: 1"

  Scenario: State persistence across actions
    Given counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    And I click Components.Examples.counterDecrement
    Then counter state should be Components.Examples.counter.state.one

  Scenario: Reset from non-zero state
    Given counter state is Components.Examples.counter.state.five
    When I click Components.Examples.counterReset
    Then counter state should be Components.Examples.counter.state.zero

  Scenario Outline: Multiple increments
    Given counter state is <startState>
    When I click Components.Examples.counterIncrement <times> times
    Then counter state should be <endState>
    
    Examples:
      | startState                                | times | endState                                 |
      | Components.Examples.counter.state.zero    | 1     | Components.Examples.counter.state.one    |
      | Components.Examples.counter.state.zero    | 5     | Components.Examples.counter.state.five   |
      | Components.Examples.counter.state.five    | 5     | Components.Examples.counter.state.ten    |
```

---

## Benefits

### ✅ Type Safety
- Data contracts are strongly typed
- Compile-time errors for typos or wrong types
- Refactor-safe (rename detection)

### ✅ No Magic Strings
- `Components.Examples.counter.state.zero` is a programmatic reference
- Not a string lookup at runtime
- IDE autocomplete works

### ✅ Reusable Test Data
- Define once, use in multiple stories
- Consistent across test suite
- Easy to update (change in one place)

### ✅ Documentation
- Data contracts serve as documentation
- Easy to see all available states
- Type signatures explain data structure

### ✅ Validation
- Parser validates data contract references exist
- Runtime errors are clear: "Invalid data contract: Components.Examples.counter.state.zeroo"

---

## Implementation Checklist

### Phase 1: Core System
- [ ] Create `DemoComponentData.ts` with state interfaces
- [ ] Define data contracts for existing components (counter)
- [ ] Add `resolveDataContract()` to `StoryParser`
- [ ] Update `ParsedStep` interface to include `stateReference` and `stateData`
- [ ] Write unit tests for data contract resolution

### Phase 2: Executor Integration
- [ ] Update `StoryExecutor` to use data contracts for state setup
- [ ] Update `StoryExecutor` to use data contracts for state assertions
- [ ] Add `extractComponentFromReference()` helper
- [ ] Write integration tests for execution with data contracts

### Phase 3: Generator Integration
- [ ] Update `GraphTestGenerator` to import `ExamplesData`
- [ ] Generate state setup code using data contracts
- [ ] Generate state assertion code using data contracts
- [ ] Ensure generated tests are type-safe

### Phase 4: Example Stories
- [ ] Create `counter-with-data-contracts.feature`
- [ ] Test execution with data contracts
- [ ] Test generated tests with data contracts
- [ ] Verify 100% test pass rate

### Phase 5: Documentation
- [ ] Document data contract patterns
- [ ] Create naming convention guide
- [ ] Add examples for different component types
- [ ] Update README with data contract usage

---

## Next Steps

1. ✅ Review this design
2. ⏭️ Implement `DemoComponentData.ts`
3. ⏭️ Update `StoryParser` with `resolveDataContract()`
4. ⏭️ Create example story using data contracts
5. ⏭️ Test execution
6. ⏭️ Update graph generator

**Ready to implement:** YES ✅

This design is **consistent with name contracts**, **type-safe**, and **eliminates magic strings/inline data**! 🚀

