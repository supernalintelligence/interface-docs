# Test Fixes Needed - Status Report

**Date**: 2026-01-20
**Status**: 130 tests failing, root cause identified
**Priority**: HIGH - Blocks release

---

## What We Fixed Today

### ✅ Core Infrastructure Fixes
1. **getContainerFromRoute route matching** (enterprise/NavigationGraph.ts)
   - Fixed to sort routes by length (longest first)
   - Ensures `/demo/simple` matches before `/demo`
   - **Result**: Demo pages now correctly match DemoSimple container

2. **Examples page container ID** (docs-site/ExampleTools.ts)
   - Changed `containerId` from `'/examples'` (route) to `'Examples'` (container ID)
   - **Result**: Examples page tools now found correctly

3. **Test fixtures contract** (docs-site/tests/fixtures.ts)
   - Changed from `ComponentNames.Chat.input` to `Components.ChatInput`
   - **Result**: demo-commands tests now pass (3/3 ✅)

### ✅ Tests Passing
- `tests/e2e/demo-commands.spec.ts` - All 3 tests passing
  - Simple demo - "open menu" command works ✅
  - Advanced demo - "toggle notifications" command works ✅
  - Simple demo - "set theme dark" command works ✅

---

## Root Cause of 130 Test Failures

### Problem: Contract Mismatch

There are **TWO** component contract files:

1. **`src/architecture/Components.ts`** (NEW - Canonical)
   ```typescript
   export const Components = {
     ChatBubble: 'chat-bubble',
     ChatInput: 'chat-input',
     ChatSendButton: 'chat-send-button',
     OpenMenuButton: 'open-main-menu',
     // ... flat structure
   }
   ```

2. **`src/architecture/ComponentNames.ts`** (OLD - Demo-specific)
   ```typescript
   export const Chat = {
     bubble: 'chat-bubble',
     input: 'chat-input',
     sendButton: 'chat-send-button',
   }
   export const Counter = { ... }
   export const Demo = { ... }
   // ... nested structure
   ```

### The Mismatch

- **Source components** use: `Components.ts` (flat: `ChatInput`)
- **Test files** use: `ComponentNames.ts` (nested: `Chat.input`)
- **Result**: Tests look for wrong testids

### Impact

```bash
grep -r "from.*ComponentNames" tests/ --include="*.ts" | wc -l
# Result: 12 files importing ComponentNames
```

Affected test files:
- tests/blog-navigation.spec.ts
- tests/navigation.spec.ts
- tests/examples.spec.ts
- tests/e2e/blog-navigation.spec.ts
- tests/e2e/chat-bubble-debug.spec.ts
- tests/e2e/architecture-page.spec.ts
- tests/generated/counter.e2e.spec.ts
- tests/generated/basic/counter.basic.e2e.spec.ts
- Plus generated story tests

---

## What Needs To Be Fixed

### Step 1: Decide on Single Source of Truth

**Option A: Use Components.ts everywhere (RECOMMENDED)**
- ✅ Matches actual component testids
- ✅ Flat structure easier to use
- ✅ Canonical contract
- ❌ Requires updating all test files

**Option B: Use ComponentNames.ts everywhere**
- ✅ Matches test expectations
- ❌ Doesn't match actual component testids
- ❌ Demo-specific, not canonical
- ❌ Nested structure more complex

**RECOMMENDATION**: Choose Option A (Components.ts)

### Step 2: Update All Test Imports

Replace:
```typescript
import { Chat, Counter, Demo } from '../architecture/ComponentNames';
```

With:
```typescript
import { Components } from '../architecture/Components';
```

### Step 3: Update All Component References

Replace nested references:
```typescript
// OLD
Chat.input → Components.ChatInput
Chat.bubble → Components.ChatBubble
Chat.sendButton → Components.ChatSendButton
Counter.increment → Components.CounterIncrement  // (if exists)
Demo.openMenu → Components.OpenMenuButton
```

### Step 4: Fix Generated Tests

Generated story tests use `testId(Chat.input)` helper. Either:
1. Update story test generator to use flat Components
2. Create adapter: `const Chat = { input: Components.ChatInput, ... }`

---

## Migration Script

```bash
# 1. Update imports (already done via sed)
find tests/ -name "*.ts" -exec sed -i "s|from.*ComponentNames.*|from '../../src/architecture/Components'|g" {} \;

# 2. Update references (manual - too complex for sed)
# Need to handle:
# - Chat.input → Components.ChatInput
# - Chat.bubble → Components.ChatBubble
# - etc.

# 3. Regenerate story tests
npm run story:generate
```

---

## Alternative: Create Adapter

Instead of updating all tests, create an adapter in ComponentNames.ts:

```typescript
// ComponentNames.ts
import { Components } from './Components';

// Adapter: Export nested structure backed by flat Components
export const Chat = {
  bubble: Components.ChatBubble,
  input: Components.ChatInput,
  sendButton: Components.ChatSendButton,
  clearButton: Components.ChatClearButton,
  messages: Components.ChatMessages,
} as const;

export const Counter = {
  increment: Components.CounterIncrement,
  decrement: Components.CounterDecrement,
  reset: Components.CounterReset,
  display: Components.CounterDisplay,
} as const;

// ... etc for all components
```

**Pros**:
- Tests continue to work without changes
- Gradual migration possible

**Cons**:
- Maintains two contracts
- More complexity
- Doesn't fix the root issue

---

## Recommended Approach

### Phase 1: Create Adapter (Quick Fix - 1 hour)
1. Update `ComponentNames.ts` to re-export from `Components.ts`
2. Verify tests pass
3. Deploy

### Phase 2: Migrate Tests (Proper Fix - 4-6 hours)
1. Update all test imports to use `Components.ts`
2. Update all component references to flat structure
3. Regenerate story tests
4. Remove ComponentNames adapter
5. Document Components.ts as canonical

---

## Test Categories

### Tests Using Contracts Correctly ✅
- `tests/e2e/demo-commands.spec.ts` (3/3 passing)
- Any tests already using `Components.ts`

### Tests Needing Contract Updates ❌
All others (130 failing)

### Auto-Generated Tests 🔄
- `tests/generated/stories/*.spec.ts`
- Need story generator updated or re-run

---

## Next Steps

### Immediate (Today)
1. ✅ Document the issue (this file)
2. ⏭️ Choose approach (Adapter vs Full Migration)
3. ⏭️ Implement chosen approach
4. ⏭️ Verify tests pass

### Short-term (This Week)
1. Update story test generator
2. Migrate remaining tests
3. Remove ComponentNames if using adapter approach

### Long-term
1. Enforce Components.ts usage via linting
2. Document contract patterns
3. Create migration guide for new tests

---

## Files Modified Today

### ✅ Committed
- enterprise/src/navigation/NavigationGraph.ts
- docs-site/src/tools/ExampleTools.ts
- docs-site/tests/fixtures.ts
- docs-site/FIXES_2026-01-19.md

### ⏳ Staged (sed changes)
- 12 test files with updated imports
- But component references not updated yet

---

## Questions for Team

1. **Contract Strategy**: Use Components.ts everywhere or create adapter?
2. **Migration Timeline**: Fix all now or gradual migration?
3. **Generated Tests**: Update generator or manually update?
4. **Breaking Changes**: OK to break tests temporarily during migration?

---

**Status**: Waiting for decision on approach before proceeding with test fixes.
