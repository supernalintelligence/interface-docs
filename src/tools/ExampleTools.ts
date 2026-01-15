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
  containerId: '/examples',
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
    examples: ['increment counter', 'increase counter by 5'],
    category: ToolCategory.UTILITY,
  })
  increment(amount = 1) {
    this.value += amount;
    const event = new CustomEvent('example-tool-increment', { 
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
    aiEnabled: false, // Test-only
    elementId: Counter.decrementButton,
    description: 'Decrement counter by specified amount',
    examples: ['decrement counter', 'decrease counter by 3'],
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
    containerId: '/examples',
    description: 'Increment the counter by 1',
    category: ToolCategory.UTILITY,
  })
  async incrementLegacy() {
    const event = new CustomEvent('example-tool-increment');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter incremented' };
  }

  @TestTool({
    elementId: Counter.decrementButton,
    containerId: '/examples',
    description: 'Decrement the counter by 1',
    category: ToolCategory.UTILITY,
  })
  async decrementLegacy() {
    const event = new CustomEvent('example-tool-decrement');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter decremented' };
  }

  @AIAndTestTool({
    elementId: Counter.resetButton,
    containerId: '/examples',
    description: 'Reset counter to zero',
    category: ToolCategory.UTILITY,
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
    containerId: '/examples',
    description: 'Send a chat message',
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
    containerId: '/examples',
    description: 'Clear all chat messages',
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
    containerId: '/examples',
    description: 'Change a setting value',
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
    containerId: '/examples',
    description: 'Reset all settings to defaults',
  })
  async resetSettings() {
    const event = new CustomEvent('example-tool-reset-settings');
    window.dispatchEvent(event);
    return { success: true, message: 'Settings reset to defaults' };
  }

  @DestructiveTool({
    elementId: Settings.deleteButton,
    containerId: '/examples',
    description: 'Permanently delete all user data',
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
    containerId: '/examples',
    description: 'Fetch all items from the list',
  })
  async fetchItems() {
    // AI can call this freely - it's read-only
    const event = new CustomEvent('example-tool-fetch-items');
    window.dispatchEvent(event);
    return { success: true, message: 'Items fetched', data: [] };
  }

  @DataWriteTool({
    elementId: Data.addButton,
    containerId: '/examples',
    description: 'Add a new item to the list',
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
    containerId: '/examples',
    description: 'Delete an item from the list',
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
  // NEW: Component-namespaced tools
  new CounterComponent();
  
  // LEGACY: Flat-namespaced tools (for backward compat testing)
  new CounterTools();
  new ChatTools();
  new SettingsTools();
  new DataTools();
}
