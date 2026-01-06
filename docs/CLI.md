# Supernal Interface CLI

The Supernal Interface CLI (`si`) is part of **@supernal/interface-enterprise** and provides tools for test generation, contract scanning, validation, and performance benchmarking.

**🔒 Enterprise Feature**: The CLI is proprietary and included with the enterprise package.

## Installation

The `si` CLI is automatically available when you install the enterprise package:

```bash
npm install @supernal/interface-enterprise

# The si command is now available
si --help
```

---

## Quick Start

The `si` CLI is globally linked for this project:

```bash
# See all commands
si --help

# Get help for a specific command
si generate-tests --help
si scan-routes --help
si benchmark-cache --help
```

---

## Available Commands

### 1. Generate Tests from @Tool Decorators

Automatically generates tests from your `@Tool` decorated functions:

```bash
# Using npm script (recommended)
npm run si:generate-tests

# Or directly
si generate-tests \
  --output tests/generated \
  --routes src/architecture/Routes.ts \
  --names src/architecture/Components.ts \
  --include-e2e
```

**What it does**:
- Scans all `@Tool` decorators in your code
- Generates unit, integration, and E2E tests
- Uses route and name contracts for type safety
- Tests will use Story System caching (6,000x+ speedup!)

---

### 2. Generate Route Contracts

Scans `src/pages/` and generates type-safe route constants:

```bash
# Using npm script
npm run contracts:routes

# Or directly
si scan-routes --pages src/pages --output src/architecture/Routes.ts

# Watch mode (auto-regenerate on changes)
si scan-routes --watch
```

**Output** (`src/architecture/Routes.ts`):
```typescript
export const Routes = {
  Home: '/',
  Dashboard: '/dashboard',
  Examples: '/examples',
  BlogSlug: '/blog/:slug'
} as const;
```

**Use in code**:
```typescript
import { Routes } from '@/architecture/Routes';

// Type-safe navigation
router.push(Routes.Dashboard);  // '/dashboard'

// In Playwright tests
await page.goto(Routes.Examples);
```

---

### 3. Generate Name Contracts

Scans components for `data-testid` attributes and generates type-safe name constants:

```bash
# Using npm script
npm run contracts:names

# Or directly
si scan-names --components src/components --output src/architecture/Components.ts

# Watch mode
si scan-names --watch
```

**Output** (`src/architecture/Components.ts`):
```typescript
export const Components = {
  ChatInput: 'chat-input',
  ChatSendButton: 'chat-send-button',
  CounterButton: 'counter-button'
} as const;
```

**Use in code**:
```tsx
import { Components } from '@/architecture/Components';

// Type-safe test IDs
<button data-testid={Components.ChatSendButton}>Send</button>

// In Playwright tests
const button = page.locator(`[data-testid="${Components.ChatSendButton}"]`);
```

---

### 4. Benchmark Story System Caching

Measures performance improvement from Story System state caching:

```bash
# Using npm script
npm run si:benchmark

# Or directly
si benchmark-cache --runs 5 --output benchmark-results.json
```

**Example output**:
```
⚡ Benchmarking Story System Cache...

📊 Scenario: Counter.increment
   Cold: 68ms
   Warm: 0.02ms
   ⚡ Speedup: 3,412x

📈 Summary:
   Average speedup: 6,212x
   Cache hit rate: 100%
```

---

### 5. Validate Contracts

Validates route contracts, name contracts, and @Tool decorators:

```bash
# Using npm script
npm run si:validate

# Or directly
si validate --routes src/architecture/Routes.ts --names src/architecture/Components.ts --tools
```

**Example output**:
```
🔍 Validating Supernal Interface setup...

📍 Validating route contracts...
   ✅ Routes valid (15 routes)

🏷️  Validating name contracts...
   ✅ Names valid (47 components)

🔧 Validating @Tool decorators...
   ✅ Tools valid (12 registered)

✅ All validations passed
```

---

## Development Workflow

### Complete workflow for adding a new feature:

```bash
# 1. Add data-testid to your new components
<button data-testid="new-feature-button">Click me</button>

# 2. Create new pages
# (in src/pages/new-feature.tsx)

# 3. Regenerate contracts
npm run contracts:all

# 4. Validate
npm run si:validate

# 5. Generate tests
npm run si:generate-tests

# 6. Run tests
npm test
```

---

## Watch Mode for Development

Keep contracts in sync during development:

```bash
# Terminal 1: Watch routes (auto-regenerate on file changes)
npm run contracts:watch

# Terminal 2: Dev server
npm run dev

# Terminal 3: Test watcher
npm run test:watch
```

Or manually:
```bash
si scan-routes --watch &
si scan-names --watch &
npm run dev
```

---

## npm Scripts Reference

All available `si` commands in `package.json`:

```json
{
  "contracts:routes": "Generate route contracts",
  "contracts:names": "Generate name contracts",
  "contracts:all": "Generate both routes and names",
  "contracts:watch": "Watch mode for both",
  "si:generate-tests": "Generate all tests",
  "si:benchmark": "Benchmark Story System",
  "si:validate": "Validate all contracts"
}
```

---

## Migration from Old Scripts

**Old scripts** (removed):
```bash
# ❌ Old (removed)
tsx scripts/dogfood-generate-tests.ts
tsx scripts/benchmark-story-cache.ts
```

**New commands**:
```bash
# ✅ New (use these)
npm run si:generate-tests
npm run si:benchmark
```

See [SCRIPTS_CLEANUP.md](./SCRIPTS_CLEANUP.md) for full migration details.

---

## Troubleshooting

### "si: command not found"

The CLI should be globally linked. Re-link it:

```bash
cd ../cli
npm link
cd ../docs-site
```

### "No tools registered" when generating tests

Make sure your tool providers are imported. Check that files in `src/tools/` have `@Tool` decorators.

### Contracts not updating

If contracts aren't regenerating:

```bash
# Force regenerate
npm run contracts:all

# Check if files were created
ls -la src/architecture/Routes.ts
ls -la src/architecture/Components.ts
```

### Tests failing after contract changes

Regenerate tests after updating contracts:

```bash
npm run contracts:all
npm run si:generate-tests
npm test
```

---

## Advanced Usage

### Custom test generation

```bash
si generate-tests \
  --output custom/output \
  --routes src/custom/Routes.ts \
  --names src/custom/Names.ts \
  --framework playwright \
  --include-e2e \
  --providers '{"MyTools":"./src/custom/MyTools"}'
```

### Benchmark with custom scenarios

```bash
si benchmark-cache \
  --runs 10 \
  --scenarios ./custom-scenarios.json \
  --output detailed-benchmark.json
```

---

## Learn More

- **Enterprise Package**: `../enterprise/README.md` - Enterprise features documentation
- **CLI Source**: `../enterprise/src/cli/` - CLI implementation
- **Story System**: `../enterprise/src/stories/` - Caching implementation
- **Test Generator**: `../enterprise/src/generators/TestGenerator.ts` - Test generation logic
- **Supernal Coding**: Integration with `sc` CLI for project workflow

---

## Package Details

**Package**: `@supernal/interface-enterprise`  
**License**: Proprietary  
**Included Features**:
- Story System (6,000x+ caching speedup)
- TestGenerator (auto-test generation)
- CLI Tools (`si` command)
- NavigationGraph (proprietary)

**Installation**:
```bash
npm install @supernal/interface-enterprise
```

---

## Support

- **GitHub Issues**: [Report issues](https://github.com/supernal-nova/supernal-interface/issues)
- **Documentation**: See `../cli/README.md` for detailed CLI docs
- **Examples**: This docs-site is a working example of using all `si` commands

