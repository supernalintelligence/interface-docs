---
title: "State Integration"
description: "Bidirectional state flow between data contracts and live components"
category: "Story System"
order: 3
showToc: true
---
# Data Contracts + Component State Integration

**Date**: November 18, 2025  
**Status**: Design  

---

## 🎯 The Connection

**Data Contracts** define test data/expected states.  
**Component State** (from `@Component({ stateful: true })`) is the actual runtime state.

They must integrate bidirectionally:
1. **Write**: Data contracts → Component state (setup)
2. **Read**: Component state → Verify against data contract (assert)

---

## Component State System (Existing)

### Current Implementation

```typescript
// From Component.ts decorator
@Component({
  name: 'counter',
  containerId: 'Examples',
  elementId: Examples.counterWidget,
  stateful: true,  // ← Marks this component as stateful
})
export class CounterComponent {
  private value = 0;  // ← Internal state

  @Tool({ elementId: Examples.counterIncrement })
  increment(amount = 1) {
    this.value += amount;
    this.render();
    return this.value;
  }

  @Tool({ elementId: Examples.counterDecrement })
  decrement(amount = 1) {
    this.value -= amount;
    this.render();
    return this.value;
  }

  // How do we READ this state from tests?
  // How do we SET this state for tests?
}
```

### The Problem

**Stories need to**:
1. ✅ Reference expected state via data contracts
2. ❌ **Set** component state before test steps
3. ❌ **Read** component state for assertions
4. ❌ **Inject** initial state into components

---

## Integration Architecture

### 1. Component State Interface

Every stateful component should expose:
- `getState()`: Read current state
- `setState(state)`: Write new state
- `resetState()`: Reset to initial state

```typescript
// NEW: State management interface
export interface StatefulComponent<TState = any> {
  getState(): TState;
  setState(state: Partial<TState>): void;
  resetState(): void;
}

// Apply to CounterComponent
@Component({
  name: 'counter',
  containerId: 'Examples',
  elementId: Examples.counterWidget,
  stateful: true,
})
export class CounterComponent implements StatefulComponent<CounterState> {
  private state: CounterState = { count: 0 };

  // Expose state accessors
  getState(): CounterState {
    return { ...this.state };
  }

  setState(newState: Partial<CounterState>): void {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  resetState(): void {
    this.state = { count: 0 };
    this.render();
  }

  @Tool({ elementId: Examples.counterIncrement })
  increment(amount = 1) {
    this.state.count += amount;
    this.render();
    return this.state.count;
  }

  @Tool({ elementId: Examples.counterDecrement })
  decrement(amount = 1) {
    this.state.count -= amount;
    this.render();
    return this.state.count;
  }

  private render() {
    // Update UI with current state
    const element = document.querySelector(`[data-testid="${Examples.counterWidget}"]`);
    if (element) {
      element.textContent = `Count: ${this.state.count}`;
    }
  }
}
```

### 2. Component Registry for State Access

**NEW**: Track component instances for state access

```typescript
// core/src/registry/ComponentRegistry.ts

export class ComponentRegistry {
  private static instances = new Map<string, StatefulComponent>();

  /**
   * Register a stateful component instance
   */
  static registerInstance(
    componentName: string, 
    instance: StatefulComponent
  ): void {
    this.instances.set(componentName, instance);
  }

  /**
   * Get component instance
   */
  static getInstance(componentName: string): StatefulComponent | undefined {
    return this.instances.get(componentName);
  }

  /**
   * Get component state
   */
  static getState(componentName: string): any {
    const instance = this.instances.get(componentName);
    if (!instance) {
      throw new Error(`Component not found: ${componentName}`);
    }
    return instance.getState();
  }

  /**
   * Set component state
   */
  static setState(componentName: string, state: any): void {
    const instance = this.instances.get(componentName);
    if (!instance) {
      throw new Error(`Component not found: ${componentName}`);
    }
    instance.setState(state);
  }

  /**
   * Clear all instances (for testing)
   */
  static clear(): void {
    this.instances.clear();
  }
}
```

### 3. Auto-Registration via Decorator

**Update `@Component` decorator** to auto-register instances:

```typescript
// core/src/decorators/Component.ts

export function Component(config: ComponentConfig) {
  return function <T extends { new(...args: any[]): any }>(constructor: T) {
    // Existing registration logic...
    
    // NEW: Auto-register instance if stateful
    if (config.stateful) {
      // Wrap constructor to register instance
      return class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          
          // Register this instance
          if ('getState' in this && 'setState' in this) {
            ComponentRegistry.registerInstance(
              config.name,
              this as StatefulComponent
            );
            
            console.log(`📦 Registered stateful component: ${config.name}`);
          }
        }
      } as T;
    }

    return constructor;
  };
}
```

---

## Story Executor Integration

### Reading & Writing Component State

```typescript
// core/src/stories/StoryExecutor.ts

export class StoryExecutor {
  private cache: StoryCache;
  private page: Page;
  private componentStates: Map<string, any>; // Local state tracking

  /**
   * Execute step with state management
   */
  async executeStepWithState(node: StoryNode): Promise<StepResult> {
    const { step } = node;

    try {
      // 1. SET UP STATE from data contract
      if (step.stateReference && step.type === 'Given') {
        await this.setComponentState(step);
      }

      // 2. EXECUTE ACTION
      if (step.action) {
        await this.executeAction(step);
      }

      // 3. ASSERT STATE against data contract
      if (step.stateReference && step.type === 'Then') {
        await this.assertComponentState(step);
      }

      return { success: true, duration: 0, timestamp: new Date().toISOString() };
    } catch (error: any) {
      return { success: false, duration: 0, error, timestamp: new Date().toISOString() };
    }
  }

  /**
   * Set component state from data contract
   */
  private async setComponentState(step: ParsedStep): Promise<void> {
    const component = this.extractComponentFromReference(step.stateReference!);
    const stateData = step.stateData;

    console.log(`  📦 Setting state for "${component}" from ${step.stateReference}`);
    console.log(`     State:`, stateData);

    // Option 1: Set via ComponentRegistry (if component is instantiated)
    try {
      ComponentRegistry.setState(component, stateData);
      console.log(`     ✅ Set via ComponentRegistry`);
    } catch (error) {
      console.log(`     ⚠️ ComponentRegistry unavailable, using browser injection`);
      
      // Option 2: Inject via browser (for React/Vue components)
      await this.injectStateViaBrowser(component, stateData);
    }

    // Track locally for assertions
    this.componentStates.set(component, stateData);
  }

  /**
   * Inject state into browser for React/Vue components
   */
  private async injectStateViaBrowser(component: string, state: any): Promise<void> {
    await this.page.evaluate(({ component, state }) => {
      // Create global test state registry
      if (!window.__testState__) {
        window.__testState__ = {};
      }
      
      window.__testState__[component] = state;
      
      // Dispatch custom event to notify component
      window.dispatchEvent(new CustomEvent('test:setState', {
        detail: { component, state }
      }));
      
      console.log(`[Browser] Set state for "${component}":`, state);
    }, { component, state });

    // Wait for state to be applied
    await this.page.waitForTimeout(100);
  }

  /**
   * Assert component state matches data contract
   */
  private async assertComponentState(step: ParsedStep): Promise<void> {
    const component = this.extractComponentFromReference(step.stateReference!);
    const expectedState = step.stateData;

    console.log(`  ✅ Asserting state for "${component}"`);
    console.log(`     Expected (${step.stateReference}):`, expectedState);

    // Option 1: Read from ComponentRegistry
    let actualState: any;
    try {
      actualState = ComponentRegistry.getState(component);
      console.log(`     Actual (from ComponentRegistry):`, actualState);
    } catch (error) {
      console.log(`     ⚠️ ComponentRegistry unavailable, reading from browser`);
      
      // Option 2: Read from browser
      actualState = await this.readStateFromBrowser(component);
      console.log(`     Actual (from browser):`, actualState);
    }

    // Assert equality
    expect(actualState).toEqual(expectedState);
  }

  /**
   * Read state from browser
   */
  private async readStateFromBrowser(component: string): Promise<any> {
    return await this.page.evaluate((component) => {
      // Try to read from global test state
      if (window.__testState__?.[component]) {
        return window.__testState__[component];
      }

      // Try to read from component's data attribute
      const element = document.querySelector(`[data-testid*="${component}"]`);
      if (element?.dataset?.state) {
        return JSON.parse(element.dataset.state);
      }

      // Try to extract from DOM
      return this.extractStateFromDOM(component);
    }, component);
  }

  /**
   * Extract component name from data contract reference
   */
  private extractComponentFromReference(reference: string): string {
    // "Components.Examples.counter.state.zero" → "counter"
    const parts = reference.split('.');
    return parts[2];
  }
}

// Augment window type
declare global {
  interface Window {
    __testState__?: Record<string, any>;
  }
}
```

---

## Component-Side: React/Vue Integration

### React Example

```typescript
// demo/src/components/CounterWidget.tsx

import React, { useState, useEffect } from 'react';
import { Examples } from '../architecture/DemoComponentNames';

export function CounterWidget() {
  const [count, setCount] = useState(0);

  // Listen for test state injection
  useEffect(() => {
    const handleTestState = (event: CustomEvent) => {
      if (event.detail.component === 'counter') {
        console.log('[React] Received test state:', event.detail.state);
        setCount(event.detail.state.count);
      }
    };

    window.addEventListener('test:setState', handleTestState as EventListener);
    
    // Check for initial test state
    if (window.__testState__?.counter) {
      setCount(window.__testState__.counter.count);
    }

    return () => {
      window.removeEventListener('test:setState', handleTestState as EventListener);
    };
  }, []);

  // Expose state to tests via data attribute
  useEffect(() => {
    const element = document.querySelector(`[data-testid="${Examples.counterWidget}"]`);
    if (element) {
      element.setAttribute('data-state', JSON.stringify({ count }));
    }
  }, [count]);

  return (
    <div data-testid={Examples.counterWidget} data-state={JSON.stringify({ count })}>
      <div>Count: {count}</div>
      <button 
        data-testid={Examples.counterIncrement}
        onClick={() => setCount(c => c + 1)}
      >
        Increment
      </button>
      <button 
        data-testid={Examples.counterDecrement}
        onClick={() => setCount(c => c - 1)}
      >
        Decrement
      </button>
      <button 
        data-testid={Examples.counterReset}
        onClick={() => setCount(0)}
      >
        Reset
      </button>
    </div>
  );
}
```

---

## Complete Flow Example

### Gherkin Story

```gherkin
Feature: Counter Component State Management

  Scenario: Set initial state and verify
    Given I navigate to "/examples"
    And counter state is Components.Examples.counter.state.five
    When Components.Examples.counterWidget is visible
    Then counter state should be Components.Examples.counter.state.five
    And Components.Examples.counterWidget should contain "Count: 5"

  Scenario: State transitions
    Given counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    Then counter state should be Components.Examples.counter.state.two
```

### Execution Flow

```
1. Parser: "counter state is Components.Examples.counter.state.five"
   → resolveDataContract() → { count: 5 }

2. Executor: setComponentState()
   → Try ComponentRegistry.setState('counter', { count: 5 })
   → If unavailable: injectStateViaBrowser()

3. Browser: Receives state injection
   → window.__testState__.counter = { count: 5 }
   → Dispatches 'test:setState' event
   → React component updates: setCount(5)

4. Execute: Click increment button
   → React: setCount(6)
   → Updates data-state attribute

5. Assert: "state should be Components.Examples.counter.state.six"
   → resolveDataContract() → { count: 6 }
   → Read actual state:
      - ComponentRegistry.getState('counter') OR
      - readStateFromBrowser() → window.__testState__.counter
   → expect(actualState).toEqual({ count: 6 })
```

---

## Data Contract + State Contract

### Combined System

```typescript
// core/src/architecture/DemoComponentData.ts

export interface CounterState {
  count: number;
}

export const ExamplesData = {
  counter: {
    // Named states (data contracts)
    state: {
      zero: { count: 0 } satisfies CounterState,
      one: { count: 1 } satisfies CounterState,
      two: { count: 2 } satisfies CounterState,
      five: { count: 5 } satisfies CounterState,
      ten: { count: 10 } satisfies CounterState,
    },
    
    // State transitions (for executor to apply)
    transitions: {
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
    
    // Validation helpers
    validate: (state: any): state is CounterState => {
      return typeof state === 'object' &&
             typeof state.count === 'number';
    },
  },
} as const;

// Export for type inference
export type CounterStateContract = typeof ExamplesData.counter;
```

---

## Implementation Checklist

### Phase 1: State Interface
- [ ] Define `StatefulComponent<TState>` interface
- [ ] Add `getState()`, `setState()`, `resetState()` to components
- [ ] Update `CounterComponent` to implement interface

### Phase 2: Component Registry
- [ ] Create `ComponentRegistry` class
- [ ] Add `registerInstance()`, `getInstance()`, `getState()`, `setState()`
- [ ] Update `@Component` decorator to auto-register stateful components

### Phase 3: Executor Integration
- [ ] Add `setComponentState()` to executor
- [ ] Add `assertComponentState()` to executor
- [ ] Add `injectStateViaBrowser()` for React/Vue
- [ ] Add `readStateFromBrowser()` for assertions

### Phase 4: Component-Side Integration
- [ ] Add test state listener to React components
- [ ] Expose state via `data-state` attribute
- [ ] Add `window.__testState__` global
- [ ] Test state injection works

### Phase 5: Testing
- [ ] Write story with state setup
- [ ] Test ComponentRegistry path
- [ ] Test browser injection path
- [ ] Test state assertions
- [ ] Verify 100% test pass rate

---

## Summary

### The Integration Points

1. **Data Contracts** (Static) → Define expected states
2. **Component State** (Runtime) → Actual component state
3. **ComponentRegistry** → Bridge between tests and components
4. **Browser Injection** → Fallback for React/Vue components

### Bidirectional Flow

```
Data Contract → StoryExecutor → ComponentRegistry → Component Instance
                                      ↓
                               Browser Injection → React setState

Component Instance → ComponentRegistry → StoryExecutor → Assert vs Data Contract
                            ↓
                  Read from DOM/window → StoryExecutor
```

This design enables **programmatic state management** while remaining **framework-agnostic**! 🚀

