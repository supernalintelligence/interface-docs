# 🎉 MCP Setup Complete!

Your MCP server is ready. Follow these steps to connect Claude Desktop:

## Step 1: Locate Claude Desktop Config

**Mac/Linux**: `~/.config/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Step 2: Add This Configuration

Open the config file and add (or merge with existing `mcpServers`):

```json
{
  "mcpServers": {
    "@supernal-interface/docs-site": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/docs-site"
    }
  }
}
```

## Step 3: Restart Claude Desktop

1. **Quit Claude Desktop completely** (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Reopen Claude Desktop**
3. **Look for MCP connection indicator** in the UI

## Step 4: Test It

In Claude Desktop, ask:

> "What tools do you have access to?"

Claude should list your `@Tool` decorated methods!

## Example Tool Usage

If you have a tool like:

```typescript
@Component({ name: 'calculator', containerId: 'Math' })
class Calculator {
  @Tool({ name: 'add', aiEnabled: true })
  add(a: number, b: number): number {
    return a + b;
  }
}
```

Ask Claude:
> "Add 5 and 3"

Claude will call `Math.add(5, 3)` and respond with the result!

## Troubleshooting

### No tools found?

Make sure your classes use `@Tool` and `@Component` decorators:

```typescript
@Component({ name: 'my-component', containerId: 'MyContainer' })
class MyComponent {
  @Tool({ name: 'myAction', aiEnabled: true })
  myAction() {
    // Implementation
  }
}
```

### Server won't start?

Test manually:
```bash
npm run mcp
```

Check stderr for error messages.

### Debug mode

Run with debug logging:
```bash
npm run mcp:debug
```

This creates `mcp-debug.log` with full output.

### Still need help?

- **Documentation**: https://supernal.ai/docs/mcp
- **Examples**: https://supernal.ai/docs/examples/mcp
- **GitHub Issues**: https://github.com/supernalintelligence/supernal-interface/issues
- **Discord**: https://discord.gg/supernal-ai

---

**Next Steps**:
1. Configure Claude Desktop (above)
2. Restart Claude Desktop
3. Ask Claude "What tools do you have?"
4. Start building AI-powered features! 🚀
