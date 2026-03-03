/**
 * Enhanced code snippets with shorthand and full spec versions
 * Includes command examples for each tool
 */

export interface CommandExample {
  command: string;
  description: string;
}

export interface CodeSnippetEnhanced {
  commands: CommandExample[];
  names?: string;
  tool: {
    shorthand: string;
    fullSpec: string;
  };
  component?: string;
}

export const enhancedSnippets: Record<string, CodeSnippetEnhanced> = {
  aiTool: {
    commands: [
      { command: "increment the counter", description: "Adds 1 to the counter" },
      { command: "increase counter", description: "Alternative phrasing" },
    ],
    names: `export const Counter = {
  incrementButton: 'examples-counter-increment'
} as const;`,
    tool: {
      shorthand: `@AITool({
  elementId: Counter.incrementButton,
  description: 'Increment counter by 1'
})
async increment() {
  const button = document.querySelector(
    \`[data-testid="\${Counter.incrementButton}"]\`
  );
  button?.click();
  return { success: true };
}`,
      fullSpec: `@Tool({
  elementId: Counter.incrementButton,
  description: 'Increment the counter by 1',
  category: ToolCategory.UTILITY,
  permissions: {
    ai: true,
    test: false,
    user: true
  },
  callbacks: {
    storage: false,
    navigation: false
  },
  tags: ['counter', 'increment', 'utility'],
  examples: [
    'increment the counter',
    'increase counter by one'
  ]
})
async increment() {
  const button = document.querySelector(
    \`[data-testid="\${Counter.incrementButton}"]\`
  );
  if (!button) {
    throw new Error('Counter button not found');
  }
  button.click();
  return { 
    success: true,
    message: 'Counter incremented'
  };
}`
    },
    component: `export const SimpleWidget: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <div>Count: {count}</div>
      <button 
        data-testid={Counter.incrementButton}
        onClick={() => setCount(c => c + 1)}
      >
        Increment
      </button>
    </div>
  );
};`
  },

  testTool: {
    commands: [
      { command: "decrement counter", description: "Subtracts 1 from counter" },
      { command: "decrease the counter", description: "Alternative phrasing" },
    ],
    names: `export const Counter = {
  decrementButton: 'examples-counter-decrement'
} as const;`,
    tool: {
      shorthand: `@TestTool({
  elementId: Counter.decrementButton,
  description: 'Decrement counter by 1'
})
async decrement() {
  const button = document.querySelector(
    \`[data-testid="\${Counter.decrementButton}"]\`
  );
  button?.click();
  return { success: true };
}`,
      fullSpec: `@Tool({
  elementId: Counter.decrementButton,
  description: 'Decrement the counter by 1',
  category: ToolCategory.UTILITY,
  permissions: {
    ai: false,     // Not exposed to AI
    test: true,    // Only for automated tests
    user: true
  },
  autoGenerateTest: true,
  testConfig: {
    expectedResult: 'Counter decremented',
    timeout: 5000
  }
})
async decrement() {
  const button = document.querySelector(
    \`[data-testid="\${Counter.decrementButton}"]\`
  );
  button?.click();
  return { 
    success: true,
    message: 'Counter decremented'
  };
}`
    }
  },

  chatTool: {
    commands: [
      { command: "send message hello world", description: "Sends 'hello world' to chat" },
      { command: "send a chat saying test", description: "Sends 'test' message" },
    ],
    names: `export const Chat = {
  sendButton: 'examples-chat-send',
  inputField: 'examples-chat-input'
} as const;`,
    tool: {
      shorthand: `@AITool({
  elementId: Chat.sendButton,
  description: 'Send a chat message',
  parameterExtraction: {
    message: {
      type: 'string',
      required: true,
      description: 'The message to send'
    }
  }
})
async sendMessage(message: string) {
  const input = document.querySelector(
    \`[data-testid="\${Chat.inputField}"]\`
  ) as HTMLInputElement;
  
  input.value = message;
  
  const button = document.querySelector(
    \`[data-testid="\${Chat.sendButton}"]\`
  );
  button?.click();
  
  return { success: true, message: \`Sent: "\${message}"\` };
}`,
      fullSpec: `@Tool({
  elementId: Chat.sendButton,
  description: 'Send a message in the chat',
  category: ToolCategory.CHAT,
  permissions: {
    ai: true,
    test: true,
    user: true
  },
  parameterExtraction: {
    message: {
      type: 'string',
      required: true,
      description: 'The message text to send',
      validation: (val) => val.length > 0 && val.length <= 500
    }
  },
  callbacks: {
    storage: true,  // Can access Component Memory
    navigation: false
  },
  tags: ['chat', 'messaging', 'communication'],
  examples: [
    'send message hello',
    'send a chat saying test',
    'message in chat: how are you?'
  ]
})
async sendMessage(
  message: string,
  options?: {
    onSuccess?: (result: any) => void;
    storage?: ComponentStorage;
  }
) {
  const input = document.querySelector(
    \`[data-testid="\${Chat.inputField}"]\`
  ) as HTMLInputElement;
  
  if (!input) {
    throw new Error('Chat input not found');
  }
  
  input.value = message;
  
  const button = document.querySelector(
    \`[data-testid="\${Chat.sendButton}"]\`
  );
  
  if (!button) {
    throw new Error('Send button not found');
  }
  
  button.click();
  
  // Store in Component Memory if available
  if (options?.storage) {
    await options.storage.set('lastMessage', message);
  }
  
  const result = { 
    success: true, 
    message: \`Sent: "\${message}"\`,
    timestamp: new Date().toISOString()
  };
  
  options?.onSuccess?.(result);
  
  return result;
}`
    },
    component: `export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };
  
  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        data-testid={Chat.inputField}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button 
        data-testid={Chat.sendButton}
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};`
  },

  dangerousTool: {
    commands: [
      { command: "reset all settings", description: "Resets settings to defaults" },
      { command: "restore default settings", description: "Alternative phrasing" },
    ],
    names: `export const Settings = {
  resetButton: 'examples-settings-reset'
} as const;`,
    tool: {
      shorthand: `@DangerousTool({
  elementId: Settings.resetButton,
  description: 'Reset all settings to defaults'
})
async resetSettings() {
  const button = document.querySelector(
    \`[data-testid="\${Settings.resetButton}"]\`
  );
  button?.click();
  return { success: true };
}`,
      fullSpec: `@Tool({
  elementId: Settings.resetButton,
  description: 'Reset all settings to their default values',
  category: ToolCategory.SETTINGS,
  permissions: {
    ai: 'dangerous',  // Requires explicit confirmation
    test: true,
    user: true
  },
  confirmationRequired: true,
  confirmationMessage: 'Are you sure you want to reset all settings? This cannot be undone.',
  callbacks: {
    storage: true,
    navigation: false
  },
  tags: ['settings', 'reset', 'dangerous']
})
async resetSettings(
  options?: {
    onSuccess?: () => void;
    storage?: ComponentStorage;
  }
) {
  const button = document.querySelector(
    \`[data-testid="\${Settings.resetButton}"]\`
  );
  
  if (!button) {
    throw new Error('Reset button not found');
  }
  
  button.click();
  
  // Clear Component Memory
  if (options?.storage) {
    await options.storage.clear();
  }
  
  options?.onSuccess?.();
  
  return { 
    success: true,
    message: 'Settings reset to defaults'
  };
}`
    }
  },

  dataWriteTool: {
    commands: [
      { command: "add item new task", description: "Adds 'new task' to the list" },
      { command: "add new item buy milk", description: "Adds 'buy milk' to list" },
    ],
    names: `export const Data = {
  addButton: 'examples-data-add',
  inputField: 'examples-data-input'
} as const;`,
    tool: {
      shorthand: `@DataWriteTool({
  elementId: Data.addButton,
  description: 'Add item to the list',
  parameterExtraction: {
    item: {
      type: 'string',
      required: true,
      description: 'Item to add'
    }
  }
})
async addItem(item: string) {
  const input = document.querySelector(
    \`[data-testid="\${Data.inputField}"]\`
  ) as HTMLInputElement;
  input.value = item;
  
  const button = document.querySelector(
    \`[data-testid="\${Data.addButton}"]\`
  );
  button?.click();
  
  return { success: true };
}`,
      fullSpec: `@Tool({
  elementId: Data.addButton,
  description: 'Add a new item to the data list',
  category: ToolCategory.DATA,
  permissions: {
    ai: 'restricted',  // AI needs permission for writes
    test: true,
    user: true
  },
  parameterExtraction: {
    item: {
      type: 'string',
      required: true,
      description: 'The item text to add',
      validation: (val) => val.trim().length > 0
    }
  },
  dataAccess: {
    reads: [],
    writes: ['data-list'],
    modifies: ['data-list']
  },
  callbacks: {
    storage: true,
    navigation: false
  },
  tags: ['data', 'write', 'create']
})
async addItem(
  item: string,
  options?: {
    onSuccess?: (item: string) => void;
    storage?: ComponentStorage;
  }
) {
  const input = document.querySelector(
    \`[data-testid="\${Data.inputField}"]\`
  ) as HTMLInputElement;
  
  if (!input) {
    throw new Error('Input field not found');
  }
  
  input.value = item;
  
  const button = document.querySelector(
    \`[data-testid="\${Data.addButton}"]\`
  );
  
  if (!button) {
    throw new Error('Add button not found');
  }
  
  button.click();
  
  // Store in Component Memory
  if (options?.storage) {
    const existing = await options.storage.get('items') || [];
    await options.storage.set('items', [...existing, item]);
  }
  
  options?.onSuccess?.(item);
  
  return { 
    success: true,
    message: \`Added: "\${item}"\`
  };
}`
    },
    component: `export const DataWidget: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const handleAdd = () => {
    if (input.trim()) {
      setItems([...items, input]);
      setInput('');
    }
  };
  
  return (
    <div>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <input
        data-testid={Data.inputField}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter item..."
      />
      <button 
        data-testid={Data.addButton}
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};`
  }
};

