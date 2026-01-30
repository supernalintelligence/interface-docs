---
id: si-claude-code
title: Claude Code Integration
sidebar_label: Claude Code
sidebar_position: 3
---

# Claude Code Integration

Supernal Interface provides deep integration with Claude Code through skills (slash commands) and agents (specialized subagents).

## Setup

```bash
si setup-claude
```

This installs skills and agents to your project's `.claude/` directory.

### Options

| Option | Description |
|--------|-------------|
| `-f, --force` | Overwrite existing files |
| `--skills-only` | Only install skills |
| `--agents-only` | Only install agents |
| `--list` | List available skills/agents |
| `-v, --verbose` | Verbose output |

## Skills (Slash Commands)

Skills provide slash commands in Claude Code for quick access to `si` CLI functionality.

### Available Skills

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

### Usage Examples

```
# In Claude Code, type:
/si-init .
/si-validate --all
/si-generate-tests --output tests/generated
/si-story-validate features/login.feature
```

## Agents (Subagents)

Agents are specialized AI assistants for complex, multi-step tasks.

### Available Agents

#### si-contracts

Contract generation and management specialist.

**Capabilities:**
- Scan projects for routes and components
- Generate and update contracts
- Validate contract integrity
- Suggest missing data-testid attributes

**Example prompts:**
- "Use the si-contracts agent to scan my Next.js project"
- "Generate route contracts for my app router pages"
- "Find components missing data-testid attributes"

#### si-test-generator

Test generation specialist for Gherkin features and @Tool decorators.

**Capabilities:**
- Generate Playwright tests from Gherkin features
- Generate tests from @Tool decorators
- Validate test coverage
- Suggest missing test scenarios

**Example prompts:**
- "Generate tests for all my feature files"
- "Create E2E tests for my login flow"
- "What test scenarios am I missing?"

#### si-story

Story system specialist for the complete testing workflow.

**Capabilities:**
- Full Gherkin feature development
- Test execution and caching
- Performance benchmarking
- Video recording with narration

**Example prompts:**
- "Help me write Gherkin features for my checkout flow"
- "Run benchmarks on my Story System cache"
- "Record a video demo of my login feature"

## AI-Friendly Settings

The `ai-agent` installation pack creates `.claude/settings.json` with pre-approved permissions:

```json
{
  "permissions": {
    "allow": [
      "Bash(si *)",
      "Bash(npm test)",
      "Bash(npx playwright test)",
      "Read",
      "Write",
      "Edit"
    ]
  }
}
```

This allows Claude Code to run `si` commands without prompting for each one.

## Workflow Integration

### Initial Setup

```
# 1. Install skills and agents
/si-setup-claude

# 2. Initialize project
/si-init . --output src/architecture

# 3. Validate setup
/si-validate --all
```

### Daily Development

```
# Write a new feature
"Help me write a Gherkin feature for user registration"

# Generate tests
/si-generate-story-tests features/ --output tests/generated

# Validate everything
/si-validate --all
```

### Using Agents for Complex Tasks

```
# Contract management
"Use the si-contracts agent to scan my project and update all contracts"

# Test generation
"Use the si-test-generator agent to create comprehensive tests for my authentication module"

# Full workflow
"Use the si-story agent to help me build a complete testing workflow for my checkout feature"
```

## Best Practices

### 1. Start with Contracts

Always ensure your contracts are up-to-date before generating tests:
```
/si-scan-routes --pages src/pages
/si-scan-names --components src/components
/si-validate --all
```

### 2. Use Agents for Complex Tasks

For multi-step tasks, invoke agents rather than running individual commands:
- Agent: "Use si-contracts to scan and fix all contract issues"
- Not: Running 10 individual commands

### 3. Validate Before Committing

```
/si-validate --all
/si-story-validate features/
```

### 4. Leverage Caching

The Story System caches test state for 6,000x+ speedup. Use `/si-benchmark-cache` to verify caching is working.

## Troubleshooting

### Skills not appearing

Re-run setup with force:
```bash
si setup-claude --force
```

### Agent not found

Ensure agents are installed:
```bash
si setup-claude --list
```

### Permission denied

Check `.claude/settings.json` allows the commands you need.
