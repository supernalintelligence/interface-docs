---
title: "Data Contract Migration"
description: "Migration plan for separating generic types from demo-specific data"
category: "Story System"
order: 11
showToc: true
---

# Data Contract Architecture Migration

## Issue Identified

Demo data (`DemoComponentData.ts`) was incorrectly placed in `/core/src/architecture/` when it should be in `/demo/src/data/`.

**Core Principle**: 
- **Core** = Types, infrastructure, framework-agnostic utilities
- **Demo** = Example implementations, sample data, demonstrations

## Current State (Week 3)

- ✅ **Types Separated**: Created `/core/src/architecture/DataContractTypes.ts` with framework-agnostic types
- ⚠️ **Demo Data Still in Core**: `/core/src/architecture/DemoComponentData.ts` remains for backwards compatibility
- ✅ **New Demo Data Created**: `/demo/src/data/DemoComponentData.ts` with proper minimal boilerplate

## Architecture

```
/core/src/architecture/
  ├── DataContractTypes.ts        ✅ Core types (ComponentState, ComponentContract, etc.)
  ├── DemoComponentData.ts         ⚠️ DEPRECATED - kept for test compatibility
  └── index.ts                     ✅ Exports types only

/demo/src/data/
  └── DemoComponentData.ts         ✅ NEW - proper location for demo data
```

## New Pattern (Minimal Boilerplate)

```typescript
// In demo/src/data/DemoComponentData.ts

import type { 
  ComponentState,
  TypedComponentContract,
  DataContractRegistry 
} from '@supernal/core/architecture/DataContractTypes';

// 1. Define your state interface
export interface CounterState extends ComponentState {
  readonly count: number;
}

// 2. Create contract with `satisfies` for type safety
export const CounterContract = {
  state: {
    zero: { count: 0 } as const,
    five: { count: 5 } as const,
  },
  after: {
    increment: { count: 1 } as const,
  },
} as const satisfies TypedComponentContract<CounterState>;
//          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//          This provides compile-time type checking with minimal boilerplate!

// 3. Build registry
export const DemoComponentData = {
  counter: CounterContract,
  chat: ChatContract,
} as const satisfies DataContractRegistry;
```

**Key Benefits**:
- ✅ No manual type definitions needed
- ✅ Compile-time type safety via `satisfies`
- ✅ IntelliSense works perfectly
- ✅ Minimal boilerplate

## Migration Plan

### Phase 1: Type Separation (✅ DONE - Week 3)
- Create `DataContractTypes.ts` with core types
- Create new demo data in `/demo/src/data/`
- Update core architecture exports to only export types

### Phase 2: Test Migration (⏳ FUTURE)
- Update tests to import from demo package instead of core
- This requires:
  1. Updating all test imports
  2. Ensuring demo package is built before core tests run
  3. Verifying all 97+ tests still pass

### Phase 3: Deprecation (⏳ FUTURE - Week 4+)
- Add `@deprecated` JSDoc to old file
- Create console warnings when old path is used
- Update documentation

### Phase 4: Removal (⏳ FUTURE - Post Week 4)
- Remove `DemoComponentData.ts` from core
- Confirm all tests use new location
- Update all documentation

## Why Not Now?

**Current Status**: Week 3 - State-Aware Caching (60% complete)

**Rationale**:
1. **97 passing tests** depend on current structure
2. **Active development** on Week 3 features
3. **Migration is non-trivial** (build order, imports, test updates)
4. **No functional impact** - architectural cleanup can wait

**Decision**: Complete Week 3 & 4 implementation first, then migrate as cleanup.

## For New Applications

**Use this pattern**:

```typescript
// your-app/src/data/AppComponentData.ts
import type { TypedComponentContract, DataContractRegistry } from '@supernal/core';

export interface YourState extends ComponentState {
  // your state
}

export const YourContract = {
  state: { ... },
  after: { ... },
} as const satisfies TypedComponentContract<YourState>;

export const AppData = {
  yourComponent: YourContract,
} as const satisfies DataContractRegistry;
```

**Don't import** from `/core/src/architecture/DemoComponentData.ts` - that's demo data, not yours!

## References

- [DataContractTypes.ts](/core/src/architecture/DataContractTypes.ts) - Core types
- [Demo Data (new)](/demo/src/data/DemoComponentData.ts) - Proper location
- [Demo Data (old)](/core/src/architecture/DemoComponentData.ts) - Deprecated, kept for tests

---

**Status**: Documented, migration deferred to post-Week 4 cleanup phase.

