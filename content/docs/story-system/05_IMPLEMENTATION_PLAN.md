---
title: "Implementation Plan"
description: "4-week implementation plan with detailed tasks and deliverables"
category: "Story System"
order: 5
showToc: true
---
showToc: true
---
# Story Implementation Plan V2

**Version**: 2.0  
**Date**: November 18, 2025  
**Status**: REVISED - Addressing State & Data Management  
**Context**: Post Component Test Generation (Phase 3.1)

---

## 🚨 Critical Issues Identified (V1 → V2)

### Issue 1: No Separation of Concerns
**Problem**: Why have both `StoryTestGenerator` AND `StoryExecutor`?  
**Solution**: **Graph is the source of truth**. Generate tests FROM the graph, not separately.

### Issue 2: Missing Test Data & State Management
**Problem**: Stories have no way to:
- Define test data (inputs, expected outputs)
- Set up initial component state
- Assert on state changes
- Use Gherkin data tables

**Solution**: Add comprehensive state & data management system.

---

## 🎯 Revised Architecture

### The Complete Flow

```
┌────────────────────────────────────────────────────────────────┐
│                     UNIFIED STORY SYSTEM                        │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Parse .feature (Gherkin + Data Tables)                     │
│  2. Build Graph (Steps + State + Data)                         │
│  3. Enrich Graph (Component metadata, state contracts)         │
│  4. Execute OR Generate:                                        │
│     • Mode 1: Direct Execution (cached, fast)                  │
│     • Mode 2: Generate Tests (from graph)                      │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Key Principle

> **The Graph IS the source of truth. Everything else derives from it.**

- ✅ Execute directly from graph (with caching)
- ✅ Generate Playwright tests from graph
- ✅ Generate documentation from graph
- ✅ Visualize graph
- ❌ Don't maintain separate test generator

---

## State & Data Management

### Component State Contracts

Each `@Component` should define its **state interface**:

```typescript
// core/src/architecture/ComponentNames.ts
export const Examples = {
  counterWidget: 'examples-counter-widget',
  counterIncrement: 'examples-counter-increment',
  counterDecrement: 'examples-counter-decrement',
  counterReset: 'examples-counter-reset',
} as const;

// NEW: State contracts
export interface CounterState {
  count: number;
}

export const CounterStateContract = {
  initial: { count: 0 },
  
  // Expected state after actions
  afterIncrement: (prev: CounterState) => ({ count: prev.count + 1 }),
  afterDecrement: (prev: CounterState) => ({ count: prev.count - 1 }),
  afterReset: () => ({ count: 0 }),
} as const;
```

### Gherkin with Data Tables

Stories should support **Gherkin data tables** for test data:

```gherkin
Feature: Counter Component

  Background:
    Given I navigate to "/examples"
    And Components.Examples.counterWidget is visible

  # Scenario with initial state
  Scenario: Increment from initial state
    Given counter state is:
      | count |
      | 0     |
    When I click Components.Examples.counterIncrement
    Then counter state should be:
      | count |
      | 1     |
    And Components.Examples.counterWidget should contain "Count: 1"

  # Scenario Outline with multiple data points
  Scenario Outline: Increment multiple times
    Given counter state is:
      | count   |
      | <start> |
    When I click Components.Examples.counterIncrement <times> times
    Then counter state should be:
      | count |
      | <end> |
    
    Examples:
      | start | times | end |
      | 0     | 1     | 1   |
      | 0     | 3     | 3   |
      | 5     | 2     | 7   |

  # Testing state transitions
  Scenario: State persistence across actions
    Given counter state is:
      | count |
      | 0     |
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    And I click Components.Examples.counterDecrement
    Then counter state should be:
      | count |
      | 1     |
```

### State Management in Graph

**Enhanced StoryNode**:

```typescript
export interface StoryNode {
  id: string;
  hash: string;
  step: ParsedStep;
  scenarioName: string;
  type: 'background' | 'scenario';
  
  // NEW: State management
  stateSetup?: StateSetup;        // Initial state from "Given" steps
  stateAssertion?: StateAssertion; // Expected state from "Then" steps
  stateTransition?: StateTransition; // State change from "When" steps
  
  // Execution
  cached: boolean;
  result: StepResult | null;
}

export interface StateSetup {
  component: string;
  initialState: Record<string, any>;
  dataTable?: GherkinDataTable;
}

export interface StateAssertion {
  component: string;
  expectedState: Record<string, any>;
  dataTable?: GherkinDataTable;
}

export interface StateTransition {
  component: string;
  action: string;
  transformState: (prev: any) => any;
}

export interface GherkinDataTable {
  headers: string[];
  rows: string[][];
}
```

---

## Revised Components

### 1. StoryParser (Enhanced)

**File**: `core/src/stories/StoryParser.ts`

**NEW Responsibilities**:
- ✅ Parse Gherkin (existing)
- ✅ Parse data tables
- ✅ Extract state setup ("Given state is...")
- ✅ Extract state assertions ("Then state should be...")
- ✅ Link to state contracts

```typescript
export interface ParsedStep {
  type: 'Given' | 'When' | 'Then' | 'And' | 'But';
  text: string;
  lineNumber: number;
  
  // Component reference
  component?: string;
  componentPath?: string;
  
  // Action
  action?: string;
  value?: string;
  
  // NEW: State & data
  stateSetup?: StateSetup;
  stateAssertion?: StateAssertion;
  dataTable?: GherkinDataTable;
  
  // Scenario outline
  isOutline?: boolean;
  examples?: GherkinDataTable;
}
```

### 2. StoryGraphBuilder (Enhanced)

**File**: `core/src/stories/StoryGraphBuilder.ts`

**NEW Responsibilities**:
- ✅ Build graph (existing)
- ✅ Enrich nodes with state metadata
- ✅ Link state setup → transitions → assertions
- ✅ Expand scenario outlines (data tables)
- ✅ Validate state contracts exist

```typescript
export class StoryGraphBuilder {
  /**
   * Build enriched graph with state information
   */
  static buildGraph(
    feature: ParsedFeature,
    stateContracts: Map<string, StateContract>
  ): StoryGraph {
    const graph: StoryGraph = {
      nodes: [],
      edges: [],
      executionOrder: [],
      stateContracts,
    };

    for (const scenario of feature.scenarios) {
      // If scenario outline, expand to multiple scenarios
      if (scenario.isOutline && scenario.examples) {
        const expandedScenarios = this.expandScenarioOutline(scenario);
        expandedScenarios.forEach(expanded => {
          this.addScenarioToGraph(graph, expanded, feature.background);
        });
      } else {
        this.addScenarioToGraph(graph, scenario, feature.background);
      }
    }

    // Calculate execution order
    graph.executionOrder = this.topologicalSort(graph);

    return graph;
  }

  /**
   * Expand scenario outline with examples
   */
  private static expandScenarioOutline(scenario: ParsedScenario): ParsedScenario[] {
    const { examples } = scenario;
    if (!examples) return [scenario];

    const expanded: ParsedScenario[] = [];

    // Each row in examples becomes a scenario
    examples.rows.forEach((row, index) => {
      const paramMap = new Map<string, string>();
      examples.headers.forEach((header, colIndex) => {
        paramMap.set(header, row[colIndex]);
      });

      // Replace <param> placeholders in steps
      const expandedSteps = scenario.steps.map(step => ({
        ...step,
        text: this.replacePlaceholders(step.text, paramMap),
        value: step.value ? this.replacePlaceholders(step.value, paramMap) : undefined,
        stateSetup: step.stateSetup ? this.replaceStateValues(step.stateSetup, paramMap) : undefined,
        stateAssertion: step.stateAssertion ? this.replaceStateValues(step.stateAssertion, paramMap) : undefined,
      }));

      expanded.push({
        ...scenario,
        name: `${scenario.name} (Example ${index + 1})`,
        steps: expandedSteps,
        isOutline: false,
      });
    });

    return expanded;
  }

  /**
   * Enrich node with state metadata
   */
  private static enrichNode(node: StoryNode, stateContracts: Map<string, StateContract>): void {
    const { step } = node;

    // State setup (Given state is...)
    if (step.stateSetup) {
      node.stateSetup = step.stateSetup;
    }

    // State assertion (Then state should be...)
    if (step.stateAssertion) {
      node.stateAssertion = step.stateAssertion;
    }

    // State transition (When action...)
    if (step.component && step.action) {
      const contract = stateContracts.get(step.component);
      if (contract) {
        node.stateTransition = {
          component: step.component,
          action: step.action,
          transformState: contract.transitions[step.action],
        };
      }
    }
  }
}

export interface StateContract {
  component: string;
  initialState: any;
  transitions: Record<string, (prev: any) => any>;
}
```

### 3. StoryExecutor (Enhanced with State)

**File**: `core/src/stories/StoryExecutor.ts`

**NEW Responsibilities**:
- ✅ Execute graph (existing)
- ✅ Manage component state during execution
- ✅ Set up initial state from "Given" steps
- ✅ Assert state changes from "Then" steps
- ✅ Track state history

```typescript
export class StoryExecutor {
  private cache: StoryCache;
  private page: Page;
  private componentStates: Map<string, any>; // NEW: Track component states

  constructor(page: Page, cacheDir?: string) {
    this.page = page;
    this.cache = new StoryCache(cacheDir);
    this.componentStates = new Map();
  }

  /**
   * Execute graph with state management
   */
  async execute(graph: StoryGraph): Promise<ExecutionResult> {
    const results: Map<string, StepResult> = new Map();
    let cached = 0;
    let executed = 0;
    let failed = 0;

    for (const nodeId of graph.executionOrder) {
      const node = graph.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Check cache (but re-run if state setup/assertion changed)
      const cachedResult = this.cache.get(node.hash);
      const canUseCache = cachedResult && 
                          cachedResult.success && 
                          !node.stateSetup && 
                          !node.stateAssertion;

      if (canUseCache) {
        console.log(`✓ Cached: ${node.step.text}`);
        results.set(nodeId, cachedResult);
        node.cached = true;
        node.result = cachedResult;
        cached++;
        continue;
      }

      // Execute step with state management
      console.log(`⚡ Running: ${node.step.text}`);
      try {
        const result = await this.executeStepWithState(node);
        results.set(nodeId, result);
        node.result = result;

        if (result.success) {
          this.cache.set(node.hash, result);
        }

        executed++;
      } catch (error: any) {
        const failedResult: StepResult = {
          success: false,
          duration: 0,
          error,
          timestamp: new Date().toISOString(),
        };

        results.set(nodeId, failedResult);
        node.result = failedResult;
        failed++;
        break;
      }
    }

    return {
      totalSteps: graph.nodes.length,
      cached,
      executed,
      failed,
      duration: 0,
      results,
      graph,
      componentStates: Object.fromEntries(this.componentStates), // NEW
    };
  }

  /**
   * Execute step with state management
   */
  private async executeStepWithState(node: StoryNode): Promise<StepResult> {
    const startTime = Date.now();
    const { step } = node;

    try {
      // 1. Set up state (Given state is...)
      if (node.stateSetup) {
        await this.setupComponentState(node.stateSetup);
      }

      // 2. Execute action
      if (step.component && step.componentPath) {
        const componentId = StoryParser.resolveComponentId(step.componentPath);
        const selector = `[data-testid="${componentId}"]`;
        const element = this.page.locator(selector).first();

        switch (step.action) {
          case 'visible':
            await element.waitFor({ state: 'visible', timeout: 10000 });
            break;

          case 'click':
            await element.click();
            await this.page.waitForTimeout(100);
            
            // Update local state if transition defined
            if (node.stateTransition) {
              this.updateComponentState(node.stateTransition);
            }
            break;

          case 'type':
            await element.fill(step.value || '');
            break;

          case 'contain':
            await expect(element).toContainText(step.value || '');
            break;

          case 'equal':
            await expect(element).toHaveText(step.value || '');
            break;
        }
      }

      // 3. Assert state (Then state should be...)
      if (node.stateAssertion) {
        await this.assertComponentState(node.stateAssertion);
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        duration,
        timestamp: new Date().toISOString(),
        componentState: node.step.component 
          ? this.componentStates.get(node.step.component)
          : undefined,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration,
        error,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Set up component state
   */
  private async setupComponentState(setup: StateSetup): Promise<void> {
    console.log(`  📦 Setting up state for ${setup.component}:`, setup.initialState);
    this.componentStates.set(setup.component, setup.initialState);

    // Could inject state into component via browser console
    // await this.page.evaluate(({ component, state }) => {
    //   window.__testState__ = window.__testState__ || {};
    //   window.__testState__[component] = state;
    // }, { component: setup.component, state: setup.initialState });
  }

  /**
   * Update component state after action
   */
  private updateComponentState(transition: StateTransition): void {
    const currentState = this.componentStates.get(transition.component) || {};
    const newState = transition.transformState(currentState);
    console.log(`  🔄 State transition for ${transition.component}:`, currentState, '→', newState);
    this.componentStates.set(transition.component, newState);
  }

  /**
   * Assert component state
   */
  private async assertComponentState(assertion: StateAssertion): Promise<void> {
    const actualState = this.componentStates.get(assertion.component);
    console.log(`  ✅ Asserting state for ${assertion.component}`);
    console.log(`     Expected:`, assertion.expectedState);
    console.log(`     Actual:`, actualState);

    // Deep equality check
    expect(actualState).toEqual(assertion.expectedState);
  }
}

interface StepResult {
  success: boolean;
  duration: number;
  error?: Error;
  screenshot?: string;
  timestamp: string;
  componentState?: any; // NEW
}
```

### 4. GraphTestGenerator (NEW - Replaces StoryTestGenerator)

**File**: `core/src/stories/GraphTestGenerator.ts`

**Purpose**: Generate Playwright tests **from the graph** (not from feature files directly).

```typescript
export class GraphTestGenerator {
  /**
   * Generate Playwright tests from graph
   */
  static generateTests(graph: StoryGraph): string {
    const imports = this.generateImports(graph);
    const scenarios = this.generateScenarios(graph);

    return `${imports}\n\n${scenarios}`;
  }

  /**
   * Generate test code for each scenario
   */
  private static generateScenarios(graph: StoryGraph): string {
    const scenarioGroups = this.groupNodesByScenario(graph);

    return Array.from(scenarioGroups.entries())
      .map(([scenarioName, nodes]) => {
        return this.generateScenarioTest(scenarioName, nodes, graph);
      })
      .join('\n\n');
  }

  /**
   * Generate a single scenario test
   */
  private static generateScenarioTest(
    scenarioName: string,
    nodes: StoryNode[],
    graph: StoryGraph
  ): string {
    let code = `  test('${scenarioName}', async ({ page }) => {\n`;

    // Add state tracking
    code += `    const componentStates = new Map();\n\n`;

    for (const node of nodes) {
      code += this.generateStepCode(node, graph);
    }

    code += `  });\n`;

    return code;
  }

  /**
   * Generate code for a single step
   */
  private static generateStepCode(node: StoryNode, graph: StoryGraph): string {
    let code = `    // ${node.step.type}: ${node.step.text}\n`;

    // State setup
    if (node.stateSetup) {
      code += `    componentStates.set('${node.stateSetup.component}', ${JSON.stringify(node.stateSetup.initialState)});\n`;
    }

    // Action execution
    if (node.step.component && node.step.action) {
      const componentId = StoryParser.resolveComponentId(node.step.componentPath!);
      code += `    const element_${node.id.replace(/[^a-zA-Z0-9]/g, '_')} = page.locator(testId('${componentId}')).first();\n`;

      switch (node.step.action) {
        case 'visible':
          code += `    await element_${node.id.replace(/[^a-zA-Z0-9]/g, '_')}.waitFor({ state: 'visible' });\n`;
          break;
        case 'click':
          code += `    await element_${node.id.replace(/[^a-zA-Z0-9]/g, '_')}.click();\n`;
          if (node.stateTransition) {
            code += `    componentStates.set('${node.stateTransition.component}', ${node.stateTransition.component}StateContract.${node.step.action}(componentStates.get('${node.stateTransition.component}')));\n`;
          }
          break;
      }
    }

    // State assertion
    if (node.stateAssertion) {
      code += `    expect(componentStates.get('${node.stateAssertion.component}')).toEqual(${JSON.stringify(node.stateAssertion.expectedState)});\n`;
    }

    code += '\n';

    return code;
  }
}
```

---

## 🎯 Corrected Implementation Plan

> **Critical**: Implementation order is **2 → 3 → 4 → 1** (Data Contracts first, Graph System last)

### Week 1: Data Contracts (Foundation)

**Priority**: 🔴 **HIGHEST** - Nothing works without this

#### 1.1 Create Data Contract System
- [ ] Create `core/src/architecture/DemoComponentData.ts`
- [ ] Define state interfaces (`CounterState`, `ChatState`, etc.)
- [ ] Create data contracts with `satisfies` type checking
- [ ] Define state transitions (`after.increment`, etc.)
- [ ] Document naming conventions
- [ ] Export types for consumption

**Files to Create**:
- `core/src/architecture/DemoComponentData.ts`
- `core/src/architecture/index.ts` (update exports)

**Success Criteria**:
- [ ] Type-safe state definitions
- [ ] `Components.Examples.counter.state.zero` references work
- [ ] Compile-time validation for typos
- [ ] IDE autocomplete for state references

#### 1.2 Implement Data Contract Resolution
- [ ] Add `resolveDataContract()` to `StoryParser`
- [ ] Add `loadDataContract()` namespace loader
- [ ] Update `ParsedStep` interface with `stateReference` and `stateData`
- [ ] Write unit tests for contract resolution
- [ ] Handle errors (invalid references, missing contracts)

**Files to Modify**:
- `core/src/stories/StoryParser.ts` (create if doesn't exist)

**Success Criteria**:
- [ ] Can parse `Components.Examples.counter.state.zero`
- [ ] Returns correct state object `{ count: 0 }`
- [ ] Clear error messages for invalid references
- [ ] Unit tests pass

#### 1.3 Example Data Contracts
- [ ] Create counter data contracts (zero, one, five, ten)
- [ ] Create state transitions (increment, decrement, reset)
- [ ] Create test case data
- [ ] Document usage patterns

**Success Criteria**:
- [ ] All counter states defined
- [ ] State transitions are functions
- [ ] Comprehensive documentation

---

### Week 2: State Integration (Component Connection)

**Priority**: 🟠 **HIGH** - Required before caching and graph

#### 2.1 Create State Management Infrastructure
- [ ] Create `StatefulComponent<TState>` interface
- [ ] Add `getState()`, `setState()`, `resetState()` methods
- [ ] Create `ComponentRegistry` class
- [ ] Implement `registerInstance()`, `getInstance()`
- [ ] Implement `getState()`, `setState()` on registry
- [ ] Add `clear()` for testing

**Files to Create**:
- `core/src/registry/ComponentRegistry.ts`
- `core/src/interfaces/StatefulComponent.ts`

**Success Criteria**:
- [ ] Interface is type-safe
- [ ] Registry can store/retrieve instances
- [ ] Registry can read/write state
- [ ] Unit tests pass

#### 2.2 Update Component Decorator
- [ ] Modify `@Component` to auto-register stateful components
- [ ] Wrap constructor for instance registration
- [ ] Only register if `stateful: true` and implements interface
- [ ] Log registration for debugging

**Files to Modify**:
- `core/src/decorators/Component.ts`

**Success Criteria**:
- [ ] Auto-registration works
- [ ] Only stateful components registered
- [ ] No impact on non-stateful components
- [ ] Integration tests pass

#### 2.3 Update Example Components
- [ ] Refactor `CounterComponent` to implement `StatefulComponent<CounterState>`
- [ ] Add `getState()`, `setState()`, `resetState()` methods
- [ ] Track state internally
- [ ] Update render logic

**Files to Modify**:
- `core/demo/src/tools/ExampleTools.ts` (or wherever CounterComponent lives)

**Success Criteria**:
- [ ] CounterComponent implements interface
- [ ] State can be read/written
- [ ] Component still works in demo
- [ ] No regressions

#### 2.4 Browser State Injection
- [ ] Add `window.__testState__` global
- [ ] Create `test:setState` custom event
- [ ] Update React components to listen for state injection
- [ ] Add `data-state` attribute for reading
- [ ] Test state injection in browser

**Files to Modify**:
- `core/demo/src/components/CounterWidget.tsx` (if React)
- `core/demo/src/widgets/index.tsx` (if vanilla)

**Success Criteria**:
- [ ] Can inject state from tests
- [ ] Components respond to state injection
- [ ] State is readable via `data-state`
- [ ] Works in both vanilla and React

---

### Week 3: State-Aware Caching (Performance Layer)

**Priority**: 🟡 **MEDIUM** - Enhances performance, not required for basic functionality

#### 3.1 Implement State-Aware Hashing
- [ ] Create state hash function (`hashState()`)
- [ ] Update node hash to include `stateBefore` and `stateAfter`
- [ ] Generate cache keys as `${component}-${stateHash}-${action}`
- [ ] Write unit tests for hash generation
- [ ] Verify different states produce different hashes

**Files to Create/Modify**:
- `core/src/stories/StoryGraphBuilder.ts` (create)
- `core/src/stories/StoryCache.ts` (create)

**Success Criteria**:
- [ ] Same action, different states = different hashes
- [ ] Hash is deterministic
- [ ] Hash collisions are rare
- [ ] Unit tests pass

#### 3.2 Implement State-Aware Cache
- [ ] Create `StoryCache` class
- [ ] Implement `get()` with state-aware keys
- [ ] Implement `set()` with state-aware keys
- [ ] Store `stateBefore` and `stateAfter` in cache
- [ ] Implement cache persistence (file-based)
- [ ] Add cache statistics

**Success Criteria**:
- [ ] Cache uses state-aware keys
- [ ] Can retrieve cached results by state
- [ ] Cache persists to disk
- [ ] Stats are accurate

#### 3.3 State Checkpoints
- [ ] Store state checkpoints in cache
- [ ] Implement `getStateCheckpoint()`
- [ ] Implement `canResumeFrom()`
- [ ] Track state history during execution
- [ ] Add checkpoint metadata

**Success Criteria**:
- [ ] Checkpoints are stored correctly
- [ ] Can query available checkpoints
- [ ] Can check if resume is possible
- [ ] Integration tests pass

#### 3.4 Cache Invalidation
- [ ] Invalidate on state changes
- [ ] Implement `invalidateComponent()`
- [ ] Handle data contract updates
- [ ] Add TTL for cache entries (24h)
- [ ] Test invalidation logic

**Success Criteria**:
- [ ] State changes invalidate correct entries
- [ ] Component invalidation works
- [ ] Stale entries are cleaned up
- [ ] No false cache hits

---

### Week 4: Graph System (Orchestration)

**Priority**: 🟢 **FINAL** - Ties everything together

#### 4.1 Implement StoryParser (Full)
- [ ] Parse Gherkin files using `@cucumber/gherkin`
- [ ] Parse data contract references
- [ ] Parse state setup steps ("Given state is...")
- [ ] Parse state assertion steps ("Then state should be...")
- [ ] Extract `Scenario Outline` examples
- [ ] Validate all references exist
- [ ] Write comprehensive parser tests

**Files to Create/Modify**:
- `core/src/stories/StoryParser.ts` (enhance existing)

**Success Criteria**:
- [ ] Can parse all Gherkin constructs
- [ ] Data contract references resolved
- [ ] State steps identified
- [ ] Validation works
- [ ] Parser tests pass

#### 4.2 Implement StoryGraphBuilder
- [ ] Build dependency graph from parsed feature
- [ ] Create nodes with `stateBefore` and `stateAfter`
- [ ] Expand scenario outlines with examples
- [ ] Replace placeholders with example data
- [ ] Calculate execution order (topological sort)
- [ ] Link state contracts to nodes
- [ ] Write graph builder tests

**Files to Create**:
- `core/src/stories/StoryGraphBuilder.ts`

**Success Criteria**:
- [ ] Graph nodes include state
- [ ] Scenario outlines expand correctly
- [ ] Execution order is correct
- [ ] State flows through graph
- [ ] Builder tests pass

#### 4.3 Implement StoryExecutor
- [ ] Execute graph in order
- [ ] Set component state from data contracts
- [ ] Execute actions
- [ ] Assert state against data contracts
- [ ] Use state-aware caching
- [ ] Restore state from checkpoints
- [ ] Implement `resumeFrom()`
- [ ] Write executor tests

**Files to Create**:
- `core/src/stories/StoryExecutor.ts`

**Success Criteria**:
- [ ] Executes graph correctly
- [ ] State setup works
- [ ] State assertions work
- [ ] Caching is used
- [ ] Can resume from checkpoints
- [ ] Executor tests pass

#### 4.4 Implement GraphTestGenerator
- [ ] Generate Playwright tests FROM graph
- [ ] Include state setup code
- [ ] Include state transition code
- [ ] Include state assertions
- [ ] Use `GenerationConflictManager`
- [ ] Import data contracts in generated tests
- [ ] Write generator tests

**Files to Create**:
- `core/src/stories/GraphTestGenerator.ts`

**Success Criteria**:
- [ ] Generates tests from graph
- [ ] Generated tests are type-safe
- [ ] No magic strings
- [ ] Uses data contracts
- [ ] Conflict management works
- [ ] Generator tests pass

#### 4.5 Create Example Stories
- [ ] Create `stories/features/counter-with-state.feature`
- [ ] Use data contract references
- [ ] Add scenario outlines
- [ ] Test graph execution
- [ ] Test generated tests
- [ ] Verify 100% test pass rate

**Success Criteria**:
- [ ] Example stories work end-to-end
- [ ] Both execution modes work
- [ ] Cache provides speedup
- [ ] Generated tests pass
- [ ] Documentation complete

---

## Dependency Visualization

```
Week 1: Data Contracts (2) ← START HERE
  │
  ├─ DemoComponentData.ts
  ├─ State interfaces
  ├─ Data contracts
  └─ StoryParser.resolveDataContract()
      ↓
Week 2: State Integration (3) ← REQUIRES DATA CONTRACTS
  │
  ├─ ComponentRegistry
  ├─ StatefulComponent interface
  ├─ @Component auto-registration
  └─ Browser state injection
      ↓
Week 3: State-Aware Caching (4) ← REQUIRES STATE INTEGRATION
  │
  ├─ State-aware hash pattern
  ├─ StoryCache with state keys
  ├─ State checkpoints
  └─ Cache invalidation
      ↓
Week 4: Graph System (1) ← REQUIRES ALL OF THE ABOVE
  │
  ├─ StoryParser (full)
  ├─ StoryGraphBuilder
  ├─ StoryExecutor
  ├─ GraphTestGenerator
  └─ Example stories
```

---

## Why This Order?

### ❌ Wrong Order (Parser First):
```
Parse story → ???
  ↑
  Can't resolve data contracts (not implemented yet)
  Can't set component state (no registry)
  Can't cache with state (no hash pattern)
```

### ✅ Correct Order (Data Contracts First):
```
1. Data Contracts → Can reference states programmatically
2. State Integration → Can read/write component state
3. Caching → Can cache with state awareness
4. Graph → Can orchestrate everything together
```

Each phase **builds on** the previous phase. No phase can work without its prerequisites.

---

## Success Criteria (Updated)

### State Management
- [ ] Can parse Gherkin data tables
- [ ] Can set up component state from "Given" steps
- [ ] Can assert component state in "Then" steps
- [ ] Can track state changes across steps
- [ ] State contracts are type-safe

### Scenario Outlines
- [ ] Can expand scenario outlines with examples
- [ ] Can replace placeholders in steps
- [ ] Can replace placeholders in state data
- [ ] Generated scenarios have unique names

### Graph Generation
- [ ] Graph includes state metadata
- [ ] Node hashes include state information
- [ ] Cache invalidates when state changes

### Test Generation
- [ ] Tests generated FROM graph (not feature files)
- [ ] Generated tests include state setup
- [ ] Generated tests include state assertions
- [ ] Generated tests use state contracts
- [ ] No code duplication between executor and generator

---

## FAQ (Updated)

**Q: Why not have separate StoryTestGenerator?**  
A: The **graph is the source of truth**. Both execution and test generation should derive from the same graph structure. This ensures consistency and eliminates duplication.

**Q: How do I define test data?**  
A: Use Gherkin data tables in your stories:
```gherkin
Given counter state is:
  | count |
  | 0     |
```

**Q: How do I test multiple scenarios with different data?**  
A: Use `Scenario Outline` with `Examples`:
```gherkin
Scenario Outline: Test with different inputs
  Given count is <start>
  When I increment <times> times
  Then count should be <end>
  
  Examples:
    | start | times | end |
    | 0     | 1     | 1   |
    | 5     | 2     | 7   |
```

**Q: How is component state tracked?**  
A: Both the executor and generated tests maintain a `Map<string, any>` of component states, updated after each action based on state contracts.

**Q: What if I don't need state management?**  
A: State is optional. If your story doesn't use "Given state is..." or "Then state should be...", it works like before.

---

## Next Steps

1. ✅ Review this revised plan
2. ⏭️ Create state contract examples
3. ⏭️ Enhance `StoryParser` for data tables
4. ⏭️ Implement state-enriched `StoryGraphBuilder`
5. ⏭️ Update `StoryExecutor` with state tracking
6. ⏭️ Create `GraphTestGenerator` (replace `StoryTestGenerator`)

**This plan is now COMPLETE and CONSISTENT.**

