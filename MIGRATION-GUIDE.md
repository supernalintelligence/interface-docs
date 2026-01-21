# Migration Guide: Making Route/Container Changes Easier

## Problem: Painful Migration Experience

When we merged `/examples` into `/demo`, the migration was painful because:

1. **Tests broke silently** - Old tests still referenced `Routes.Examples`
2. **Container scoping was unclear** - Mixing `.route` and `.id` caused mirroring failures
3. **Manual updates required** - Had to manually find and update all references
4. **No validation** - No way to detect broken references before runtime

## Solution: Automated Migration Tools

### 1. Route/Container Reference Validator

**Create**: `scripts/validate-references.js`

```javascript
/**
 * Validates that all route/container references are still valid
 * Catches broken references BEFORE they cause test failures
 */
import { Routes } from '../src/architecture/Routes';
import { DemoContainers } from '../src/architecture/DemoContainers';
import glob from 'glob';
import fs from 'fs';

// Find all route references in .feature files
const featureFiles = glob.sync('features/**/*.feature');
const routePattern = /Routes\.(\w+)/g;
const containerPattern = /Containers\.(\w+)/g;

const validRoutes = Object.keys(Routes);
const validContainers = Object.keys(DemoContainers);

let errors = [];

featureFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');

  // Check route references
  let match;
  while ((match = routePattern.exec(content)) !== null) {
    const routeName = match[1];
    if (!validRoutes.includes(routeName)) {
      errors.push(`${file}: Invalid route 'Routes.${routeName}' - route not found in Routes.ts`);
    }
  }

  // Check container references
  while ((match = containerPattern.exec(content)) !== null) {
    const containerName = match[1];
    if (!validContainers.includes(containerName)) {
      errors.push(`${file}: Invalid container 'Containers.${containerName}' - container not found`);
    }
  }
});

if (errors.length > 0) {
  console.error('❌ Reference validation failed:\n');
  errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log('✅ All route/container references are valid');
}
```

**Usage**: Add to `package.json`:
```json
{
  "scripts": {
    "validate:refs": "node scripts/validate-references.js",
    "pretest": "npm run validate:refs && npm run story:generate"
  }
}
```

### 2. Migration Helper Script

**Create**: `scripts/migrate-route.js`

```javascript
/**
 * Automates route/container migrations
 *
 * Usage: node scripts/migrate-route.js --from Examples --to Demo
 */
import glob from 'glob';
import fs from 'fs';
import { program } from 'commander';

program
  .requiredOption('--from <route>', 'Old route name (e.g., Examples)')
  .requiredOption('--to <route>', 'New route name (e.g., Demo)')
  .option('--dry-run', 'Show what would change without making changes')
  .parse();

const opts = program.opts();

// Files to update
const patterns = [
  'features/**/*.feature',
  'tests/**/*.spec.ts',
  'src/**/*.tsx',
  'src/**/*.ts',
];

let changes = [];

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { ignore: ['**/node_modules/**', '**/dist/**'] });

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const updated = content
      .replace(new RegExp(`Routes\\.${opts.from}\\b`, 'g'), `Routes.${opts.to}`)
      .replace(new RegExp(`Containers\\.${opts.from}\\b`, 'g'), `Containers.${opts.to}`)
      .replace(new RegExp(`containerId:\\s*['"]${opts.from}['"]`, 'g'), `containerId: '${opts.to}'`);

    if (content !== updated) {
      changes.push({ file, before: content, after: updated });

      if (!opts.dryRun) {
        fs.writeFileSync(file, updated, 'utf-8');
      }
    }
  });
});

if (changes.length === 0) {
  console.log(`✅ No changes needed (${opts.from} → ${opts.to})`);
} else {
  console.log(`${opts.dryRun ? '📋 Would update' : '✅ Updated'} ${changes.length} files:`);
  changes.forEach(({ file }) => console.log(`  - ${file}`));

  if (opts.dryRun) {
    console.log('\nRun without --dry-run to apply changes');
  }
}
```

**Usage**:
```bash
# Preview changes
npm run migrate:route -- --from Examples --to Demo --dry-run

# Apply changes
npm run migrate:route -- --from Examples --to Demo
```

### 3. Container ID vs Route Linter

**Create**: `scripts/lint-container-ids.js`

```javascript
/**
 * Ensures tools use container IDs (.id), not routes (.route)
 * Catches the .route vs .id mistake that broke mirroring
 */
import glob from 'glob';
import fs from 'fs';

const toolFiles = glob.sync('src/**/{tools,lib,widgets}/**/*.{ts,tsx}');
let errors = [];

toolFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check for DemoContainers.*.route in tool definitions
    if (line.includes('containerId:') && line.includes('.route')) {
      errors.push({
        file,
        line: idx + 1,
        content: line.trim(),
        message: 'Use .id instead of .route for containerId'
      });
    }
  });
});

if (errors.length > 0) {
  console.error('❌ Container ID validation failed:\n');
  errors.forEach(({ file, line, content, message }) => {
    console.error(`  ${file}:${line}`);
    console.error(`    ${content}`);
    console.error(`    Error: ${message}\n`);
  });
  process.exit(1);
} else {
  console.log('✅ All container IDs use .id (not .route)');
}
```

### 4. Dead Route Detector

**Create**: `scripts/detect-dead-routes.js`

```javascript
/**
 * Detects routes defined in Routes.ts but no longer have page files
 */
import { Routes } from '../src/architecture/Routes';
import fs from 'fs';
import path from 'path';

const deadRoutes = [];

Object.entries(Routes).forEach(([name, route]) => {
  // Skip dynamic routes
  if (route.includes(':')) return;

  // Check if page file exists
  const possiblePaths = [
    `src/pages${route}.tsx`,
    `src/pages${route}/index.tsx`,
  ];

  const exists = possiblePaths.some(p => fs.existsSync(p));

  if (!exists) {
    deadRoutes.push({ name, route });
  }
});

if (deadRoutes.length > 0) {
  console.warn('⚠️  Dead routes detected (defined in Routes.ts but no page file exists):\n');
  deadRoutes.forEach(({ name, route }) => {
    console.warn(`  - Routes.${name} = '${route}' (no page file found)`);
  });
  console.warn('\nConsider removing these from Routes.ts or creating the pages.');
} else {
  console.log('✅ No dead routes detected');
}
```

## Recommended Migration Workflow

When merging/moving routes in the future:

```bash
# 1. Detect any dead routes first
npm run detect:dead-routes

# 2. Preview migration
npm run migrate:route -- --from Examples --to Demo --dry-run

# 3. Apply migration
npm run migrate:route -- --from Examples --to Demo

# 4. Validate all references are correct
npm run validate:refs

# 5. Lint container IDs
npm run lint:container-ids

# 6. Regenerate tests
npm run story:generate

# 7. Run tests
npm run test
```

## Best Practices Going Forward

### 1. Always Use Container IDs, Never Routes

```typescript
// ❌ WRONG - Using route
@Tool({
  containerId: DemoContainers.Demo.route,  // '/demo' - breaks mirroring
})

// ✅ CORRECT - Using ID
@Tool({
  containerId: DemoContainers.Demo.id,  // 'Demo' - works with mirroring
})
```

### 2. Run Validators Before Committing

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run validate:refs
npm run lint:container-ids
```

### 3. Keep Routes.ts and Containers Synced

When you delete a page:
1. Delete the page file
2. Remove from `Routes.ts`
3. Remove from `DemoContainers.ts`
4. Run migration script to update references
5. Validate and test

### 4. Use Archive Instead of Delete

For features that might come back:
```typescript
// In DemoContainers.ts
export const ArchivedContainers = {
  Examples: { /* old definition */ },
  // ... other archived containers
};

// Keep active containers separate
export const DemoContainers = {
  Demo: { /* ... */ },
  // ... active containers
};
```

## TypeScript Improvements

### Make Container IDs Type-Safe

```typescript
// In DemoContainers.ts
export type ContainerId =
  | 'Demo'
  | 'DemoSimple'
  | 'DemoStateful'
  | 'Examples'
  | 'Blog'
  | 'Showcase'
  | 'Testing'
  | 'Stories';

// Enforce at tool definition
@Tool({
  containerId: 'Demo' as ContainerId,  // TypeScript will catch typos
})
```

### Centralize Container References

```typescript
// Create a utility
export const ContainerRefs = {
  get(name: keyof typeof DemoContainers) {
    return DemoContainers[name].id;  // Always returns .id, never .route
  }
};

// Use in tools
@Tool({
  containerId: ContainerRefs.get('Demo'),  // Type-safe + always uses .id
})
```

## Summary

The pain points from this migration:

1. ❌ Manual updates → ✅ Automated migration script
2. ❌ Broken references → ✅ Reference validator
3. ❌ .route vs .id confusion → ✅ Container ID linter
4. ❌ Silent test failures → ✅ Pre-test validation
5. ❌ No dead route detection → ✅ Dead route detector

Implement these tools and the next migration will be:
```bash
npm run migrate:route -- --from OldRoute --to NewRoute
npm test
# Done!
```
