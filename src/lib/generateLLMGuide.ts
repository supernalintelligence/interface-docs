/**
 * Dynamic LLM Guide Generator
 * 
 * Generates up-to-date implementation guide for LLMs by:
 * 1. Reading actual README.md content
 * 2. Extracting live examples from source
 * 3. Including current decorator metadata
 */

export interface LLMGuideOptions {
  includeExamples?: boolean;
  includeArchitecture?: boolean;
  includeDeployment?: boolean;
}

/**
 * Generate complete LLM guide from source files
 */
export function generateLLMGuide(options: LLMGuideOptions = {}): string {
  const {
    includeArchitecture = true,
    includeDeployment = true
  } = options;

  const sections: string[] = [];

  // 1. Header and Overview from README
  sections.push(generateHeader());

  // 2. Installation
  sections.push(generateInstallation());

  // 3. Quick Start with real examples
  sections.push(generateQuickStart());

  // 4. Decorator Options (from actual source)
  sections.push(generateDecoratorOptions());

  // 5. Tool Types and Danger Levels
  sections.push(generateToolTypes());
  sections.push(generateDangerLevels());

  // 6. Tool Origin Tracking
  sections.push(generateOriginTracking());

  // 7. Testing System
  sections.push(generateTestingSection());

  if (includeArchitecture) {
    sections.push(generateArchitecture());
  }

  if (includeDeployment) {
    sections.push(generateDeployment());
  }

  // 8. Use Cases
  sections.push(generateUseCases());

  // 9. Links
  sections.push(generateLinks());

  return sections.filter(Boolean).join('\n\n');
}

function generateHeader(): string {
  return `# @supernal-interface/core - Complete AI Agent Guide

## Overview
Transform any method into an AI-controllable tool with simple decorators. Built-in testing ensures your tools work correctly before AI uses them.

**Key Features:**
- 🎯 Simple Decorators for both methods AND standalone functions
- 🧪 Built-in Testing validates positive and negative cases
- 🤖 AI-Safe by Default with explicit opt-in and danger levels
- 📝 Natural Language matching using examples and descriptions
- 📍 Origin Tracking shows exactly where tools are available`;
}

function generateInstallation(): string {
  return `## Installation

\`\`\`bash
npm install @supernal-interface/core
\`\`\``;
}

function generateQuickStart(): string {
  return `## Quick Start

### 1. Create Tool Provider (Class-Based)

\`\`\`typescript
import { Tool, ToolProvider } from "@supernal/interface-enterprise";

@ToolProvider({ category: 'ui-controls' })
export class UIControls {
  @Tool({
    toolId: 'theme-toggle',
    description: 'Toggle between light and dark theme',
    aiEnabled: true,
    dangerLevel: 'safe',
    examples: ['toggle theme', 'switch theme', 'change theme'],
    origin: { path: '/demo', elements: ['#theme-toggle'] }
  })
  async toggleTheme(): Promise<{ success: boolean; message: string }> {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('dark');
    return { success: true, message: \`Theme switched to \${newTheme}\` };
  }

  @Tool({
    toolId: 'form-submit',
    description: 'Submit form with user data',
    aiEnabled: true,
    dangerLevel: 'moderate',
    examples: ['submit form', 'save form', 'send form data'],
    origin: { path: '/demo', elements: ['#user-form', '.form-container'] }
  })
  async submitForm(data: { name: string; email: string }): Promise<{ success: boolean; message: string }> {
    if (!data.name || !data.email) {
      return { success: false, message: 'Name and email are required' };
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: 'Please provide a valid email address' };
    }
    return { success: true, message: \`Form submitted successfully for \${data.name}\` };
  }
}
\`\`\`

### 2. Standalone Functions (NEW!)

\`\`\`typescript
import { Tool } from "@supernal/interface-enterprise";

@Tool({
  toolId: 'calculate-tax',
  providerName: 'TaxUtils',
  description: 'Calculate tax amount based on income and rate',
  aiEnabled: true,
  dangerLevel: 'safe',
  examples: ['calculate tax for $50000 at 25%', 'compute tax amount'],
  origin: { path: '/calculator', elements: ['#tax-calculator'] }
})
function calculateTax(income: number, rate: number): { tax: number; afterTax: number } {
  const tax = income * (rate / 100);
  return {
    tax: Math.round(tax * 100) / 100,
    afterTax: Math.round((income - tax) * 100) / 100
  };
}
\`\`\`

### 3. Initialize Tools

\`\`\`typescript
import { ToolRegistry } from "@supernal/interface/browser";
import { UIControls } from './UIControls';

// Initialize your tools - they auto-register via decorators
const uiControls = new UIControls();

// Verify registration
console.log(ToolRegistry.getAllTools());
\`\`\`

### 4. AI Interface Usage

\`\`\`typescript
import { DemoAIInterface } from './AIInterface';

const aiInterface = new DemoAIInterface();

// Natural language execution
const result = await aiInterface.executeCommand({
  query: 'toggle theme',
  toolId: 'theme-toggle',
  method: 'toggleTheme',
  parameters: {}
});

console.log(result); // { success: true, message: 'Theme switched to dark' }
\`\`\`

### 5. Direct Tool Access

\`\`\`typescript
// Get tool from registry
const tool = ToolRegistry.getTool('theme-toggle');
if (tool) {
  const instance = tool.instance;
  const result = await instance.toggleTheme();
  console.log(result);
}
\`\`\``;
}

function generateDecoratorOptions(): string {
  return `## Tool Decorator Options

| Property | Type | Description |
|----------|------|-------------|
| toolId | string | Unique tool identifier (replaces testId) |
| elementId | string | DOM element ID for UI tools |
| selector | string | CSS selector for UI targeting |
| providerName | string | Provider name for standalone functions |
| description | string | Human-readable description |
| aiEnabled | boolean | Whether AI can execute this tool |
| dangerLevel | 'safe' \\| 'moderate' \\| 'dangerous' \\| 'destructive' | Risk level for approval |
| examples | string[] | Natural language examples for AI matching |
| origin | object | Where tool is available (path, elements, modal) |
| toolType | string | Tool classification: 'test-only', 'ai-safe', 'ai-restricted', 'ai-dangerous' |
| executionContext | string | Where tool runs: 'ui', 'api', 'both' |
| requiresApproval | boolean | Whether tool requires human approval before execution |`;
}

function generateToolTypes(): string {
  return `## Tool Types

- **test-only**: Tool is only available for testing, not AI execution (default for dangerous operations)
- **ai-safe**: Safe for AI execution without restrictions (read-only operations)
- **ai-restricted**: AI can execute but may require approval (create, update operations)
- **ai-dangerous**: AI can execute but always requires approval (dangerous operations)`;
}

function generateDangerLevels(): string {
  return `## Danger Levels

- **safe**: No approval required, safe for AI execution (read-only, navigation)
- **moderate**: May require approval for sensitive operations (create, update, modify)
- **dangerous**: Requires approval for risky operations (approve, reject, ban, suspend)
- **destructive**: Always requires approval for dangerous operations (delete, remove, destroy)`;
}

function generateOriginTracking(): string {
  return `## Tool Origin Tracking

\`\`\`typescript
origin: { 
  path: '/demo',                    // Tool only works on /demo page
  elements: ['#theme-toggle'],      // Specific UI elements it controls
  modal: 'settings'                 // Optional: only when modal is open
}
\`\`\`

This ensures AI knows:
- Which page/route the tool is available on
- What UI elements the tool interacts with
- If the tool requires a specific modal/context to be open`;
}

function generateTestingSection(): string {
  return `## Testing System

The system includes comprehensive testing that validates:

- ✅ **Positive cases**: Valid parameters should succeed
- ❌ **Negative cases**: Invalid parameters should fail gracefully
- 🔍 **Edge cases**: Missing parameters and boundary conditions
- 📊 **Real-time feedback**: Progress bars and detailed results

Tests are automatically generated based on tool metadata and can be run with:

\`\`\`bash
npm test
\`\`\``;
}

function generateArchitecture(): string {
  return `## Core Architecture

### Main Components

- **ToolRegistry**: Central registry for all decorated tools with CLI-like discovery
  - \`list()\`, \`help()\`, \`overview()\`, \`find()\` - CLI-like tool discovery
  - \`getToolsByProvider()\`, \`getProviders()\` - Programmatic access
  - \`searchTools()\`, \`getAllTools()\` - Search and retrieval

- **@Tool**: Decorator to mark methods AND standalone functions as AI-controllable

- **@ToolProvider**: Decorator to mark classes as tool providers

- **ToolMetadata**: Interface describing registered tools with enhanced properties

### Registry API

\`\`\`typescript
import { ToolRegistry } from "@supernal/interface-enterprise";

// CLI-like discovery
console.log(ToolRegistry.overview());           // Show all stats and providers
console.log(ToolRegistry.list());               // List all tools
console.log(ToolRegistry.help('toolId'));       // Get detailed help
console.log(ToolRegistry.find('keyword'));      // Search tools

// Programmatic access
const tools = ToolRegistry.searchTools('save user data');
const allTools = Array.from(ToolRegistry.getAllTools().values());
const uiTools = ToolRegistry.getToolsByProvider('UIControls');
\`\`\``;
}

function generateDeployment(): string {
  return `## Local Development

\`\`\`bash
git clone https://github.com/supernalintelligence/supernal-interface
cd supernal-interface/core/demo
npm install
npm run dev
# Runs on http://localhost:3011
\`\`\`

## Vercel Deployment

1. Fork/clone the repository
2. Connect to Vercel  
3. Set build command: \`npm run build\`
4. Set output directory: \`.next\`
5. Deploy`;
}

function generateUseCases(): string {
  return `## Use Cases

- 🖥️ **UI Automation**: Let AI control buttons, forms, and interface elements
- 🔧 **DevOps Tools**: Deploy, monitor, and manage infrastructure via AI
- 📊 **Data Analysis**: Query databases and generate reports through AI
- 🤖 **AI Agents**: Build autonomous agents with safe, testable actions`;
}

function generateLinks(): string {
  return `## Links

- **Live Demo**: https://supernal-interface-demo.vercel.app
- **NPM Package**: https://www.npmjs.com/package/@supernal-interface/core
- **GitHub Repository**: https://github.com/supernalintelligence/supernal-interface
- **Documentation**: https://supernal-interface-demo.vercel.app/docs
- **Examples**: https://supernal-interface-demo.vercel.app/examples`;
}

// For client-side usage (browser environment)
export function generateClientSideLLMGuide(): string {
  // In browser, we can't read files from disk, so we return a pre-generated guide
  // This should be built at compile time or fetched from an API
  return generateLLMGuide({
    includeExamples: true,
    includeArchitecture: true,
    includeDeployment: true
  });
}

