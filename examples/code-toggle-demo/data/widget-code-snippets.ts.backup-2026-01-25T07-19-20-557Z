/**
 * Code snippets extracted from ACTUAL working implementations
 * These are the real tool/widget code from src/tools/ExampleTools.ts and src/widgets/index.tsx
 */

import { CodeSnippet } from '../types';

export const widgetCodeSnippets: Record<string, CodeSnippet> = {
  aiTool: {
    component: `export const SimpleWidget: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    window.addEventListener('example-tool-increment', 
      () => setCount(c => c + 1));
    return () => window.removeEventListener('example-tool-increment', ...);
  }, []);
  
  return (
    <div>
      <div>Count: {count}</div>
      <button data-testid={Counter.incrementButton}>
        Increment
      </button>
    </div>
  );
};`,
    tool: `export class CounterTools {
  @AITool({
    toolId: Counter.incrementButton,
    description: 'Increment the counter by 1',
    category: ToolCategory.UTILITY,
  })
  async increment() {
    const event = new CustomEvent('example-tool-increment');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter incremented' };
  }
}`,
    names: `export const Counter = {
  incrementButton: 'examples-counter-increment',
  decrementButton: 'examples-counter-decrement',
  resetButton: 'examples-counter-reset',
} as const;`,
    full: ''
  },
  
  testTool: {
    component: `export const SimpleWidget: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    window.addEventListener('example-tool-decrement',
      () => setCount(c => c - 1));
    return () => window.removeEventListener('example-tool-decrement', ...);
  }, []);
  
  return (
    <button data-testid={Counter.decrementButton}>
      Decrement
    </button>
  );
};`,
    tool: `export class CounterTools {
  @TestTool({
    toolId: Counter.decrementButton,
    description: 'Decrement the counter by 1',
    category: ToolCategory.UTILITY,
  })
  async decrement() {
    const event = new CustomEvent('example-tool-decrement');
    window.dispatchEvent(event);
    return { success: true, message: 'Counter decremented' };
  }
}`,
    names: `export const Counter = {
  decrementButton: 'examples-counter-decrement',
} as const;`,
    full: ''
  },

  classPreset: {
    component: `export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  
  useEffect(() => {
    window.addEventListener('example-tool-send-message', 
      (e: CustomEvent) => {
        setMessages(prev => [...prev, e.detail.message]);
      });
  }, []);
  
  return (
    <button data-testid={Chat.sendButton}>
      Send
    </button>
  );
};`,
    tool: `@ToolPreset(PresetTemplates.Chat)
export class ChatTools {
  @AITool({
    toolId: Chat.sendButton,
    description: 'Send a chat message',
  })
  async sendMessage(message: string) {
    const event = new CustomEvent('example-tool-send-message', {
      detail: { message }
    });
    window.dispatchEvent(event);
    return { success: true, message: \`Sent: "\${message}"\` };
  }
}`,
    names: `export const Chat = {
  sendButton: 'examples-chat-send',
  clearButton: 'examples-chat-clear',
} as const;`,
    full: ''
  },

  presetTemplates: {
    component: `// PresetTemplates define common configurations
// Available: Chat, Settings, Navigation, Data, Onboarding`,
    tool: `// Use built-in preset templates
@ToolPreset(PresetTemplates.Chat)
export class ChatTools {
  // All tools inherit Chat preset config:
  // - category: ToolCategory.CHAT
  // - tags: ["chat", "messaging"]
}

// Or create custom presets
@ToolPreset({ 
  category: ToolCategory.SETTINGS,
  tags: ["config"]
})
export class SettingsTools { }`,
    names: `// Same name contracts as before
export const Chat = {
  sendButton: 'examples-chat-send',
} as const;`,
    full: ''
  },

  dangerousTool: {
    component: `export const SettingsWidget: React.FC = () => {
  useEffect(() => {
    window.addEventListener('example-tool-reset-settings',
      () => setSetting('default'));
  }, []);
  
  return <button>Reset Settings</button>;
};`,
    tool: `@ToolPreset({ category: ToolCategory.SETTINGS })
export class SettingsTools {
  @DangerousTool({
    toolId: Settings.resetButton,
    description: 'Reset all settings to defaults',
  })
  async resetSettings() {
    const event = new CustomEvent('example-tool-reset-settings');
    window.dispatchEvent(event);
    return { success: true, message: 'Settings reset' };
  }
}`,
    names: `export const Settings = {
  resetButton: 'examples-settings-reset',
} as const;`,
    full: ''
  },

  destructiveTool: {
    component: `export const SettingsWidget: React.FC = () => {
  useEffect(() => {
    window.addEventListener('example-tool-delete-data', () => {
      alert('⚠️ All data deleted!');
    });
  }, []);
  
  return <button>Delete All Data</button>;
};`,
    tool: `export class SettingsTools {
  @DestructiveTool({
    toolId: Settings.deleteButton,
    description: 'Permanently delete all user data',
  })
  async deleteAllData() {
    const event = new CustomEvent('example-tool-delete-data');
    window.dispatchEvent(event);
    return { success: true, message: 'Data deleted permanently' };
  }
}`,
    names: `export const Settings = {
  deleteButton: 'examples-settings-delete',
} as const;`,
    full: ''
  },

  onboardingTool: {
    component: `// NOTE: This is a placeholder.
// A real OnboardingWidget should:
// - Highlight specific elements on the page
// - Show tooltips/popovers
// - Guide users through multi-step flows
// See TODO: Create proper OnboardingWidget pattern`,
    tool: `// TODO: OnboardingTools don't exist yet!
// This example shows what it WOULD look like:
@ToolPreset({ category: ToolCategory.ONBOARDING })
export class OnboardingTools {
  @OnboardingTool({
    toolId: 'onboarding-next-step',
    description: 'Go to next onboarding step',
  })
  async nextStep() {
    // Would highlight next element, show tooltip, etc.
  }
}`,
    names: `// Placeholder name contract
export const Onboarding = {
  nextStep: 'examples-onboarding-next',
  prevStep: 'examples-onboarding-prev',
} as const;`,
    full: ''
  },

  dataTool: {
    component: `export const DataWidget: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  
  useEffect(() => {
    window.addEventListener('example-tool-add-item',
      (e: CustomEvent) => {
        setData(prev => [...prev, e.detail.item]);
      });
  }, []);
  
  return (
    <button data-testid={Data.addButton}>
      Add Item
    </button>
  );
};`,
    tool: `@ToolPreset({ category: ToolCategory.DATA })
export class DataTools {
  @DataWriteTool({
    toolId: Data.addButton,
    description: 'Add a new item to the list',
  })
  async addItem(item: string) {
    // AI needs permission for write operations
    const event = new CustomEvent('example-tool-add-item', {
      detail: { item }
    });
    window.dispatchEvent(event);
    return { success: true, message: \`Added: "\${item}"\` };
  }
}`,
    names: `export const Data = {
  addButton: 'examples-data-add',
  fetchButton: 'examples-data-fetch',
  deleteButton: 'examples-data-delete',
} as const;`,
    full: ''
  },

  combinedTool: {
    component: `// This is the same component - no change needed!
export const SimpleWidget: React.FC = () => {
  return <button>Reset</button>;
};`,
    tool: `// Combine AI and Test capabilities in one decorator
export class CounterTools {
  @AIAndTestTool({
    toolId: Counter.resetButton,
    description: 'Reset counter to zero',
    category: ToolCategory.UTILITY,
  })
  async reset() {
    window.dispatchEvent(new CustomEvent('example-tool-reset'));
    return { success: true, message: 'Counter reset' };
  }
}`,
    names: `export const Counter = {
  resetButton: 'examples-counter-reset',
} as const;`,
    full: ''
  }
};

// Fill in full code by combining all parts
for (const key of Object.keys(widgetCodeSnippets)) {
  const snippet = widgetCodeSnippets[key];
  snippet.full = `// ============ NAME CONTRACT ============
${snippet.names}

// ============ TOOL DECORATOR ============
${snippet.tool}

// ============ REACT COMPONENT ============
${snippet.component}`;
}
