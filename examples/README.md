# Demo Examples: Specialized Decorators

This directory contains comprehensive examples of using the new specialized tool decorators.

## Running the Examples

### TypeScript Demo (Console)
```bash
cd core/demo/examples
npx ts-node specialized-decorators-demo.ts
```

### React Demo (Browser)
```bash
cd core/demo
npm run dev
# Visit http://localhost:3000/code-toggle
```

## What's Included

### 1. TypeScript Examples (`specialized-decorators-demo.ts`)
Complete working examples of all specialized decorators:
- `@AITool` - AI-enabled safe tools
- `@TestTool` - Test-only tools
- `@DangerousTool` - Requires approval
- `@DestructiveTool` - Irreversible operations
- `@OnboardingTool` - User tutorials/help
- `@DataReadTool` / `@DataWriteTool` - Data operations
- `@NavigationTool` - Page/view navigation
- `@ToolPreset` - DRY class-level configuration
- `PresetTemplates` - Pre-built presets

### 2. React Code-Toggle Demo (`/code-toggle`)
Interactive demo showing:
- Live widgets alongside implementation code
- Toggle between Demo / Code / Split views
- Syntax-highlighted code display
- Before/After comparisons
- Benefits breakdown

## Key Features

### 80% Code Reduction
**Before:**
```typescript
@Tool({
  toolId: 'send-message',
  aiEnabled: true,
  toolType: 'ai-safe',
  dangerLevel: 'safe',
  requiresApproval: false,
  generateSimulation: true,
  generateStories: true,
  category: ToolCategory.CHAT,
  tags: ['chat'],
  containerId: 'chat-modal'
})  // 15 lines
```

**After:**
```typescript
@ToolPreset(PresetTemplates.Chat)
class ChatTools {
  @AITool({ toolId: 'send-message' })  // 3 lines!
  async sendMessage(text: string) { }
}
```

### Clear Intent Through Decorator Names
```typescript
@AITool({ toolId: 'search' })           // Safe, AI can use
@TestTool({ toolId: 'reset-db' })       // Test-only
@DangerousTool({ toolId: 'delete' })    // Requires approval
@DestructiveTool({ toolId: 'purge' })   // Irreversible, requires approval
```

### DRY with Presets
```typescript
// Define once at class level
@ToolPreset({
  category: ToolCategory.CHAT,
  containerId: 'chat-modal',
  tags: ['chat', 'messaging']
})
class ChatTools {
  // All tools inherit preset
  @AITool({ toolId: 'send' })
  async send() { }

  // Override specific fields
  @AITool({
    toolId: 'export',
    category: ToolCategory.DATA  // Override preset
  })
  async export() { }
}
```

### Built-in Preset Templates
```typescript
@ToolPreset(PresetTemplates.Chat)        // Chat tools
@ToolPreset(PresetTemplates.Navigation)  // Navigation tools
@ToolPreset(PresetTemplates.Data)        // Data management
@ToolPreset(PresetTemplates.Onboarding)  // Help/tutorials
```

### Container & Path Presets
```typescript
// For modals/dialogs
@ToolPreset(containerPreset('settings-modal', ToolCategory.SETTINGS))
class SettingsModalTools { }

// For specific routes
@ToolPreset(pathPreset('/dashboard', ToolCategory.DATA))
class DashboardTools { }
```

## Components

### CodeToggleDemo
Wrapper component for showing interactive demos with code:
```typescript
<CodeToggleDemo
  widgetId="chat-send"
  title="Chat Widget"
  description="AI-enabled chat tool"
  code={codeSnippet}
>
  <ChatWidget />
</CodeToggleDemo>
```

### CodeDisplay
Displays code with syntax highlighting and tabs:
- Component tab - React component code
- Tool tab - Tool decorator code
- Names tab - Name contract code
- Full tab - Complete implementation
- Copy button for easy copying

## File Structure

```
demo/examples/
├── specialized-decorators-demo.ts     # TypeScript examples
└── code-toggle-demo/                  # React code-toggle demo
    ├── components/
    │   ├── CodeToggleDemo.tsx         # Main demo wrapper
    │   ├── CodeToggleDemo.css
    │   ├── CodeDisplay.tsx            # Code display with highlighting
    │   └── CodeDisplay.css
    ├── data/
    │   └── widget-code-snippets.ts    # Pre-extracted code examples
    ├── pages/
    │   ├── CodeTogglePage.tsx         # Demo page
    │   └── CodeTogglePage.css
    └── index.ts                       # Public exports
```

## Benefits

✅ **80% less boilerplate** - 3 lines instead of 15  
✅ **Clear intent** - Decorator names show safety level  
✅ **Type-safe** - Full TypeScript support with autocomplete  
✅ **DRY** - Presets eliminate repetition  
✅ **Flexible** - Override any setting when needed  
✅ **Familiar** - Like Redux action types, React Query keys  

## Next Steps

1. Try the TypeScript demo
2. Run the React demo locally
3. Explore the code snippets
4. Copy examples for your own use
5. Create custom presets for your app

## Documentation

- [Tool Simplification Plan](../docs/plans/TOOL_SIMPLIFICATION_PLAN.md)
- [Simplicity Analysis](../docs/SIMPLICITY_ANALYSIS.md)
- [Demo Code Toggle Plan](../docs/plans/DEMO_CODE_TOGGLE_PLAN.md)

