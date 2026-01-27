# Test Status Report

**Date**: 2026-01-20
**Status**: Core fixes complete, hierarchical naming confirmed
**Tests Passing**: 3/3 demo-commands, enterprise & open-source all pass
**Tests Failing**: ~130 in docs-site (need contract import fixes)

---

## ✅ What We Fixed Today

### 1. Core Infrastructure (Enterprise & Open-Source)
- **getContainerFromRoute**: Sort routes by length (child before parent)
  - `/demo/simple` now matches before `/demo`
  - **Result**: Context correctly set to 'DemoSimple' not 'Demo'
- **Examples containerId**: Changed from `'/examples'` to `'Examples'`
  - **Result**: Examples page tools now found

### 2. Hierarchical Component Names (CORRECT Pattern)
**Confirmed**: `ComponentNames.ts` is the canonical source with proper namespace organization:

```typescript
// ✅ CORRECT - Hierarchical namespacing
import { Chat, Demo, Counter } from '../architecture/ComponentNames';

// Usage
Chat.input          // 'chat-input'
Chat.bubble         // 'chat-bubble'
Demo.openMainMenu   // 'open-main-menu'
Counter.increment   // 'examples-counter-increment'
```

**Why hierarchical is better**:
- Organizational clarity (Chat.*, Demo.*, Counter.*)
- Prevents naming conflicts
- IDE autocomplete groups related components
- Scales better than flat namespace

### 3. Tests Passing with Hierarchical Names
```bash
tests/e2e/demo-commands.spec.ts - 3/3 ✅
  ✓ Simple demo - "open menu" command works
  ✓ Advanced demo - "toggle notifications" command works
  ✓ Simple demo - "set theme dark" command works
```

---

## ❌ Remaining Test Failures (~130)

### Root Cause
Tests were using the wrong import path after automated sed replacement:

```typescript
// ❌ WRONG - After sed replacement
import { Chat } from '../../src/architecture/Components';
// Components.ts doesn't export Chat!

// ✅ CORRECT
import { Chat } from '../../src/architecture/ComponentNames';
```

### Affected Files
The sed command changed ALL imports from ComponentNames to Components, but:
1. Components.ts is a flat contract (deprecated/wrong)
2. ComponentNames.ts is hierarchical (correct)
3. Tests need ComponentNames hierarchy

```bash
grep -r "from.*Components'" tests/ --include="*.ts" -l
# Returns: ~12 test files with wrong imports
```

---

## 🔧 How To Fix

### Quick Fix (Automated)
```bash
# Revert sed changes - use ComponentNames everywhere
find tests/ -name "*.ts" -exec sed -i \
  "s|from '../../src/architecture/Components'|from '../../src/architecture/ComponentNames'|g" {} \;
```

### Verify Pattern
After fix, tests should import like this:

```typescript
// For chat components
import { Chat } from '../architecture/ComponentNames';
await page.locator(`[data-testid="${Chat.input}"]`);

// For demo widgets
import { Demo } from '../architecture/ComponentNames';
await page.locator(`[data-testid="${Demo.openMainMenu}"]`);

// For counter
import { Counter } from '../architecture/ComponentNames';
await page.locator(`[data-testid="${Counter.increment}"]`);
```

---

## 📋 Component Name Contracts

### ComponentNames.ts (Canonical ✅)
Hierarchical organization by domain:

- **GlobalNav**: `home`, `demo`, `dashboard`, `architecture`, `docs`, `examples`, `blog`
- **Chat**: `bubble`, `input`, `sendButton`, `messages`, `clearButton`
- **Demo**: `openMainMenu`, `closeMainMenu`, `featureToggle`, `notificationToggle`, `themeToggle`, etc.
- **Counter**: `widget`, `increment`, `decrement`, `reset`
- **Examples**: `title`, `container`, `list`, counter components

### Components.ts (Deprecated ❌)
Flat structure - DO NOT USE:
- `ChatBubble`, `ChatInput`, `OpenMenuButton`, etc.
- No organizational hierarchy
- Naming conflicts likely
- Not used by actual components

---

## 🎯 Next Steps

### Immediate
1. Run sed command to fix test imports back to ComponentNames
2. Run full test suite
3. Fix any remaining import issues manually

### Verification
```bash
# Should find 0 results (all using ComponentNames)
grep -r "from.*'/Components'" tests/ --include="*.ts"

# Should find all test files
grep -r "from.*'ComponentNames'" tests/ --include="*.ts"
```

---

## 📊 Summary

| Item | Status |
|------|--------|
| Enterprise tests | ✅ Passing |
| Open-source tests | ✅ Passing |
| demo-commands tests | ✅ Passing (3/3) |
| Remaining docs-site tests | ❌ Failing (~130) |
| **Root cause** | ✅ Identified (wrong imports) |
| **Fix** | ⏳ Ready to apply (sed command) |

### Core Fixes Complete ✅
- getContainerFromRoute sorting
- Examples containerId
- Hierarchical naming pattern confirmed

### Remaining Work ⏳
- Fix test imports (automated sed)
- Verify all tests pass
- Document final state

---

**Last Updated**: 2026-01-20 23:47
**Next Action**: Apply sed fix to revert all test imports to ComponentNames
