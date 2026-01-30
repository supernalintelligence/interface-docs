---
id: si-getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 2
---

# Getting Started with Supernal Interface

This guide walks you through setting up Supernal Interface in your project.

## Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- A web project (Next.js, React, etc.)

## Quick Start (One Command)

The fastest way to get started:

```bash
curl -fsSL https://raw.githubusercontent.com/supernalintelligence/supernal-interface/main/enterprise/scripts/install.sh | bash
```

This installs everything with the `ai-agent` pack (optimized for AI-assisted development).

### Choose Your Pack

```bash
# Contracts only
curl -fsSL ... | bash -s -- --pack basic

# Contracts + testing
curl -fsSL ... | bash -s -- --pack testing

# Everything including MCP and Claude Code
curl -fsSL ... | bash -s -- --pack full

# AI-agent optimized (default)
curl -fsSL ... | bash -s -- --pack ai-agent
```

### Installation Options

| Option | Description | Default |
|--------|-------------|---------|
| `--pack <name>` | Installation pack | `ai-agent` |
| `--output <dir>` | Contract output directory | `src/architecture` |
| `--global` | Install `si` globally | `false` |
| `--skip-install` | Use existing installation | `false` |
| `--skip-claude` | Skip Claude Code setup | `false` |
| `--dry-run` | Preview changes | `false` |
| `--verbose` | Detailed output | `false` |

## Manual Installation

If you prefer step-by-step:

### 1. Install the Package

```bash
# As a dev dependency (recommended)
npm install -D @supernalintelligence/interface-enterprise

# Or globally
npm install -g @supernalintelligence/interface-enterprise
```

### 2. Initialize Your Project

```bash
# Generate contracts
npx si init . --output src/architecture
```

This creates:
- `src/architecture/Routes.ts` - Route definitions
- `src/architecture/ComponentNames.ts` - Component test IDs

### 3. Setup Claude Code (Optional)

```bash
npx si setup-claude
```

Installs 12 slash commands and 3 specialized agents.

### 4. Validate Setup

```bash
npx si validate --all
```

## What Gets Installed

### Pack: `basic`

- **Routes.ts** - Type-safe route definitions
- **ComponentNames.ts** - Component test ID constants
- **Validation** - Contract validation tools

### Pack: `testing`

Everything in `basic`, plus:
- **Test generation** - Generate tests from contracts
- **Gherkin system** - Write features in natural language
- **features/** directory with example feature file

### Pack: `full`

Everything in `testing`, plus:
- **MCP server** - AI assistant integration
- **Claude Code skills** - 12 slash commands
- **Claude Code agents** - 3 specialized agents

### Pack: `ai-agent` (Default)

Everything in `full`, plus:
- **AI-friendly settings** - `.claude/settings.json` with pre-approved permissions
- **Verbose output** - Better feedback for AI agents

## Project Structure After Setup

```
your-project/
├── src/
│   └── architecture/
│       ├── Routes.ts           # Route contracts
│       └── ComponentNames.ts   # Component contracts
├── features/                   # Gherkin feature files
│   └── example.feature
├── .claude/                    # Claude Code integration
│   ├── skills/                 # Slash commands
│   ├── agents/                 # Specialized agents
│   └── settings.json           # AI permissions (ai-agent pack)
└── mcp-server.js               # MCP server (full/ai-agent packs)
```

## Next Steps

### Add data-testid to Components

```tsx
// Before
<button onClick={handleSubmit}>Submit</button>

// After
<button data-testid="submit-button" onClick={handleSubmit}>Submit</button>
```

### Regenerate Contracts

```bash
# After adding new components or pages
si scan-routes --pages src/pages --output src/architecture/Routes.ts
si scan-names --components src/components --output src/architecture/Components.ts
```

### Write Gherkin Features

```gherkin
# features/login.feature
Feature: User Login
  Scenario: Successful login
    Given I am on Routes.Login
    When I type "user@example.com" in Components.Login.emailInput
    And I type "password" in Components.Login.passwordInput
    And I click Components.Login.submitButton
    Then the current URL should be "/dashboard"
```

### Generate Tests

```bash
# From Gherkin features
si generate-story-tests features/ --output tests/generated/stories

# From @Tool decorators
si generate-tests --output tests/generated --include-e2e
```

### Use Claude Code Skills

After running `si setup-claude`, use slash commands in Claude Code:

```
/si-init .
/si-validate --all
/si-generate-tests
```

Or invoke specialized agents:
- "Use the si-contracts agent to scan my project"
- "Use the si-test-generator agent to create tests"

## Troubleshooting

### "si: command not found"

Use `npx si` or install globally:
```bash
npm install -g @supernalintelligence/interface-enterprise
```

### "No contracts found"

Make sure your components have `data-testid` attributes:
```tsx
<button data-testid="my-button">Click</button>
```

### "Cannot find source directory for skills"

Reinstall with force:
```bash
si setup-claude --force
```

## Learn More

- [Commands Reference](./commands/) - All CLI commands
- [Claude Code Integration](./claude-code) - AI-assisted development
- [Gherkin Story System](./gherkin) - Write tests in natural language
