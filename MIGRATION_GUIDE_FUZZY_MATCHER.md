# Migration Guide: Demo FuzzyMatch → Core ToolMatcher

## Overview

The demo currently has a custom `fuzzyMatch.ts` implementation that duplicates functionality already in `@supernal-interface/core`. This guide shows how to properly migrate to the core's more sophisticated matching system.

---

## API Comparison

### Current Demo API (fuzzyMatch.ts)

```typescript
import { findBestMatch } from './fuzzyMatch';

const result = findBestMatch(query, tools);
// Returns: { tool, score, confidence }
// - tool: ToolMetadata | undefined
// - score: number (raw score)
// - confidence: number (0-1)
```

### Core API (ToolMatcher)

```typescript
import { ToolMatcher } from '@supernal-interface/core';

const matcher = new ToolMatcher();
const matches = await matcher.findMatches(query, tools, context);
// Returns: Promise<ToolMatch[]>
// - tool: ToolMetadata
// - confidence: number (0-100, not 0-1!)
// - parameters?: any[]
// - reasoning?: string
```

**⚠️ Key Differences:**
1. **Async**: Core API is async (returns Promise)
2. **Confidence scale**: Demo uses 0-1, Core uses 0-100
3. **Array result**: Core returns array of matches (sorted by confidence), demo returns single match
4. **Parameters**: Core can extract parameters automatically
5. **Context**: Core accepts optional context for better matching

---

## Migration Steps

### 1. AIInterface.ts

**Location**: `core/demo/src/lib/AIInterface.ts:296`

**Current Code:**
```typescript
import { findBestMatch } from './fuzzyMatch';

// Line 296
const { tool: bestTool, score: bestScore, confidence } = findBestMatch(query, matchingTools);

// Later usage (line 299+)
if (bestTool) {
  console.log(`✅ [AIInterface] Best match: ${bestTool.name} (score: ${bestScore}, confidence: ${(confidence * 100).toFixed(0)}%)`);
  
  return {
    query,
    tool: bestTool,
    confidence,
    requiresApproval: confidence < 0.7
  };
}
```

**New Code:**
```typescript
import { ToolMatcher, MatchContext } from '@supernal-interface/core';

// Add as class property
private toolMatcher = new ToolMatcher();

// In findToolsForCommand method (replace line 296)
const context: MatchContext = {
  currentContainer,
  currentPage: currentPage || this.getCurrentContainer()
};

const matches = await this.toolMatcher.findMatches(query, matchingTools, context, 1);
const bestMatch = matches[0];

if (bestMatch) {
  const confidencePercent = bestMatch.confidence; // Already 0-100
  console.log(`✅ [AIInterface] Best match: ${bestMatch.tool.name} (confidence: ${confidencePercent}%, reasoning: ${bestMatch.reasoning})`);
  
  return {
    query,
    tool: bestMatch.tool,
    confidence: bestMatch.confidence / 100, // Convert to 0-1 for compatibility
    requiresApproval: bestMatch.confidence < 70,
    parameters: bestMatch.parameters // NEW: Extracted parameters!
  };
}
```

**Changes Needed:**
1. Make `findToolsForCommand` async: `async findToolsForCommand(...)`
2. Make `findAndExecuteCommand` await the call (it already is async)

---

### 2. MockAIAdapter.ts

**Location**: `core/demo/src/lib/MockAIAdapter.ts:73`

**Current Code:**
```typescript
import { findBestMatch } from './fuzzyMatch';

const match = findBestMatch(userQuery, allTools);

if (match.tool && match.confidence >= 0.3) {
  const args = extractArguments(userQuery, match.tool);
  // ...
}
```

**New Code:**
```typescript
import { ToolMatcher } from '@supernal-interface/core';

// Add as class property
private toolMatcher = new ToolMatcher();

// In process method
const matches = await this.toolMatcher.findMatches(userQuery, allTools, undefined, 1);
const bestMatch = matches[0];

if (bestMatch && bestMatch.confidence >= 30) { // Note: 30 instead of 0.3
  const toolName = bestMatch.tool.name || `${bestMatch.tool.componentName}.${bestMatch.tool.methodName}`;
  const args = bestMatch.parameters?.[0] 
    ? { value: bestMatch.parameters[0] }
    : extractArguments(userQuery, bestMatch.tool); // Fallback to old logic
  // ...
}
```

**Note**: Keep the `extractArguments` fallback for now since it handles theme/priority extraction that ToolMatcher doesn't know about yet.

---

### 3. copilotkit.ts API Endpoint

**Location**: `core/demo/src/pages/api/copilotkit.ts:13`

**Current Code:**
```typescript
import { findBestMatch } from '../../lib/fuzzyMatch';

// Line 87 in FuzzyMatchAdapter
const match = findBestMatch(userQuery, allTools);

if (match.tool && match.confidence >= 0.3) {
  // ...
}
```

**New Code:**
```typescript
import { ToolMatcher } from '@supernal-interface/core';

class FuzzyMatchAdapter {
  private toolMatcher = new ToolMatcher();
  
  async process(request: any): Promise<{ threadId: string }> {
    // ...
    
    const matches = await this.toolMatcher.findMatches(userQuery, allTools, undefined, 1);
    const bestMatch = matches[0];
    
    if (bestMatch && bestMatch.confidence >= 30) {
      const toolName = bestMatch.tool.name || `${bestMatch.tool.componentName}.${bestMatch.tool.methodName}`;
      const args = bestMatch.parameters?.length 
        ? { ...bestMatch.parameters[0] } 
        : extractArgsFromQuery(userQuery, bestMatch.tool);
      // ...
    }
  }
}
```

---

## Benefits of Core ToolMatcher

### 1. **Multiple Strategies**
- Exact matching (priority 100)
- Fuzzy matching with Levenshtein distance (priority 60)
- Keyword overlap
- Extensible: Register your own strategies

### 2. **Better Scoring**
```typescript
// Demo's simple scoring
if (exampleLower === lowerQuery) score += 20;

// Core's sophisticated scoring
const distance = this.levenshtein(a, b);
const maxLength = Math.max(a.length, b.length);
return 1 - (distance / maxLength);
```

### 3. **Context-Aware Matching**
```typescript
const context: MatchContext = {
  currentContainer: 'Dashboard',
  currentPage: '/dashboard',
  conversationHistory: ['previous', 'commands'],
  userPreferences: { theme: 'dark' }
};

const matches = await matcher.findMatches(query, tools, context);
// Future: Can use context to prefer certain tools
```

### 4. **Parameter Extraction**
```typescript
// Automatically extracts parameters from queries like:
// "increment by 5" → parameters: [5]
// "open blog how to start" → parameters: ["how to start"]
// "set theme dark" → parameters: ["dark"]
```

### 5. **Reasoning/Debugging**
```typescript
const match = matches[0];
console.log(match.reasoning);
// Output: "Fuzzy match: increment counter"
// Or: "Exact example match: 'increment counter'"
```

---

## Testing Strategy

### Phase 1: Parallel Testing
Keep both implementations temporarily and compare results:

```typescript
// Temporary comparison code
const oldMatch = findBestMatch(query, tools);
const newMatches = await this.toolMatcher.findMatches(query, tools);
const newMatch = newMatches[0];

console.log('=== MATCHER COMPARISON ===');
console.log('Old:', oldMatch.tool?.name, 'confidence:', oldMatch.confidence);
console.log('New:', newMatch?.tool.name, 'confidence:', newMatch?.confidence / 100);
console.log('Parameters:', newMatch?.parameters);
console.log('Reasoning:', newMatch?.reasoning);
```

### Phase 2: Unit Tests
Create tests in `core/demo/tests/fuzzy-match-migration.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { ToolMatcher } from '@supernal-interface/core';

test('ToolMatcher matches increment commands', async () => {
  const matcher = new ToolMatcher();
  const tools = [/* mock tools */];
  
  const matches = await matcher.findMatches('increment counter', tools);
  expect(matches[0].confidence).toBeGreaterThan(80);
  expect(matches[0].tool.name).toContain('increment');
});

test('ToolMatcher extracts parameters', async () => {
  const matcher = new ToolMatcher();
  const matches = await matcher.findMatches('increment by 5', tools);
  
  expect(matches[0].parameters).toEqual([5]);
});
```

### Phase 3: Remove Old Code
Once tests pass and behavior is verified:
1. Delete `core/demo/src/lib/fuzzyMatch.ts`
2. Remove all `import { findBestMatch } from './fuzzyMatch'`
3. Update any remaining references

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting Async
```typescript
// WRONG
const matches = this.toolMatcher.findMatches(query, tools);
const best = matches[0]; // ERROR: matches is a Promise!

// CORRECT
const matches = await this.toolMatcher.findMatches(query, tools);
const best = matches[0]; // ✓
```

### ❌ Pitfall 2: Confidence Scale
```typescript
// WRONG (mixing scales)
if (match.confidence >= 0.7) { ... } // Core uses 0-100, not 0-1!

// CORRECT
if (match.confidence >= 70) { ... } // ✓
```

### ❌ Pitfall 3: Single vs Array
```typescript
// WRONG
const match = await matcher.findMatches(...); // Returns array!
if (match.tool) { ... } // ERROR: match is an array

// CORRECT
const matches = await matcher.findMatches(...);
const bestMatch = matches[0]; // ✓
if (bestMatch) { ... }
```

### ❌ Pitfall 4: Not Handling Empty Results
```typescript
// WRONG
const matches = await matcher.findMatches(query, tools);
const confidence = matches[0].confidence; // ERROR if no matches!

// CORRECT
const matches = await matcher.findMatches(query, tools);
if (matches.length === 0) {
  return { query, confidence: 0, requiresApproval: false };
}
const bestMatch = matches[0]; // ✓
```

---

## Rollout Plan

### Step 1: Prepare (Don't Break Anything)
1. Read this guide
2. Add ToolMatcher as dependency (already available)
3. Add parallel testing code to compare results

### Step 2: Migrate One File at a Time
1. Start with **MockAIAdapter.ts** (simplest usage)
2. Then **copilotkit.ts** (API endpoint)
3. Finally **AIInterface.ts** (most complex)

### Step 3: Verify
1. Run demo: `npm run dev`
2. Test commands: "increment counter", "set theme dark", "navigate to blog"
3. Check console logs for comparison results
4. Verify parameters are extracted correctly

### Step 4: Clean Up
1. Remove fuzzyMatch.ts
2. Remove comparison logging
3. Update any related docs

---

## Need Help?

If migration issues occur:
1. Check confidence scale (0-100 vs 0-1)
2. Verify async/await usage
3. Look at `match.reasoning` for debugging
4. Compare old vs new results side-by-side

## Future Enhancements

Once migrated, you can:
1. **Add LLM strategy**: Register semantic matching with OpenAI
2. **Custom strategies**: Add domain-specific matchers
3. **Context usage**: Use conversation history for better matching
4. **Parameter validation**: Validate extracted parameters against schema




