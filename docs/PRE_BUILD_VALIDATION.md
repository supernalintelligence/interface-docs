# Pre-Build Validation System

## Overview

Automated validation tests that run BEFORE builds to catch common issues that would cause build failures.

## What It Checks

### 1. 'use client' Directive Placement ✅
- **Issue**: Next.js requires 'use client' to be the FIRST line in client components
- **Validator**: `scripts/validate-client-directives.ts`
- **Catches**: Imports, comments, or code before 'use client'
- **Run**: `npm run validate`

### 2. TypeScript Compilation (in test)
- **Issue**: Type errors that would fail the build
- **Catches**: Type mismatches, missing imports, etc.
- **Run**: `npm run test:pre-build`

### 3. Node.js fs Module in Browser Code (in test)
- **Issue**: Using Node.js modules in browser-side code
- **Catches**: `import fs from 'fs'` in components, hooks, etc.
- **Run**: `npm run test:pre-build`

### 4. Console.log Warnings (in test)
- **Issue**: Debug statements left in production code
- **Catches**: console.log (warning only, doesn't fail)
- **Run**: `npm run test:pre-build`

## Usage

### Quick Validation (Pre-Commit)
```bash
npm run validate
```

### Full Pre-Build Test Suite
```bash
npm run test:pre-build
```

### Automatic (Runs Before Build)
```bash
npm run build  # Automatically runs validation first
```

## Integration

### package.json
```json
{
  "scripts": {
    "validate": "tsx scripts/validate-client-directives.ts",
    "prebuild": "npm run validate && npm run sync:docs && cd ../ && pnpm build",
    "test:pre-build": "playwright test tests/pre-build.spec.ts --reporter=list"
  }
}
```

### Git Hooks (Optional)
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
npm run validate
```

## Files

- **scripts/validate-client-directives.ts** - Main validator script
- **tests/pre-build.spec.ts** - Playwright test suite
- **package.json** - npm scripts configuration

## Common Errors

### Error: 'use client' must be on line 1
```typescript
// ❌ WRONG
/**
 * Component description
 */
'use client';

// ✅ CORRECT
'use client';

/**
 * Component description
 */
```

### Error: fs module in browser code
```typescript
// ❌ WRONG - src/components/MyComponent.tsx
import fs from 'fs';

// ✅ CORRECT - Use API route instead
// src/pages/api/my-endpoint.ts
import fs from 'fs';
```

## Benefits

1. **Catches errors early** - Before wasting time on builds
2. **Clear error messages** - Shows exactly what's wrong and how to fix it
3. **Fast feedback** - Runs in seconds
4. **Automated** - No manual checking needed
5. **Consistent** - Same checks for everyone

## Extending

To add new validations, edit:
- `tests/pre-build.spec.ts` - Add new test cases
- `scripts/` - Add new validator scripts
- `package.json` - Add npm scripts

## Status

✅ **Active** - Runs automatically before every build

