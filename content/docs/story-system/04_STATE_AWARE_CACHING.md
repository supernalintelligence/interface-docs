---
title: "State-Aware Caching"
description: "50-80% faster execution with state-aware caching and checkpoints"
category: "Story System"
order: 4
showToc: true
---
showToc: true
---
# State-Aware Graph Caching

**Date**: November 18, 2025  
**Status**: Design  

---

## 🎯 The Problem

Current hash pattern:
```typescript
// BAD: Ignores state
hash = sha256(step.text + step.action + step.component)
```

This means:
- ❌ Same step with different starting states → same cache entry (WRONG!)
- ❌ Can't resume from state checkpoints
- ❌ State changes don't invalidate cache

---

## ✅ Solution: State-Aware Hashing

### Hash Pattern

```
hash = sha256(component + startingState + action + endingState)
```

This ensures:
- ✅ Same action, different states → different cache entries
- ✅ Can resume from any state checkpoint
- ✅ State changes invalidate cache
- ✅ Graph becomes a state machine

---

## Implementation

### 1. Enhanced Node Hash

```typescript
// core/src/stories/StoryGraphBuilder.ts

export class StoryGraphBuilder {
  /**
   * Hash step with state awareness
   */
  private static hashStep(
    step: ParsedStep,
    previousState?: any,
    nextState?: any
  ): string {
    const hashInput = {
      // Component + action
      component: step.component,
      action: step.action,
      
      // State information
      stateSetup: step.stateData,           // From "Given state is..."
      previousState,                        // State before this step
      nextState,                            // State after this step (if known)
      
      // Step details
      text: step.text,
      value: step.value,
    };

    const content = JSON.stringify(hashInput, Object.keys(hashInput).sort());
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  /**
   * Build graph with state-aware nodes
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
      const nodes = this.buildScenarioNodes(scenario, feature.background, stateContracts);
      graph.nodes.push(...nodes);
      
      // Add edges with state flow
      for (let i = 1; i < nodes.length; i++) {
        const prevNode = nodes[i - 1];
        const currNode = nodes[i];
        
        graph.edges.push({
          from: prevNode.id,
          to: currNode.id,
          type: 'sequence',
          stateTransfer: prevNode.stateAfter, // Pass state to next node
        });
      }
    }

    graph.executionOrder = this.topologicalSort(graph);
    return graph;
  }

  /**
   * Build scenario nodes with state tracking
   */
  private static buildScenarioNodes(
    scenario: ParsedScenario,
    background?: ParsedBackground,
    stateContracts?: Map<string, StateContract>
  ): StoryNode[] {
    const nodes: StoryNode[] = [];
    let currentState: Map<string, any> = new Map(); // Track state per component

    // Process background steps
    if (background) {
      for (const step of background.steps) {
        const node = this.createNodeWithState(step, scenario.name, 'background', currentState, stateContracts);
        nodes.push(node);
        currentState = this.updateCurrentState(currentState, node);
      }
    }

    // Process scenario steps
    for (const step of scenario.steps) {
      const node = this.createNodeWithState(step, scenario.name, 'scenario', currentState, stateContracts);
      nodes.push(node);
      currentState = this.updateCurrentState(currentState, node);
    }

    return nodes;
  }

  /**
   * Create node with state context
   */
  private static createNodeWithState(
    step: ParsedStep,
    scenarioName: string,
    nodeType: 'background' | 'scenario',
    currentState: Map<string, any>,
    stateContracts?: Map<string, StateContract>
  ): StoryNode {
    const component = step.component || this.extractComponentFromStep(step);
    
    // Get state before this step
    const stateBefore = component ? currentState.get(component) : undefined;
    
    // Calculate state after this step
    let stateAfter: any = stateBefore;
    
    if (step.stateData) {
      // Step explicitly sets state ("Given state is...")
      stateAfter = step.stateData;
    } else if (component && step.action && stateContracts) {
      // Apply state transition
      const contract = stateContracts.get(component);
      if (contract?.transitions[step.action]) {
        stateAfter = contract.transitions[step.action](stateBefore);
      }
    }

    // Generate hash including state
    const hash = this.hashStep(step, stateBefore, stateAfter);

    return {
      id: this.generateNodeId(step, scenarioName),
      hash,
      step,
      scenarioName,
      type: nodeType,
      
      // State tracking
      component,
      stateBefore,
      stateAfter,
      
      // Execution tracking
      cached: false,
      result: null,
    };
  }

  /**
   * Update current state after node execution
   */
  private static updateCurrentState(
    currentState: Map<string, any>,
    node: StoryNode
  ): Map<string, any> {
    const updated = new Map(currentState);
    
    if (node.component && node.stateAfter !== undefined) {
      updated.set(node.component, node.stateAfter);
    }
    
    return updated;
  }
}

/**
 * Enhanced node with state
 */
export interface StoryNode {
  id: string;
  hash: string;
  step: ParsedStep;
  scenarioName: string;
  type: 'background' | 'scenario';
  
  // Component state
  component?: string;
  stateBefore?: any;    // State BEFORE this step
  stateAfter?: any;     // State AFTER this step
  
  // Execution
  cached: boolean;
  result: StepResult | null;
}

export interface StoryEdge {
  from: string;
  to: string;
  type: 'sequence' | 'dependency';
  stateTransfer?: any;  // State passed to next node
}
```

---

## 2. State-Aware Cache

### Cache Key Structure

```
cache_key = `${component}-${stateHash}-${action}`

Examples:
  counter-a3f2-increment  (counter at state {count:0}, increment)
  counter-b7c8-increment  (counter at state {count:5}, increment)
  counter-a3f2-decrement  (counter at state {count:0}, decrement)
```

### Implementation

```typescript
// core/src/stories/StoryCache.ts

export class StoryCache {
  private cache: Map<string, CachedStep>;
  private stateCache: Map<string, any>; // NEW: Cache states separately

  /**
   * Generate cache key with state
   */
  private generateCacheKey(node: StoryNode): string {
    const component = node.component || 'global';
    const stateHash = this.hashState(node.stateBefore);
    const action = node.step.action || 'noop';
    
    return `${component}-${stateHash}-${action}`;
  }

  /**
   * Hash state for cache key
   */
  private hashState(state: any): string {
    if (!state) return 'null';
    
    const content = JSON.stringify(state, Object.keys(state).sort());
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
  }

  /**
   * Get cached result for node
   */
  get(node: StoryNode): StepResult | null {
    const cacheKey = this.generateCacheKey(node);
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      console.log(`  ⚡ Cache miss: ${cacheKey}`);
      return null;
    }
    
    // Check if cache is stale
    const age = Date.now() - new Date(cached.timestamp).getTime();
    if (age > 24 * 60 * 60 * 1000) {
      this.cache.delete(cacheKey);
      return null;
    }

    console.log(`  ✅ Cache hit: ${cacheKey}`);
    return cached.result;
  }

  /**
   * Store step result with state
   */
  set(node: StoryNode, result: StepResult): void {
    const cacheKey = this.generateCacheKey(node);
    
    this.cache.set(cacheKey, {
      hash: node.hash,
      result,
      timestamp: new Date().toISOString(),
      stateBefore: node.stateBefore,
      stateAfter: node.stateAfter,
    });
    
    // Also cache the state checkpoint
    if (node.component && node.stateAfter !== undefined) {
      const stateKey = `${node.component}-${this.hashState(node.stateAfter)}`;
      this.stateCache.set(stateKey, node.stateAfter);
    }
    
    console.log(`  💾 Cached: ${cacheKey}`);
    this.save();
  }

  /**
   * Get state checkpoint
   */
  getStateCheckpoint(component: string, stateHash: string): any | null {
    const stateKey = `${component}-${stateHash}`;
    return this.stateCache.get(stateKey) || null;
  }

  /**
   * Check if we can resume from a state
   */
  canResumeFrom(component: string, state: any): boolean {
    const stateHash = this.hashState(state);
    const stateKey = `${component}-${stateHash}`;
    return this.stateCache.has(stateKey);
  }
}

interface CachedStep {
  hash: string;
  result: StepResult;
  timestamp: string;
  stateBefore?: any;   // NEW
  stateAfter?: any;    // NEW
}
```

---

## 3. State-Aware Executor

### Resume from State Checkpoint

```typescript
// core/src/stories/StoryExecutor.ts

export class StoryExecutor {
  private cache: StoryCache;
  private page: Page;
  private componentStates: Map<string, any>;

  /**
   * Execute graph with state-aware caching
   */
  async execute(graph: StoryGraph): Promise<ExecutionResult> {
    const results: Map<string, StepResult> = new Map();
    let cached = 0;
    let executed = 0;
    let failed = 0;

    for (const nodeId of graph.executionOrder) {
      const node = graph.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Check cache with state
      const cachedResult = this.cache.get(node);
      
      if (cachedResult && cachedResult.success) {
        console.log(`✓ Cached: ${node.step.text}`);
        console.log(`  State: ${JSON.stringify(node.stateBefore)} → ${JSON.stringify(node.stateAfter)}`);
        
        results.set(nodeId, cachedResult);
        node.cached = true;
        node.result = cachedResult;
        
        // Restore state from cache
        if (node.component && node.stateAfter) {
          this.componentStates.set(node.component, node.stateAfter);
        }
        
        cached++;
        continue;
      }

      // Execute step
      console.log(`⚡ Running: ${node.step.text}`);
      console.log(`  State before: ${JSON.stringify(node.stateBefore)}`);
      
      try {
        const result = await this.executeStepWithState(node);
        results.set(nodeId, result);
        node.result = result;

        // Cache successful result with state
        if (result.success) {
          this.cache.set(node, result);
        }

        console.log(`  State after: ${JSON.stringify(node.stateAfter)}`);
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
      componentStates: Object.fromEntries(this.componentStates),
      stateCheckpoints: this.getStateCheckpoints(graph), // NEW
    };
  }

  /**
   * Get all state checkpoints from graph
   */
  private getStateCheckpoints(graph: StoryGraph): StateCheckpoint[] {
    const checkpoints: StateCheckpoint[] = [];
    
    for (const node of graph.nodes) {
      if (node.component && node.stateAfter !== undefined && node.cached) {
        checkpoints.push({
          nodeId: node.id,
          component: node.component,
          state: node.stateAfter,
          stepText: node.step.text,
        });
      }
    }
    
    return checkpoints;
  }

  /**
   * Resume execution from a state checkpoint
   */
  async resumeFrom(
    graph: StoryGraph,
    checkpointNodeId: string
  ): Promise<ExecutionResult> {
    console.log(`🔄 Resuming from checkpoint: ${checkpointNodeId}`);
    
    // Find checkpoint node
    const checkpointNode = graph.nodes.find(n => n.id === checkpointNodeId);
    if (!checkpointNode) {
      throw new Error(`Checkpoint node not found: ${checkpointNodeId}`);
    }

    // Restore state from checkpoint
    if (checkpointNode.component && checkpointNode.stateAfter) {
      this.componentStates.set(checkpointNode.component, checkpointNode.stateAfter);
      await this.setComponentState(checkpointNode.component, checkpointNode.stateAfter);
      console.log(`  📦 Restored state: ${JSON.stringify(checkpointNode.stateAfter)}`);
    }

    // Find index in execution order
    const startIndex = graph.executionOrder.indexOf(checkpointNodeId) + 1;
    
    // Execute from next node
    const remainingNodes = graph.executionOrder.slice(startIndex);
    console.log(`  ⚡ Executing ${remainingNodes.length} remaining steps...`);
    
    // Create sub-graph for remaining execution
    const subGraph: StoryGraph = {
      ...graph,
      executionOrder: remainingNodes,
    };
    
    return await this.execute(subGraph);
  }
}

interface StateCheckpoint {
  nodeId: string;
  component: string;
  state: any;
  stepText: string;
}

interface ExecutionResult {
  totalSteps: number;
  cached: number;
  executed: number;
  failed: number;
  duration: number;
  results: Map<string, StepResult>;
  graph: StoryGraph;
  componentStates: Record<string, any>;
  stateCheckpoints: StateCheckpoint[]; // NEW
}
```

---

## 4. Example: State-Aware Caching

### Gherkin Story

```gherkin
Feature: Counter with State Checkpoints

  Scenario: Multiple increments from zero
    Given counter state is Components.Examples.counter.state.zero
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    Then counter state should be Components.Examples.counter.state.three

  Scenario: Multiple increments from five
    Given counter state is Components.Examples.counter.state.five
    When I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    And I click Components.Examples.counterIncrement
    Then counter state should be Components.Examples.counter.state.eight
```

### Execution with Caching

#### First Run (Scenario 1)

```
Node 1: Given counter state is zero
  State: null → {count:0}
  Hash: counter-null-zero-a3f2
  Cache: MISS ⚡ Execute
  
Node 2: When I click increment
  State: {count:0} → {count:1}
  Hash: counter-a3f2-increment-b7c8
  Cache: MISS ⚡ Execute
  
Node 3: And I click increment
  State: {count:1} → {count:2}
  Hash: counter-b7c8-increment-c9d4
  Cache: MISS ⚡ Execute
  
Node 4: And I click increment
  State: {count:2} → {count:3}
  Hash: counter-c9d4-increment-e1f5
  Cache: MISS ⚡ Execute
```

#### Second Run (Scenario 1 - Fully Cached)

```
Node 1: ✅ Cache hit: counter-null-zero-a3f2
Node 2: ✅ Cache hit: counter-a3f2-increment-b7c8
Node 3: ✅ Cache hit: counter-b7c8-increment-c9d4
Node 4: ✅ Cache hit: counter-c9d4-increment-e1f5

Result: 100% cache hit rate!
```

#### Third Run (Scenario 2 - Different Starting State)

```
Node 1: Given counter state is five
  State: null → {count:5}
  Hash: counter-null-five-k8m2
  Cache: MISS ⚡ Execute (different state!)
  
Node 2: When I click increment
  State: {count:5} → {count:6}
  Hash: counter-k8m2-increment-n3p7
  Cache: MISS ⚡ Execute (different starting state!)
  
Node 3: And I click increment
  State: {count:6} → {count:7}
  Hash: counter-n3p7-increment-q5r9
  Cache: MISS ⚡ Execute
  
Node 4: And I click increment
  State: {count:7} → {count:8}
  Hash: counter-q5r9-increment-t2v6
  Cache: MISS ⚡ Execute
```

---

## 5. State Checkpoint Resume

### Use Case: Debug from Failure Point

```typescript
// Test failed at step 3, resume from step 2 checkpoint

const graph = StoryGraphBuilder.buildGraph(feature, stateContracts);
const executor = new StoryExecutor(page, '.story-cache');

try {
  const result = await executor.execute(graph);
} catch (error) {
  console.log('Test failed!');
  console.log('Available checkpoints:', result.stateCheckpoints);
  
  // Resume from last successful checkpoint
  const lastCheckpoint = result.stateCheckpoints[result.stateCheckpoints.length - 1];
  console.log(`Resuming from: ${lastCheckpoint.stepText}`);
  
  const resumeResult = await executor.resumeFrom(graph, lastCheckpoint.nodeId);
}
```

---

## 6. Cache Invalidation

### When State Changes

```typescript
// If you update a data contract
ExamplesData.counter.state.zero = { count: 10 }; // Changed from 0 to 10

// Hash changes:
OLD: counter-a3f2-increment  (state hash from {count:0})
NEW: counter-k8m2-increment  (state hash from {count:10})

// Result: Cache miss, re-execution required ✅
```

### Invalidate All for Component

```typescript
// StoryCache.ts

invalidateComponent(component: string): void {
  const keysToDelete: string[] = [];
  
  for (const key of this.cache.keys()) {
    if (key.startsWith(`${component}-`)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => this.cache.delete(key));
  
  console.log(`🗑️ Invalidated ${keysToDelete.length} cache entries for ${component}`);
  this.save();
}
```

---

## Summary

### Hash Pattern

```
node.hash = sha256(component + stateBefore + action + stateAfter)
cache.key = ${component}-${stateHash(stateBefore)}-${action}
```

### Benefits

1. ✅ **State-aware caching**: Same action, different states → different cache
2. ✅ **State checkpoints**: Can resume from any node
3. ✅ **Correct invalidation**: State changes invalidate cache
4. ✅ **Debuggable**: See exact state at each step
5. ✅ **Efficient**: Only re-run steps affected by state changes

### Example Flow

```
Story 1: Start from {count:0}, increment 3 times
  → Creates cache entries: 0→1, 1→2, 2→3
  → Next run: 100% cache hit

Story 2: Start from {count:5}, increment 3 times
  → Creates cache entries: 5→6, 6→7, 7→8
  → Different states = different cache entries
  → Story 1 cache still valid!
```

This makes the graph a **true state machine with checkpoints**! 🚀

