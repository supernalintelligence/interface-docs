/**
 * Example Tools - Real working tools using specialized decorators
 * 
 * MIGRATION: Counter uses new @Component pattern (component-namespacing)
 * LEGACY: Other tools still use flat pattern (for backward compat testing)
 */

import {
  AITool,
  TestTool,
  DangerousTool,
  DestructiveTool,
  // TODO: OnboardingTool is imported but not yet used - implement onboarding flow
  // OnboardingTool,
  DataReadTool,
  DataWriteTool,
  AIAndTestTool,
  ToolPreset,
  PresetTemplates,
  ToolCategory,
  Component,
  Tool,
} from "@supernalintelligence/interface-enterprise";
import { Examples } from '../architecture/DemoComponentNames';
import { DemoContainers } from '../architecture';

// ============================================
// NAME CONTRACTS - Counter names moved to DemoComponentNames
// ============================================
export const Counter = {
  root: Examples.counterWidget,
  incrementButton: Examples.counterIncrement,
  decrementButton: Examples.counterDecrement,
  resetButton: Examples.counterReset,
} as const;

export const Chat = {
  sendButton: 'examples-chat-send',
  clearButton: 'examples-chat-clear',
} as const;

export const Settings = {
  changeButton: 'examples-settings-change',
  resetButton: 'examples-settings-reset',
  deleteButton: 'examples-settings-delete',
} as const;

export const Data = {
  addButton: 'examples-data-add',
  fetchButton: 'examples-data-fetch',
  deleteButton: 'examples-data-delete',
} as const;

// ============================================
// COUNTER COMPONENT - New Namespace Pattern
// ============================================
/**
 * Counter Component
 * 
 * Demonstrates component namespace pattern:
 * - Component name: 'counter'
 * - Methods: increment, decrement, reset
 * - Scoped to: Examples container
 * 
 * AI calls: "increment counter", "reset counter"
 * Tool IDs: counter.increment, counter.decrement, counter.reset
 */
@Component({
  name: 'counter',
  containerId: DemoContainers.DemoSimple.id,
  elementId: Counter.root,
  description: 'Interactive counter with state',
  stateful: true,
})
export class CounterComponent {
  private value = 0;

  @Tool({
    aiEnabled: true,
    elementId: Counter.incrementButton,
    description: 'Increment counter by specified amount',
    examples: ['increment counter by {amount}', 'increase counter by {amount}', 'increment counter'],
    category: ToolCategory.UTILITY,
  })
  increment(amount: number | string = 1) {
    // Convert to number if string
    const numAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    this.value += numAmount;
    const event = new CustomEvent('example-tool-increment', {
      detail: { amount: numAmount, newValue: this.value }
    });
    window.dispatchEvent(event);
    return { 
      success: true, 
      newValue: this.value, 
      message: `Counter: ${this.value}` 
    };
  }

  @Tool({
    aiEnabled: false, // Test-only
    elementId: Counter.decrementButton,
    description: 'Decrement counter by specified amount',
    examples: ['decrement counter', 'decrement counter by {amount}', 'decrease counter by {amount}'],
    category: ToolCategory.UTILITY,
  })
  decrement(amount = 1) {
    this.value -= amount;
    const event = new CustomEvent('example-tool-decrement', { 
      detail: { amount, newValue: this.value } 
    });
    window.dispatchEvent(event);
    return { 
      success: true, 
      newValue: this.value, 
      message: `Counter: ${this.value}` 
    };
  }

  @Tool({
    aiEnabled: true,
    elementId: Counter.resetButton,
    description: 'Reset counter to zero',
    examples: ['reset counter', 'set counter to zero'],
    category: ToolCategory.UTILITY,
  })
  reset() {
    this.value = 0;
    const event = new CustomEvent('example-tool-reset');
    window.dispatchEvent(event);
    return { 
      success: true, 
      newValue: 0, 
      message: 'Counter reset' 
    };
  }
}

// ============================================
// LEGACY COUNTER TOOLS - Old Flat Pattern (for backward compat)
// ============================================
export class CounterTools {
  @AITool({
    elementId: Counter.incrementButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Increment the counter by 1',
    category: ToolCategory.UTILITY,
    examples: ['increment counter', 'increase counter', 'add to counter'],
  })
  async incrementLegacy() {
    const event = new CustomEvent('example-tool-increment');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter incremented' };
  }

  @TestTool({
    elementId: Counter.decrementButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Decrement the counter by 1',
    category: ToolCategory.UTILITY,
    examples: ['decrement counter', 'decrease counter', 'subtract from counter'],
  })
  async decrementLegacy() {
    const event = new CustomEvent('example-tool-decrement');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter decremented' };
  }

  @AIAndTestTool({
    elementId: Counter.resetButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Reset counter to zero',
    category: ToolCategory.UTILITY,
    examples: ['reset counter', 'reset to zero', 'set counter to zero'],
  })
  async resetLegacy() {
    const event = new CustomEvent('example-tool-reset');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter reset to 0' };
  }
}

// ============================================
// CHAT TOOLS - Using @ToolPreset
// ============================================
@ToolPreset(PresetTemplates.Chat)
export class ChatTools {
  @AITool({
    elementId: Chat.sendButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Send a chat message',
    examples: [
      'send message {message}',
      'send chat {message}',
      'send a message {message}',
      'send a chat saying {message}',
      'send chat saying {message}'
    ],
  })
  async sendMessage(message: string) {
    const event = new CustomEvent('example-tool-send-message', {
      detail: { message }
    });
    window.dispatchEvent(event);
    return { success: true, message: `Sent: "${message}"` };
  }

  @AITool({
    elementId: Chat.clearButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Clear all chat messages',
    examples: ['clear chat', 'clear messages', 'delete all messages'],
  })
  async clearChat() {
    const event = new CustomEvent('example-tool-clear-chat');
    window.dispatchEvent(event);
    return { success: true, message: 'Chat cleared' };
  }
}

// ============================================
// SETTINGS TOOLS - Using @DangerousTool and @DestructiveTool
// ============================================
@ToolPreset({ category: ToolCategory.SETTINGS })
export class SettingsTools {
  @AITool({
    elementId: Settings.changeButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Change a setting value',
    examples: ['change setting to {setting}', 'update setting to {setting}', 'set {setting}'],
  })
  async changeSetting(setting: string) {
    const event = new CustomEvent('example-tool-change-setting', {
      detail: { setting }
    });
    window.dispatchEvent(event);
    return { success: true, message: `Changed to: ${setting}` };
  }

  @DangerousTool({
    elementId: Settings.resetButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Reset all settings to defaults',
    examples: ['reset settings', 'reset all settings', 'restore defaults'],
  })
  async resetSettings() {
    const event = new CustomEvent('example-tool-reset-settings');
    window.dispatchEvent(event);
    return { success: true, message: 'Settings reset to defaults' };
  }

  @DestructiveTool({
    elementId: Settings.deleteButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Permanently delete all user data',
    examples: ['delete all data', 'clear all data', 'remove everything'],
  })
  async deleteAllData() {
    const event = new CustomEvent('example-tool-delete-data');
    window.dispatchEvent(event);
    return { success: true, message: 'All data deleted permanently' };
  }
}

// ============================================
// DATA TOOLS - Using @DataReadTool and @DataWriteTool
// ============================================
@ToolPreset({ category: ToolCategory.DATA })
export class DataTools {
  @DataReadTool({
    elementId: Data.fetchButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Fetch all items from the list',
    examples: ['fetch items', 'get items', 'show items', 'list items'],
  })
  async fetchItems() {
    // AI can call this freely - it's read-only
    const event = new CustomEvent('example-tool-fetch-items');
    window.dispatchEvent(event);
    return { success: true, message: 'Items fetched', data: [] };
  }

  @DataWriteTool({
    elementId: Data.addButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Add a new item to the list',
    examples: ['add item {item}', 'create item {item}', 'add {item} to list'],
  })
  async addItem(item: string) {
    // AI needs permission for write operations
    const event = new CustomEvent('example-tool-add-item', {
      detail: { item }
    });
    window.dispatchEvent(event);
    return { success: true, message: `Added: "${item}"` };
  }

  @DestructiveTool({
    elementId: Data.deleteButton,
    containerId: DemoContainers.DemoSimple.id,
    description: 'Delete an item from the list',
    examples: ['delete item {index}', 'remove item {index}', 'delete item number {index}'],
  })
  async deleteItem(index: number) {
    const event = new CustomEvent('example-tool-delete-item', {
      detail: { index }
    });
    window.dispatchEvent(event);
    return { success: true, message: `Deleted item ${index}` };
  }
}

// Register all tools
export function registerExampleTools() {
  // Import ToolRegistry to update instances
  if (typeof window !== 'undefined') {
    try {
      const registry = (window as any).__SUPERNAL_TOOL_REGISTRY__;

      if (registry) {
        // NEW: Component-namespaced tools
        const counterComponent = new CounterComponent();

        // LEGACY: Flat-namespaced tools (for backward compat testing)
        const counterTools = new CounterTools();
        const chatTools = new ChatTools();
        const settingsTools = new SettingsTools();
        const dataTools = new DataTools();

        // Update instances in registry
        const updateInstances = (instance: any, className: string) => {
          Array.from(registry.values()).forEach((tool: any) => {
            // Match by class name and update instance
            const toolId = `${className}.${tool.methodName}`;
            if (registry.has(toolId)) {
              const toolMetadata = registry.get(toolId);
              if (toolMetadata) {
                toolMetadata.instance = instance;
                console.log(`✓ Updated instance for: ${tool.name}`);
              }
            }
          });
        };

        updateInstances(counterComponent, 'CounterComponent');
        updateInstances(counterTools, 'CounterTools');
        updateInstances(chatTools, 'ChatTools');
        updateInstances(settingsTools, 'SettingsTools');
        updateInstances(dataTools, 'DataTools');
      }
    } catch (error) {
      console.error('Failed to update tool instances:', error);
    }
  } else {
    // Fallback: Just create instances (for SSR)
    new CounterComponent();
    new CounterTools();
    new ChatTools();
    new SettingsTools();
    new DataTools();
  }
}
