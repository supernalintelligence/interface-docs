# @supernal-interface/core Demo

**Live demonstration of AI-controllable React applications with @Tool decorators**

---

## What This Demonstrates

This demo shows how to transform any React application into an AI-controllable system using simple decorators.

### The Problem Supernal Interface Solves

**Challenge**: Traditional approaches to AI-controlled UIs require:
- Manual API development for every interaction
- Fragile CSS selectors that break with UI changes
- Separate test infrastructure
- Complex tool registration and discovery
- No clear safety boundaries

**Solution**: Supernal Interface provides:
- Single `@Tool` decorator defines everything
- Stable component names prevent breakage
- Automatic test generation
- Built-in tool discovery and registration
- Explicit safety levels and approval workflows

---

## Key Demonstrations

### 1. **Zero-Boilerplate Tool Creation**

**File**: `src/lib/UIWidgetComponents.tsx`

Simple HOC wrappers (`ClickTool`, `ChangeTool`) transform ordinary React components into AI-controllable tools:

```typescript
export const SaveButton = ClickTool({
  elementId: Components.Demo.saveButton,
  description: 'Save user data',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['save data', 'save file']
})(({ className, reportSuccess }) => {
  const handleClick = async () => {
    await saveData();
    reportSuccess?.('Data saved!');
  };
  
  return <button onClick={handleClick}>Save</button>;
});
```

**What you get automatically**:
- ✅ Tool registration in global registry
- ✅ Natural language command matching
- ✅ Success/failure reporting
- ✅ Container-aware execution
- ✅ Test generation ready

### 2. **Centralized Component Names**

**File**: `core/names/Components.ts`

Stable, type-safe component identifiers used across testing, AI control, and analytics:

```typescript
export const Components = {
  Demo: {
    openMainMenu: 'open-main-menu',
    saveButton: 'save-button',
    emailInput: 'email-input'
  }
} as const;
```

**Benefits**:
- No magic strings scattered in code
- TypeScript autocomplete everywhere
- Rename once, updates everywhere
- Same names for tools, tests, and UI

### 3. **AI-Safe by Default**

**File**: `src/providers/Phase1DemoProviders.ts`

Tools are test-only until explicitly enabled for AI:

```typescript
@Tool({
  elementId: Components.Demo.deleteButton,
  description: 'Delete all user data',
  aiEnabled: true,              // Must explicitly enable
  dangerLevel: 'dangerous',     // Clear safety level
  requiresApproval: true,       // Requires user confirmation
  examples: ['delete everything']
})
async deleteAllData() {
  // Only runs if user approves
}
```

**Safety levels**:
- `safe` - Read-only or reversible actions
- `moderate` - State changes, requires validation
- `dangerous` - Destructive actions, requires approval

### 4. **State Management via Tools**

**What the demo shows**: The "Current State (Indicated by @Tool Methods)" display at the bottom of the widget section demonstrates that state is maintained by the @Tool decorated methods, not separate state management:

```typescript
// Tool automatically updates state AND reports to AI
const result = await getUIControls().toggleNotifications(enabled);
reportSuccess?.(result.message);  // AI notified automatically
```

### 5. **Natural Language Command Matching**

**File**: `src/lib/AIInterface.ts`

AI matches user commands to tools using examples and descriptions:

```
User: "turn on notifications"
  ↓
Finds: NotificationsToggle tool (examples: ['toggle notifications', 'enable notifications'])
  ↓
Executes: Tool's onChange handler
  ↓
Reports: "Notifications enabled" (via reportSuccess callback)
```

### 6. **Container-Aware Tool Execution**

**File**: `src/architecture/DemoContainers.ts`

Tools specify which container they belong to - AI knows **where** tools can execute:

```typescript
export const DemoContainer = {
  id: 'Demo',
  components: [
    'open-main-menu',
    'save-button',
    'email-input'
  ]
};

// Tool specifies its container
@ClickTool({
  containerId: 'Demo',  // Only available in Demo container
  ...
})
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Component Names Registry                   │
│         (Centralized, Type-Safe, Stable)                │
│                                                          │
│  Components.ts:  { saveButton, emailInput, ... }       │
│  Containers.ts:  { Demo, Settings, Workspace, ... }    │
└────────────┬─────────────────────────┬──────────────────┘
             │                         │
    ┌────────▼──────────┐    ┌────────▼──────────┐
    │  UI Components    │    │   Tool Providers  │
    │  (Plain React)    │    │  (@Tool/@ClickTool)│
    └───────────────────┘    └───────────────────┘
    │                        │
    │ <button                │ @ClickTool({
    │   data-testid=         │   elementId: Components.saveButton,
    │     {Components.       │   aiEnabled: true,
    │      saveButton}       │   containerId: 'Demo'
    │ />                     │ })
    │                        │
    └────────────────────────┘
         Same Names, Unified Contract
```

---

## Running the Demo

### Prerequisites
- Node.js 18+
- npm or pnpm

### Steps

1. **Build Core Package** (from monorepo root)
```bash
cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/core
npm run build
```

2. **Install Demo Dependencies**
```bash
   cd core/demo
npm install
```

3. **Start Demo Server**
```bash
npm run dev
```

4. **Open Browser**
   ```
   http://localhost:3000
   ```

5. **Try the Demo**
   - Click widgets normally - they work as expected
   - Use AI Tools buttons to see simulated AI control
   - Watch the "Current State" section update as tools execute
   - Open Chat bubble to try natural language commands

---

## Key Files to Explore

### Component Names
- `core/names/Components.ts` - 35 UI component names
- `core/names/Containers.ts` - 25 container context names
- `core/names/API.ts` - 24 API endpoint names
- `core/names/Functions.ts` - 29 pure function names

### Demo Components
- `src/lib/UIWidgetComponents.tsx` - HOC-wrapped components (ClickTool, ChangeTool)
- `src/components/InteractiveWidgets.tsx` - Live widget zoo
- `src/components/pages/HomePage.tsx` - Landing page explaining the system
- `src/components/pages/DemoPage.tsx` - Interactive demo

### Tool Infrastructure
- `src/lib/UIControls.ts` - Tool execution logic
- `src/lib/AIInterface.ts` - Simulated AI command matching
- `src/lib/ToolManager.ts` - Tool execution tracking and reporting
- `src/architecture/DemoContainers.ts` - Container definitions

### Tests
- `tests/phase1.spec.ts` - Playwright tests verifying functionality

---

## What Makes This Different

### vs. LangChain (Python)
| Feature | LangChain | Supernal Interface |
|---------|-----------|-------------------|
| **Tool Definition** | Manual function + schema | Single @Tool decorator |
| **UI Integration** | Separate from UI | UI component IS the tool |
| **Testing** | Manual test creation | Auto-generated from decorators |
| **Type Safety** | Runtime validation | TypeScript compile-time |
| **React-Specific** | ❌ No | ✅ Yes - HOCs, hooks, components |

### vs. Manual DOM Manipulation
| Approach | Fragility | Maintenance | Safety |
|----------|-----------|-------------|--------|
| **CSS Selectors** | High (breaks with UI changes) | Manual updates | No built-in safety |
| **Custom APIs** | Low | High (parallel to UI) | Manual enforcement |
| **Supernal Interface** | Low (stable names) | Automatic | Built-in danger levels |

---

## Testing the Demo

### Run Playwright Tests

```bash
cd core/demo
npx playwright test tests/phase1.spec.ts
```

### Tests Verify
- ✅ Component names render on DOM elements
- ✅ Tools execute and report success
- ✅ State updates reflect in UI
- ✅ AI command matching works
- ✅ Container-aware tool execution

---

## Next Steps

1. **Explore the Live Demo** - See tools in action
2. **Read the Code** - Check out `UIWidgetComponents.tsx` for HOC patterns
3. **Review Documentation** - `../../docs/STATUS.md` for implementation details
4. **Try Integration** - Follow patterns to add to your own React app

---

## Documentation References

- **Current Status**: `../../docs/STATUS.md`
- **Implementation Guide**: `../../docs/TESTING_IMPLEMENTATION.md`
- **Architecture**: `../../docs/architecture/`
- **Master Plan**: `../../docs/SUPERNAL_INTERFACE_MASTER_PLAN.md`
- **Component Naming Rules**: `../../.cursor/rules/component-naming.mdc`

---

## Questions or Issues?

See comprehensive documentation in `../../docs/` or check:
- What is currently implemented: `../../docs/STATUS.md`
- How the demo works: `../../docs/DEMO_IMPLEMENTATION.md`
- Testing infrastructure: `../../docs/TESTING_IMPLEMENTATION.md`

---

**Built with @supernal-interface/core**  
**Zero-boilerplate AI control for React applications**
