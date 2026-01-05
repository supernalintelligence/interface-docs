# Supernal Interface Documentation & Demo

**Live demonstration of AI-controllable React applications with @Tool decorators**

## 📦 Packages

This demo uses two packages:

- **[@supernal/interface](https://github.com/supernalintelligence/interface)** - Open-source core package (PUBLIC)
- **@supernal/interface-enterprise** - Enterprise features (PRIVATE)

See [Repository Structure](#repository-structure) below for development workflow.

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

### Development Setup (Monorepo)

When developing locally in the monorepo:

```bash
# From monorepo root (@supernal-interface/)
cd docs-site
npm install
npm run dev
```

The demo uses local builds of `open-source/` and `enterprise/` packages via git submodules.

### Standalone Setup (Public Repo)

When cloned from the public repo:

```bash
git clone https://github.com/supernalintelligence/interface-docs.git
cd interface-docs
npm install  # Installs @supernal/interface from npm
npm run dev
```

For enterprise features, you'll need access to the private `@supernal/interface-enterprise` package.

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

- **Open-Source Package**: [github.com/supernalintelligence/interface](https://github.com/supernalintelligence/interface)
- **This Demo**: [github.com/supernalintelligence/interface-docs](https://github.com/supernalintelligence/interface-docs)
- **npm Package**: [@supernal/interface](https://www.npmjs.com/package/@supernal/interface) (after publishing)

---

## Repository Structure

This project is part of a multi-repository setup:

```
Development (Monorepo):
  @supernal-interface/
  ├── open-source/        (submodule → github.com/supernalintelligence/interface)
  ├── enterprise/         (private, stays in monorepo)
  └── docs-site/          (submodule → github.com/supernalintelligence/interface-docs)

Published (Separate Repos):
  - github.com/supernalintelligence/interface         (PUBLIC - npm: @supernal/interface)
  - github.com/supernalintelligence/interface-docs    (PUBLIC - this repo)
  - npm: @supernal/interface-enterprise               (PRIVATE)
```

### Working Between Repositories

**During Development** (in monorepo):
- Changes made in `open-source/` or `docs-site/` are in their respective git repos
- Commit and push to their GitHub remotes independently
- Enterprise package stays in the monorepo

**Publishing Updates**:
1. Make changes in monorepo (e.g., `open-source/src/...`)
2. Commit to submodule: `cd open-source && git commit && git push`
3. Publish to npm: `cd open-source && npm publish`
4. Update monorepo to track new submodule commit: `cd .. && git add open-source && git commit`

See [HANDOFF.md](./HANDOFF.md) for detailed workflow.

---

## Questions or Issues?

- **Open-Source Issues**: [interface/issues](https://github.com/supernalintelligence/interface/issues)
- **Docs/Demo Issues**: [interface-docs/issues](https://github.com/supernalintelligence/interface-docs/issues)
- **Enterprise Support**: Contact your account representative

---

**Built with @supernal-interface/core**  
**Zero-boilerplate AI control for React applications**
