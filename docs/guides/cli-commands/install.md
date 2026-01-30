---
id: install
title: Install Supernal Interface
sidebar_label: install
---

# Quick Installation

Install Supernal Interface in any repository with a single command.

## One-Liner Setup

```bash
# Default AI-agent optimized setup
curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash
```

## Installation Packs

Choose a pack based on your needs:

```bash
# Contracts only (Routes.ts, ComponentNames.ts)
curl -fsSL ... | bash -s -- --pack basic

# Contracts + test generation + Gherkin
curl -fsSL ... | bash -s -- --pack testing

# Everything including MCP and Claude Code
curl -fsSL ... | bash -s -- --pack full

# Optimized for AI agents (default)
curl -fsSL ... | bash -s -- --pack ai-agent
```

### Pack Comparison

| Pack | Contracts | Testing | MCP | Claude Code | AI Settings |
|------|:---------:|:-------:|:---:|:-----------:|:-----------:|
| `basic` | ✓ | | | | |
| `testing` | ✓ | ✓ | | | |
| `full` | ✓ | ✓ | ✓ | ✓ | |
| `ai-agent` | ✓ | ✓ | ✓ | ✓ | ✓ |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--pack <name>` | Installation pack | `ai-agent` |
| `--output <dir>` | Contract output directory | `src/architecture` |
| `--global` | Install `si` globally | `false` |
| `--skip-install` | Use existing installation | `false` |
| `--skip-claude` | Skip Claude Code setup | `false` |
| `--dry-run` | Preview without changes | `false` |
| `--verbose` | Detailed output | `false` |

## Examples

```bash
# Preview what would be installed
curl -fsSL ... | bash -s -- --dry-run

# Custom output directory
curl -fsSL ... | bash -s -- --output lib/contracts

# Global installation with testing pack
curl -fsSL ... | bash -s -- --global --pack testing

# Skip Claude Code integration
curl -fsSL ... | bash -s -- --skip-claude
```

## Manual Installation

If you prefer manual installation:

```bash
# Install package
npm install @supernalintelligence/interface-enterprise

# Initialize project
npx si init . --output src/architecture

# Setup Claude Code (optional)
npx si setup-claude
```

## What Gets Installed

### With `--pack ai-agent` (default):

1. **Contracts**
   - `src/architecture/Routes.ts` - Route definitions
   - `src/architecture/ComponentNames.ts` - Component test IDs

2. **Testing Infrastructure**
   - `features/` directory for Gherkin files
   - Example feature file

3. **MCP Server**
   - `mcp-server.js` for AI assistant integration
   - IDE configuration

4. **Claude Code**
   - 12 slash commands (`/si-init`, `/si-validate`, etc.)
   - 3 specialized agents

5. **AI-Friendly Settings**
   - `.claude/settings.json` with pre-approved permissions

## Next Steps

After installation:

```bash
# 1. Validate setup
si validate --all

# 2. Add data-testid to your components
# <button data-testid="submit-button">Submit</button>

# 3. Regenerate contracts
si scan-routes --pages src/pages --output src/architecture/Routes.ts
si scan-names --components src/components --output src/architecture/Components.ts

# 4. Write Gherkin features
si story list-steps  # See available patterns

# 5. Generate tests
si generate-story-tests features/ --output tests/generated
```

## Category

**Setup & Configuration**

---

_See [CLI.md](/docs/CLI) for complete command reference._
