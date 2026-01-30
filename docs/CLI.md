# Supernal Interface CLI

The Supernal Interface CLI (`si`) is part of **@supernalintelligence/interface-enterprise** and provides tools for test generation, contract scanning, validation, and performance benchmarking.

**🔒 Enterprise Feature**: The CLI is proprietary and included with the enterprise package.

## Quick Start (One-Liner)

Get started instantly with the install script:

```bash
# Default AI-agent optimized setup
curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash

# With specific pack
curl -fsSL ... | bash -s -- --pack basic      # Contracts only
curl -fsSL ... | bash -s -- --pack testing    # Contracts + testing
curl -fsSL ... | bash -s -- --pack full       # Everything
curl -fsSL ... | bash -s -- --pack ai-agent   # Optimized for AI agents (default)
```

### Installation Packs

| Pack | What's Included |
|------|-----------------|
| `basic` | Routes.ts, ComponentNames.ts, validation |
| `testing` | Basic + test generation, Gherkin story system |
| `full` | Testing + MCP server, Claude Code skills/agents |
| `ai-agent` | Full + AI-friendly permissions, verbose logging |

### Script Options

| Option | Description |
|--------|-------------|
| `--pack <name>` | Installation pack (default: `ai-agent`) |
| `--output <dir>` | Contract output directory (default: `src/architecture`) |
| `--global` | Install `si` globally instead of as devDependency |
| `--skip-install` | Use existing installation |
| `--skip-claude` | Skip Claude Code setup |
| `--dry-run` | Preview without changes |
| `--verbose` | Detailed output |

---

## Manual Installation

Install the enterprise package manually:

```bash
npm install @supernalintelligence/interface-enterprise

# The si command is now available
npx si --help

# Or install globally
npm install -g @supernalintelligence/interface-enterprise
si --help
```

---

## CLI Overview

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

### 6. Setup Claude Code Integration

Install Claude Code skills (slash commands) and agents for AI-assisted development:

```bash
si setup-claude
```

**Options**:
- `-f, --force` - Overwrite existing files
- `--skills-only` - Only install skills (slash commands)
- `--agents-only` - Only install agents (subagents)
- `--list` - List available skills and agents without installing
- `-v, --verbose` - Verbose output

**What gets installed**:

**Skills (Slash Commands)**:
| Command | Description |
|---------|-------------|
| `/si-init` | Initialize project with contracts |
| `/si-scan-routes` | Generate route contracts |
| `/si-scan-names` | Generate component contracts |
| `/si-validate` | Validate all contracts |
| `/si-validate-graph` | Validate navigation graph |
| `/si-story-validate` | Validate Gherkin features |
| `/si-story-list-steps` | Show allowed Gherkin patterns |
| `/si-generate-story-tests` | Generate tests from features |
| `/si-generate-tests` | Generate tests from @Tool decorators |
| `/si-setup-mcp` | Setup MCP server |
| `/si-feedback` | File GitHub issues |
| `/si-benchmark-cache` | Benchmark caching performance |

**Agents (Subagents)**:
| Agent | Description |
|-------|-------------|
| `si-contracts` | Contract generation and management specialist |
| `si-test-generator` | Test generation specialist (Gherkin + @Tool) |
| `si-story` | Story system specialist (full testing workflow) |

**Usage in Claude Code**:
```bash
# After setup, use slash commands
/si-init .
/si-validate --all
/si-generate-tests

# Or invoke specialized agents
# "Use the si-contracts agent to scan my Next.js project"
```

---

### 7. Setup MCP Server

Configure Model Context Protocol for AI assistant integration:

```bash
si setup-mcp
```

**Options**:
- `-f, --force` - Overwrite existing files
- `--skip-test` - Skip server startup test
- `--skip-restart` - Don't restart IDEs
- `--manual` - Only create files, skip auto-config

**What it does**:
- Creates `mcp-server.js`
- Adds npm scripts: `mcp`, `mcp:debug`
- Configures Claude Desktop and Cursor IDE
- Tests server connection

---

### 8. File GitHub Issues

Simplified interface for filing bugs, features, and questions:

```bash
si feedback bug "Issue title" "Description"
si feedback feature "Request title" "Description"
si feedback question "Question title" "Description"
```

**Options**:
- `--body-file <file>` - Read body from file
- `--attach-diagnostics` - Include system info
- `--repo <owner/repo>` - Target repository
- `-w, --web` - Preview in browser before submitting

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

**Package**: `@supernalintelligence/interface-enterprise`
**License**: Proprietary
**Included Features**:
- Story System (6,000x+ caching speedup)
- TestGenerator (auto-test generation)
- CLI Tools (`si` command)
- NavigationGraph (proprietary)
- Claude Code Integration (12 skills, 3 agents)
- MCP Server Setup
- GitHub Issue Filing

**Installation**:
```bash
# Quick setup (recommended)
curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash

# Manual installation
npm install @supernalintelligence/interface-enterprise
```

---

## Support

- **GitHub Issues**: Use `si feedback bug` to file issues directly
- **Documentation**: See CLAUDE.md for complete CLI reference
- **Examples**: This docs-site is a working example of using all `si` commands

