---
id: si-cli-overview
title: Supernal Interface CLI
sidebar_label: Overview
sidebar_position: 1
---

# Supernal Interface CLI (`si`)

The Supernal Interface CLI provides tools for test generation, contract scanning, validation, and AI-assisted development.

**Package**: `@supernalintelligence/interface-enterprise`

## Quick Installation

```bash
# One-liner setup (recommended)
curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash

# Manual installation
npm install @supernalintelligence/interface-enterprise
```

## Installation Packs

| Pack | What's Included |
|------|-----------------|
| `basic` | Routes.ts, ComponentNames.ts, validation |
| `testing` | Basic + test generation, Gherkin story system |
| `full` | Testing + MCP server, Claude Code skills/agents |
| `ai-agent` | Full + AI-friendly permissions (default) |

```bash
# Choose your pack
curl -fsSL ... | bash -s -- --pack basic
curl -fsSL ... | bash -s -- --pack testing
curl -fsSL ... | bash -s -- --pack full
curl -fsSL ... | bash -s -- --pack ai-agent  # default
```

## Available Commands

| Command | Description |
|---------|-------------|
| [`si init`](./commands/init) | Initialize project with contracts |
| [`si scan-routes`](./commands/scan-routes) | Generate route contracts |
| [`si scan-names`](./commands/scan-names) | Generate component name contracts |
| [`si validate`](./commands/validate) | Validate contracts and tools |
| [`si validate-graph`](./commands/validate-graph) | Validate navigation graph |
| [`si generate-tests`](./commands/generate-tests) | Generate tests from @Tool decorators |
| [`si generate-story-tests`](./commands/generate-story-tests) | Generate tests from Gherkin features |
| [`si story validate`](./commands/story-validate) | Validate Gherkin features |
| [`si story list-steps`](./commands/story-list-steps) | Show allowed Gherkin patterns |
| [`si benchmark-cache`](./commands/benchmark-cache) | Benchmark Story System performance |
| [`si setup-claude`](./commands/setup-claude) | Install Claude Code skills and agents |
| [`si setup-mcp`](./commands/setup-mcp) | Configure MCP server |
| [`si feedback`](./commands/feedback) | File GitHub issues |

## Quick Start

```bash
# Get help
si --help
si <command> --help

# Initialize a project
si init . --output src/architecture

# Validate setup
si validate --all

# Generate tests
si generate-tests --output tests/generated --include-e2e
```

## What Supernal Interface Does

### Named Contracts

Replace magic strings with type-safe references:

```typescript
// Before: Magic strings everywhere
await page.goto('/dashboard');
await page.click('[data-testid="submit-btn"]');

// After: Type-safe contracts
import { Routes } from './architecture/Routes';
import { Components } from './architecture/Components';

await page.goto(Routes.dashboard);
await page.click(`[data-testid="${Components.submitButton}"]`);
```

### Test Generation

Automatically generate tests from:
- `@Tool` decorators on your functions
- Gherkin `.feature` files

### Story System Caching

6,000x+ speedup for E2E tests through intelligent state caching.

### Claude Code Integration

12 slash commands and 3 specialized agents for AI-assisted development.

## Next Steps

- [Getting Started](./getting-started) - Detailed setup guide
- [Commands Reference](./commands/) - All CLI commands
- [Claude Code Integration](./claude-code) - AI-assisted development
