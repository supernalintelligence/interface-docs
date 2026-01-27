---
title: "Testing Plan"
description: "TDD strategy with unit, integration, and E2E tests for each implementation phase"
category: "Story System"
order: 6
showToc: true
---

# Story System Testing Plan

**Date**: November 18, 2025  
**Status**: Complete Testing Strategy  

---

## 🎯 Testing Strategy Overview

Each implementation phase has **3 levels of testing**:
1. **Unit Tests** - Test individual functions/classes in isolation
2. **Integration Tests** - Test components working together
3. **E2E Tests** - Test complete user flows

**Test-Driven Development (TDD)**: Write tests BEFORE implementation.

---

## Week 1: Data Contract Testing

### Unit Tests - Data Contract Resolution

**File**: `core/tests/stories/StoryParser.dataContracts.test.ts`

```typescript
import { StoryParser } from '../../src/stories/StoryParser';
import { ExamplesData } from '../../src/architecture/DemoComponentData';

describe('StoryParser - Data Contract Resolution', () => {
  describe('resolveDataContract()', () => {
    it('should resolve valid counter state reference', () => {
      const reference = 'Components.Examples.counter.state.zero';
      const result = StoryParser.resolveDataContract(reference);
      
      expect(result).toEqual({ count: 0 });
    });

    it('should resolve nested state references', () => {
      const reference = 'Components.Examples.counter.state.five';
      const result = StoryParser.resolveDataContract(reference);
      
      expect(result).toEqual({ count: 5 });
    });

    it('should throw error for invalid namespace', () => {
      const reference = 'InvalidNamespace.counter.state.zero';
      
      expect(() => {
        StoryParser.resolveDataContract(reference);
      }).toThrow('Data contract must start with "Components"');
    });

    it('should throw error for missing component', () => {
      const reference = 'Components.Examples.nonexistent.state.zero';
      
      expect(() => {
        StoryParser.resolveDataContract(reference);
      }).toThrow('Invalid data contract path');
    });

    it('should throw error for missing state', () => {
      const reference = 'Components.Examples.counter.state.nonexistent';
      
      expect(() => {
        StoryParser.resolveDataContract(reference);
      }).toThrow('Invalid data contract path');
    });

    it('should handle transition references', () => {
      const reference = 'Components.Examples.counter.after.increment';
      const result = StoryParser.resolveDataContract(reference);
      
      expect(typeof result).toBe('function');
      const newState = result({ count: 5 });
      expect(newState).toEqual({ count: 6 });
    });
  });

  describe('parseStep() with data contracts', () => {
    it('should parse "Given state is" step', () => {
      const step = {
        keyword: 'Given ',
        text: 'counter state is Components.Examples.counter.state.zero',
        location: { line: 1 },
      };

      const parsed = StoryParser.parseStep(step);

      expect(parsed.stateReference).toBe('Components.Examples.counter.state.zero');
      expect(parsed.stateData).toEqual({ count: 0 });
    });

    it('should parse "Then state should be" step', () => {
      const step = {
        keyword: 'Then ',
        text: 'counter state should be Components.Examples.counter.state.one',
        location: { line: 5 },
      };

      const parsed = StoryParser.parseStep(step);

      expect(parsed.stateReference).toBe('Components.Examples.counter.state.one');
      expect(parsed.stateData).toEqual({ count: 1 });
    });
  });
});
```

### Integration Tests - Data Contracts + Components

**File**: `core/tests/architecture/DataContracts.integration.test.ts`

```typescript
import { ExamplesData, CounterState } from '../../src/architecture/DemoComponentData';

describe('Data Contracts Integration', () => {
  describe('Type Safety', () => {
    it('should satisfy CounterState interface', () => {
      const state: CounterState = ExamplesData.counter.state.zero;
      expect(state.count).toBe(0);
    });

    it('should enforce state structure at compile time', () => {
      // This should compile
      const validState: CounterState = { count: 10 };
      expect(validState.count).toBe(10);

      // @ts-expect-error - Invalid structure
      const invalidState: CounterState = { notCount: 10 };
    });
  });

  describe('State Transitions', () => {
    it('should apply increment transition', () => {
      const initial = ExamplesData.counter.state.zero;
      const next = ExamplesData.counter.after.increment(initial);
      
      expect(next).toEqual({ count: 1 });
    });

    it('should apply multiple transitions', () => {
      let state = ExamplesData.counter.state.zero;
      
      state = ExamplesData.counter.after.increment(state);
      expect(state.count).toBe(1);
      
      state = ExamplesData.counter.after.increment(state);
      expect(state.count).toBe(2);
      
      state = ExamplesData.counter.after.decrement(state);
      expect(state.count).toBe(1);
    });

    it('should reset to zero', () => {
      const initial = ExamplesData.counter.state.five;
      const reset = ExamplesData.counter.after.reset();
      
      expect(reset).toEqual({ count: 0 });
    });
  });
});
```

**Success Criteria**:
- [ ] All data contract resolution tests pass
- [ ] Type errors are caught at compile time
- [ ] Clear error messages for invalid references
- [ ] State transitions work correctly

---

## Week 2: State Integration Testing

### Unit Tests - ComponentRegistry

**File**: `core/tests/registry/ComponentRegistry.test.ts`

```typescript
import { ComponentRegistry } from '../../src/registry/ComponentRegistry';
import { StatefulComponent } from '../../src/interfaces/StatefulComponent';

interface TestState {
  value: number;
}

class TestComponent implements StatefulComponent<TestState> {
  private state: TestState = { value: 0 };

  getState(): TestState {
    return { ...this.state };
  }

  setState(newState: Partial<TestState>): void {
    this.state = { ...this.state, ...newState };
  }

  resetState(): void {
    this.state = { value: 0 };
  }
}

describe('ComponentRegistry', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  describe('registerInstance()', () => {
    it('should register a component instance', () => {
      const instance = new TestComponent();
      ComponentRegistry.registerInstance('test', instance);

      const retrieved = ComponentRegistry.getInstance('test');
      expect(retrieved).toBe(instance);
    });

    it('should overwrite existing registration', () => {
      const instance1 = new TestComponent();
      const instance2 = new TestComponent();

      ComponentRegistry.registerInstance('test', instance1);
      ComponentRegistry.registerInstance('test', instance2);

      const retrieved = ComponentRegistry.getInstance('test');
      expect(retrieved).toBe(instance2);
    });
  });

  describe('getState()', () => {
    it('should get component state', () => {
      const instance = new TestComponent();
      instance.setState({ value: 42 });
      ComponentRegistry.registerInstance('test', instance);

      const state = ComponentRegistry.getState('test');
      expect(state).toEqual({ value: 42 });
    });

    it('should throw error for non-existent component', () => {
      expect(() => {
        ComponentRegistry.getState('nonexistent');
      }).toThrow('Component not found: nonexistent');
    });
  });

  describe('setState()', () => {
    it('should set component state', () => {
      const instance = new TestComponent();
      ComponentRegistry.registerInstance('test', instance);

      ComponentRegistry.setState('test', { value: 99 });

      expect(instance.getState()).toEqual({ value: 99 });
    });

    it('should throw error for non-existent component', () => {
      expect(() => {
        ComponentRegistry.setState('nonexistent', { value: 1 });
      }).toThrow('Component not found: nonexistent');
    });
  });

  describe('clear()', () => {
    it('should clear all registrations', () => {
      const instance = new TestComponent();
      ComponentRegistry.registerInstance('test', instance);

      ComponentRegistry.clear();

      const retrieved = ComponentRegistry.getInstance('test');
      expect(retrieved).toBeUndefined();
    });
  });
});
```

### Integration Tests - Component Decorator + Registry

**File**: `core/tests/decorators/Component.registry.integration.test.ts`

```typescript
import { Component } from '../../src/decorators/Component';
import { Tool } from '../../src/decorators/Tool';
import { ComponentRegistry } from '../../src/registry/ComponentRegistry';
import { StatefulComponent } from '../../src/interfaces/StatefulComponent';

interface CounterState {
  count: number;
}

@Component({
  name: 'testCounter',
  containerId: 'test',
  elementId: 'test-counter',
  stateful: true,
})
class TestCounterComponent implements StatefulComponent<CounterState> {
  private state: CounterState = { count: 0 };

  getState(): CounterState {
    return { ...this.state };
  }

  setState(newState: Partial<CounterState>): void {
    this.state = { ...this.state, ...newState };
  }

  resetState(): void {
    this.state = { count: 0 };
  }

  @Tool({ elementId: 'test-increment' })
  increment() {
    this.state.count++;
  }
}

describe('Component Decorator + Registry Integration', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  it('should auto-register stateful component', () => {
    const instance = new TestCounterComponent();

    const registered = ComponentRegistry.getInstance('testCounter');
    expect(registered).toBe(instance);
  });

  it('should read state via registry', () => {
    const instance = new TestCounterComponent();
    instance.setState({ count: 5 });

    const state = ComponentRegistry.getState('testCounter');
    expect(state).toEqual({ count: 5 });
  });

  it('should write state via registry', () => {
    const instance = new TestCounterComponent();

    ComponentRegistry.setState('testCounter', { count: 10 });

    expect(instance.getState()).toEqual({ count: 10 });
  });
});
```

### E2E Tests - Browser State Injection

**File**: `core/demo/tests/integration/state-injection.e2e.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { testId } from '@supernal-interface/core/testing';
import { Examples } from '../../../src/architecture/ComponentNames';

test.describe('Browser State Injection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should inject initial state via window.__testState__', async ({ page }) => {
    // Inject state before component renders
    await page.evaluate(() => {
      window.__testState__ = {
        counter: { count: 5 }
      };
    });

    // Wait for component to read state
    await page.waitForTimeout(100);

    // Verify component shows injected state
    const widget = page.locator(testId(Examples.counterWidget)).first();
    await expect(widget).toContainText('Count: 5');
  });

  test('should update state via custom event', async ({ page }) => {
    // Ensure component is loaded
    const widget = page.locator(testId(Examples.counterWidget)).first();
    await widget.waitFor({ state: 'visible' });

    // Inject new state via event
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('test:setState', {
        detail: {
          component: 'counter',
          state: { count: 10 }
        }
      }));
    });

    // Wait for state to apply
    await page.waitForTimeout(100);

    // Verify component updated
    await expect(widget).toContainText('Count: 10');
  });

  test('should read state from data-state attribute', async ({ page }) => {
    const widget = page.locator(testId(Examples.counterWidget)).first();
    await widget.waitFor({ state: 'visible' });

    // Click increment
    await page.locator(testId(Examples.counterIncrement)).first().click();
    await page.waitForTimeout(100);

    // Read state from attribute
    const stateAttr = await widget.getAttribute('data-state');
    const state = JSON.parse(stateAttr!);

    expect(state).toEqual({ count: 1 });
  });
});
```

**Success Criteria**:
- [ ] ComponentRegistry tests pass (100%)
- [ ] Component decorator auto-registers stateful components
- [ ] State can be read/written via registry
- [ ] Browser state injection works in E2E tests
- [ ] Data-state attribute is readable

---

## Week 3: State-Aware Caching Testing

### Unit Tests - State Hashing

**File**: `core/tests/stories/StoryCache.hashing.test.ts`

```typescript
import { StoryGraphBuilder } from '../../src/stories/StoryGraphBuilder';
import { StoryCache } from '../../src/stories/StoryCache';

describe('State-Aware Hashing', () => {
  describe('hashState()', () => {
    it('should produce same hash for same state', () => {
      const state1 = { count: 5 };
      const state2 = { count: 5 };

      const hash1 = StoryCache.prototype['hashState'](state1);
      const hash2 = StoryCache.prototype['hashState'](state2);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different states', () => {
      const state1 = { count: 0 };
      const state2 = { count: 5 };

      const hash1 = StoryCache.prototype['hashState'](state1);
      const hash2 = StoryCache.prototype['hashState'](state2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle null state', () => {
      const hash = StoryCache.prototype['hashState'](null);
      expect(hash).toBe('null');
    });

    it('should handle nested state', () => {
      const state = {
        user: { id: 1, name: 'Alice' },
        count: 5
      };

      const hash = StoryCache.prototype['hashState'](state);
      expect(hash).toHaveLength(8);
    });
  });

  describe('generateCacheKey()', () => {
    it('should include component, state hash, and action', () => {
      const node = {
        component: 'counter',
        stateBefore: { count: 0 },
        step: { action: 'increment' }
      };

      const key = StoryCache.prototype['generateCacheKey'](node);

      expect(key).toMatch(/^counter-[a-f0-9]{8}-increment$/);
    });

    it('should produce different keys for different states', () => {
      const node1 = {
        component: 'counter',
        stateBefore: { count: 0 },
        step: { action: 'increment' }
      };

      const node2 = {
        component: 'counter',
        stateBefore: { count: 5 },
        step: { action: 'increment' }
      };

      const key1 = StoryCache.prototype['generateCacheKey'](node1);
      const key2 = StoryCache.prototype['generateCacheKey'](node2);

      expect(key1).not.toBe(key2);
    });
  });
});
```

### Integration Tests - Cache with State

**File**: `core/tests/stories/StoryCache.integration.test.ts`

```typescript
import { StoryCache } from '../../src/stories/StoryCache';
import { StoryNode, StepResult } from '../../src/stories/types';
import fs from 'fs';
import path from 'path';

describe('StoryCache Integration', () => {
  const testCacheDir = '.test-story-cache';
  let cache: StoryCache;

  beforeEach(() => {
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true });
    }
    cache = new StoryCache(testCacheDir);
  });

  afterEach(() => {
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true });
    }
  });

  it('should cache result with state', () => {
    const node: StoryNode = {
      id: 'test-1',
      hash: 'abc123',
      component: 'counter',
      stateBefore: { count: 0 },
      stateAfter: { count: 1 },
      step: { action: 'increment' },
      // ... other fields
    };

    const result: StepResult = {
      success: true,
      duration: 100,
      timestamp: new Date().toISOString(),
    };

    cache.set(node, result);

    const retrieved = cache.get(node);
    expect(retrieved).toEqual(result);
  });

  it('should miss cache for different state', () => {
    const node1: StoryNode = {
      component: 'counter',
      stateBefore: { count: 0 },
      step: { action: 'increment' },
      // ... other fields
    };

    const result: StepResult = {
      success: true,
      duration: 100,
      timestamp: new Date().toISOString(),
    };

    cache.set(node1, result);

    const node2: StoryNode = {
      ...node1,
      stateBefore: { count: 5 }, // Different state
    };

    const retrieved = cache.get(node2);
    expect(retrieved).toBeNull();
  });

  it('should persist cache to disk', () => {
    const node: StoryNode = {
      component: 'counter',
      stateBefore: { count: 0 },
      stateAfter: { count: 1 },
      step: { action: 'increment' },
      // ... other fields
    };

    const result: StepResult = {
      success: true,
      duration: 100,
      timestamp: new Date().toISOString(),
    };

    cache.set(node, result);

    // Create new cache instance (loads from disk)
    const newCache = new StoryCache(testCacheDir);
    const retrieved = newCache.get(node);

    expect(retrieved).toEqual(result);
  });

  it('should store state checkpoints', () => {
    const node: StoryNode = {
      component: 'counter',
      stateBefore: { count: 0 },
      stateAfter: { count: 1 },
      step: { action: 'increment' },
      // ... other fields
    };

    const result: StepResult = {
      success: true,
      duration: 100,
      timestamp: new Date().toISOString(),
    };

    cache.set(node, result);

    // Check if we can resume from this state
    const canResume = cache.canResumeFrom('counter', { count: 1 });
    expect(canResume).toBe(true);
  });
});
```

**Success Criteria**:
- [ ] State hashing is deterministic
- [ ] Different states produce different cache keys
- [ ] Cache persists to disk correctly
- [ ] State checkpoints are stored
- [ ] Can detect if resume is possible

---

## Week 4: Graph System Testing

### Integration Tests - End-to-End Story Execution

**File**: `core/demo/tests/stories/counter.story.test.ts`

```typescript
import { test, expect } from '@playwright/test';
import { StoryParser } from '@supernal-interface/core';
import { StoryGraphBuilder } from '@supernal-interface/core';
import { StoryExecutor } from '@supernal-interface/core';
import { ExamplesData } from '../../../src/architecture/DemoComponentData';
import fs from 'fs';

test.describe('Counter Story Execution', () => {
  test('should execute story with state contracts', async ({ page }) => {
    await page.goto('/examples');

    // Parse story
    const featureFile = fs.readFileSync(
      'stories/features/counter-with-state.feature',
      'utf8'
    );
    const parsed = StoryParser.parseFeatureFile(featureFile);

    // Build graph
    const stateContracts = new Map([
      ['counter', ExamplesData.counter]
    ]);
    const graph = StoryGraphBuilder.buildGraph(parsed, stateContracts);

    // Execute
    const executor = new StoryExecutor(page, '.story-cache');
    const result = await executor.execute(graph);

    // Assert
    expect(result.failed).toBe(0);
    expect(result.totalSteps).toBeGreaterThan(0);
    console.log(`Cached: ${result.cached}, Executed: ${result.executed}`);
  });

  test('should use cache on second run', async ({ page }) => {
    await page.goto('/examples');

    const featureFile = fs.readFileSync(
      'stories/features/counter-with-state.feature',
      'utf8'
    );
    const parsed = StoryParser.parseFeatureFile(featureFile);

    const stateContracts = new Map([
      ['counter', ExamplesData.counter]
    ]);
    const graph = StoryGraphBuilder.buildGraph(parsed, stateContracts);

    const executor = new StoryExecutor(page, '.story-cache');

    // First run
    const result1 = await executor.execute(graph);
    expect(result1.cached).toBe(0);
    expect(result1.executed).toBeGreaterThan(0);

    // Second run (should use cache)
    const result2 = await executor.execute(graph);
    expect(result2.cached).toBeGreaterThan(0);
    expect(result2.executed).toBe(0);

    // Calculate cache hit rate
    const hitRate = (result2.cached / result2.totalSteps) * 100;
    expect(hitRate).toBeGreaterThanOrEqual(70);
  });

  test('should handle scenario outlines', async ({ page }) => {
    // Test story with Scenario Outline expands correctly
    // ...
  });

  test('should resume from checkpoint on failure', async ({ page }) => {
    // Test that execution can resume from a saved checkpoint
    // ...
  });
});
```

### E2E Tests - Generated Test Quality

**File**: `core/demo/tests/stories/generated-tests.e2e.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { GraphTestGenerator } from '@supernal-interface/core';
import { StoryParser, StoryGraphBuilder } from '@supernal-interface/core';
import { ExamplesData } from '../../../src/architecture/DemoComponentData';
import fs from 'fs';

test.describe('Generated Test Quality', () => {
  test('should generate type-safe tests', () => {
    const featureFile = fs.readFileSync(
      'stories/features/counter-with-state.feature',
      'utf8'
    );
    const parsed = StoryParser.parseFeatureFile(featureFile);

    const stateContracts = new Map([
      ['counter', ExamplesData.counter]
    ]);
    const graph = StoryGraphBuilder.buildGraph(parsed, stateContracts);

    // Generate tests
    const generatedCode = GraphTestGenerator.generateTests(graph);

    // Verify generated code
    expect(generatedCode).toContain('import { Examples, ExamplesData }');
    expect(generatedCode).toContain('testId(Examples.counter');
    expect(generatedCode).toContain('ExamplesData.counter.state');
    expect(generatedCode).not.toContain('[data-testid="'); // No magic strings!
  });

  test('generated tests should pass when run', async ({ page }) => {
    // This test runs a generated test to ensure it works
    // (meta-testing!)
    // ...
  });
});
```

**Success Criteria**:
- [ ] Full story execution works end-to-end
- [ ] Cache hit rate >70% on second run
- [ ] Scenario outlines expand correctly
- [ ] Resume from checkpoint works
- [ ] Generated tests are type-safe
- [ ] Generated tests have no magic strings
- [ ] Generated tests pass when run

---

## Test Coverage Goals

### Per Week

- **Week 1**: 
  - Unit test coverage: >90%
  - Integration tests: 5+ scenarios
  
- **Week 2**: 
  - Unit test coverage: >90%
  - Integration tests: 8+ scenarios
  - E2E tests: 3+ scenarios
  
- **Week 3**: 
  - Unit test coverage: >85%
  - Integration tests: 6+ scenarios
  
- **Week 4**: 
  - Unit test coverage: >80%
  - Integration tests: 10+ scenarios
  - E2E tests: 5+ scenarios

### Overall

- **Total test coverage**: >85%
- **All critical paths**: 100% covered
- **CI/CD**: All tests run on every commit
- **Performance tests**: Cache hit rate, execution time

---

## Test Commands

```bash
# Unit tests (Jest)
npm run test:unit

# Watch mode during development
npm run test:unit:watch

# Integration tests
npm run test:integration

# E2E tests (Playwright)
npx playwright test

# E2E tests for stories
npx playwright test tests/stories/

# All tests
npm test

# Coverage report
npm run test:coverage

# Specific test file
npm test StoryParser.dataContracts.test.ts
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Story System

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Success Criteria Summary

### Must Have (Week 1-4)
- [ ] 100% of unit tests passing
- [ ] 100% of integration tests passing
- [ ] 100% of E2E tests passing
- [ ] Test coverage >85%
- [ ] No magic strings in generated tests
- [ ] Cache hit rate >70%

### Nice to Have
- [ ] Performance benchmarks
- [ ] Visual regression tests
- [ ] Mutation testing
- [ ] Load testing for cache

---

## Next Steps

1. **Week 1**: Write tests for data contracts BEFORE implementing
2. **Week 2**: Write tests for ComponentRegistry BEFORE implementing
3. **Week 3**: Write tests for state-aware caching BEFORE implementing
4. **Week 4**: Write E2E tests for full story execution

**TDD Approach**: Red → Green → Refactor

This ensures **100% test coverage** and **high code quality**! 🎯

